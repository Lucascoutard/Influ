<?php
/* ===================================================
   API/WEBAUTHN.PHP — Passkey / WebAuthn (FIDO2)
   POST ?action=register_begin   → creation options
   POST ?action=register_finish  → store credential
   POST ?action=auth_begin       → request options
   POST ?action=auth_finish      → verify & login
   GET  ?action=list             → list user passkeys
   POST ?action=remove           → remove a passkey
   =================================================== */

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/mailer.php';

// ── Relying Party config ─────────────────────────────────────
$scheme   = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host     = $_SERVER['HTTP_HOST'] ?? 'localhost';
define('RP_ID',     preg_replace('/:\d+$/', '', $host)); // strip port
define('RP_NAME',   'Influmatch');
define('RP_ORIGIN', $scheme . '://' . $host);

$action = $_GET['action'] ?? '';

// ════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════

function b64u_enc(string $d): string {
    return rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
}
function b64u_dec(string $d): string {
    $pad = strlen($d) % 4;
    if ($pad) $d .= str_repeat('=', 4 - $pad);
    return base64_decode(strtr($d, '-_', '+/'));
}

// ── Minimal CBOR decoder ─────────────────────────────────────
function cbor_decode(string $data): mixed {
    $o = 0; return _ci($data, $o);
}
function _ci(string $d, int &$o): mixed {
    if ($o >= strlen($d)) return null;
    $b = ord($d[$o++]); $t = $b >> 5; $i = $b & 0x1f;
    $v = _cn($d, $o, $i);
    switch ($t) {
        case 0: return $v;
        case 1: return -1 - $v;
        case 2: $s = substr($d, $o, $v); $o += $v; return $s;
        case 3: $s = substr($d, $o, $v); $o += $v; return $s;
        case 4: $a = []; for ($k=0;$k<$v;$k++) $a[]=_ci($d,$o); return $a;
        case 5: $m = []; for ($k=0;$k<$v;$k++){$key=_ci($d,$o);$m[$key]=_ci($d,$o);} return $m;
    }
    return null;
}
function _cn(string $d, int &$o, int $i): int {
    if ($i < 24) return $i;
    if ($i === 24) return ord($d[$o++]);
    if ($i === 25) { $v=unpack('n',substr($d,$o,2))[1]; $o+=2; return $v; }
    if ($i === 26) { $v=unpack('N',substr($d,$o,4))[1]; $o+=4; return $v; }
    if ($i === 27) { $hi=unpack('N',substr($d,$o,4))[1]; $lo=unpack('N',substr($d,$o+4,4))[1]; $o+=8; return $hi*4294967296+$lo; }
    return 0;
}

// ── DER length encoding ──────────────────────────────────────
function der_len(string $data): string {
    $n = strlen($data);
    if ($n < 128)  return chr($n);
    if ($n < 256)  return "\x81" . chr($n);
    return "\x82" . chr($n >> 8) . chr($n & 0xff);
}

// ── COSE EC P-256 public key → PEM ──────────────────────────
function cose_to_pem(string $coseBytes): string {
    $key = cbor_decode($coseBytes);
    if (!is_array($key)) throw new Exception('Invalid COSE key');

    $alg = $key[3]  ?? null;
    $kty = $key[1]  ?? null;

    if ($kty !== 2 || $alg !== -7)
        throw new Exception('Only ES256 (P-256) is supported. Please use a modern passkey (Apple, Google, Windows Hello, YubiKey).');

    $x = $key[-2] ?? ''; $y = $key[-3] ?? '';
    if (strlen($x) !== 32 || strlen($y) !== 32)
        throw new Exception('Invalid P-256 key coordinates');

    // SubjectPublicKeyInfo DER for EC P-256
    $oidKey   = "\x06\x07\x2a\x86\x48\xce\x3d\x02\x01";        // ecPublicKey
    $oidCurve = "\x06\x08\x2a\x86\x48\xce\x3d\x03\x01\x07";    // prime256v1
    $algo     = "\x30" . der_len($oidKey . $oidCurve) . $oidKey . $oidCurve;
    $point    = "\x04" . $x . $y;
    $bitStr   = "\x03" . der_len("\x00" . $point) . "\x00" . $point;
    $spki     = "\x30" . der_len($algo . $bitStr) . $algo . $bitStr;

    return "-----BEGIN PUBLIC KEY-----\n" . chunk_split(base64_encode($spki), 64, "\n") . "-----END PUBLIC KEY-----\n";
}

// ── Parse binary authenticatorData ──────────────────────────
function parse_auth_data(string $ad): array {
    if (strlen($ad) < 37) throw new Exception('authData too short');
    $rpIdHash  = substr($ad, 0, 32);
    $flags     = ord($ad[32]);
    $signCount = unpack('N', substr($ad, 33, 4))[1];
    $attested  = null;
    if (strlen($ad) > 55 && ($flags & 0x40)) {
        $aaguid   = substr($ad, 37, 16);
        $cidLen   = unpack('n', substr($ad, 53, 2))[1];
        $credId   = substr($ad, 55, $cidLen);
        $pubKey   = substr($ad, 55 + $cidLen);
        $attested = compact('aaguid', 'credId', 'pubKey');
    }
    return compact('rpIdHash', 'flags', 'signCount', 'attested');
}

// ════════════════════════════════════════════════════════════
//  ACTIONS
// ════════════════════════════════════════════════════════════

switch ($action) {

    // ── REGISTER BEGIN ───────────────────────────────────────
    case 'register_begin':
        rateLimit('passkey_reg', 10, 900);
        $data        = getJsonBody();
        $inviteToken = trim($data['invite_token'] ?? '');

        if ($inviteToken) {
            // ── Unauthenticated invite flow ──
            $db   = getDB();
            $stmt = $db->prepare(
                'SELECT * FROM users
                 WHERE invitation_token = ? AND invitation_expires_at > NOW() AND is_active = 1'
            );
            $stmt->execute([$inviteToken]);
            $invUser = $stmt->fetch();
            if (!$invUser)
                jsonResponse(['success' => false, 'message' => 'Invalid or expired invitation link.'], 403);

            $challenge = random_bytes(32);
            $_SESSION['wk_challenge']  = base64_encode($challenge);
            $_SESSION['wk_type']       = 'create';
            $_SESSION['wk_invite_uid'] = (int)$invUser['id'];

            jsonResponse([
                'challenge' => b64u_enc($challenge),
                'rp'        => ['id' => RP_ID, 'name' => RP_NAME],
                'user'      => [
                    'id'          => b64u_enc(pack('N', (int)$invUser['id'])),
                    'name'        => $invUser['email'],
                    'displayName' => trim(($invUser['firstname'] ?? '') . ' ' . ($invUser['lastname'] ?? '')),
                ],
                'pubKeyCredParams'       => [['type' => 'public-key', 'alg' => -7]],
                'authenticatorSelection' => ['residentKey' => 'preferred', 'userVerification' => 'preferred'],
                'timeout'                => 60000,
                'attestation'            => 'none',
                'excludeCredentials'     => [],
            ]);
        } else {
            // ── Authenticated flow (existing user adding passkey) ──
            $user = requireAuth();

            $db   = getDB();
            $stmt = $db->prepare('SELECT credential_id FROM passkey_credentials WHERE user_id = ?');
            $stmt->execute([(int)$user['id']]);
            $exclude = array_map(
                fn($r) => ['type' => 'public-key', 'id' => $r['credential_id']],
                $stmt->fetchAll()
            );

            $challenge = random_bytes(32);
            $_SESSION['wk_challenge'] = base64_encode($challenge);
            $_SESSION['wk_type']      = 'create';

            jsonResponse([
                'challenge' => b64u_enc($challenge),
                'rp'        => ['id' => RP_ID, 'name' => RP_NAME],
                'user'      => [
                    'id'          => b64u_enc(pack('N', (int)$user['id'])),
                    'name'        => $user['email'],
                    'displayName' => trim(($user['firstname'] ?? '') . ' ' . ($user['lastname'] ?? '')),
                ],
                'pubKeyCredParams'       => [['type' => 'public-key', 'alg' => -7]],
                'authenticatorSelection' => ['residentKey' => 'preferred', 'userVerification' => 'preferred'],
                'timeout'                => 60000,
                'attestation'            => 'none',
                'excludeCredentials'     => $exclude,
            ]);
        }
        break;

    // ── REGISTER FINISH ──────────────────────────────────────
    case 'register_finish':
        $inviteUid = isset($_SESSION['wk_invite_uid']) ? (int)$_SESSION['wk_invite_uid'] : null;

        if ($inviteUid) {
            // Invite flow — no session auth required
            $db      = getDB();
            $stmt    = $db->prepare('SELECT * FROM users WHERE id = ? AND is_active = 1');
            $stmt->execute([$inviteUid]);
            $invUser = $stmt->fetch();
            if (!$invUser) jsonResponse(['success' => false, 'message' => 'Invalid session.'], 400);
            $userId = $inviteUid;
        } else {
            $authUser = requireAuth();
            $db       = getDB();
            $userId   = (int)$authUser['id'];
        }

        $data = getJsonBody();

        if (empty($_SESSION['wk_challenge']) || ($_SESSION['wk_type'] ?? '') !== 'create')
            jsonResponse(['success' => false, 'message' => 'Invalid session.'], 400);

        $expected = base64_decode($_SESSION['wk_challenge']);
        unset($_SESSION['wk_challenge'], $_SESSION['wk_type']);

        try {
            $cdj = b64u_dec($data['clientDataJSON'] ?? '');
            $cd  = json_decode($cdj, true);
            if (!$cd)                                               throw new Exception('Invalid clientDataJSON');
            if ($cd['type'] !== 'webauthn.create')                  throw new Exception('Wrong type');
            if (b64u_dec($cd['challenge']) !== $expected)           throw new Exception('Challenge mismatch');
            if (rtrim($cd['origin'], '/') !== rtrim(RP_ORIGIN, '/')) throw new Exception('Origin mismatch');

            $attObj = cbor_decode(b64u_dec($data['attestationObject'] ?? ''));
            if (!isset($attObj['authData']))                        throw new Exception('Missing authData');

            $parsed = parse_auth_data($attObj['authData']);
            if (!$parsed['attested'])                               throw new Exception('No attested credential data');
            if ($parsed['rpIdHash'] !== hash('sha256', RP_ID, true)) throw new Exception('RP ID mismatch');
            if (!($parsed['flags'] & 0x01))                        throw new Exception('User presence not set');

            $credId    = b64u_enc($parsed['attested']['credId']);
            $pubKeyB64 = base64_encode($parsed['attested']['pubKey']);
            $signCount = $parsed['signCount'];
            $name      = substr(trim($data['deviceName'] ?? 'My passkey'), 0, 100) ?: 'My passkey';

            $chk = $db->prepare('SELECT id FROM passkey_credentials WHERE credential_id = ?');
            $chk->execute([$credId]);
            if ($chk->fetch()) throw new Exception('Passkey already registered.');

            $db->prepare('INSERT INTO passkey_credentials (user_id, credential_id, public_key, sign_count, device_name) VALUES (?,?,?,?,?)')
               ->execute([$userId, $credId, $pubKeyB64, $signCount, $name]);

            if ($inviteUid) {
                // Activate account: clear invitation token
                unset($_SESSION['wk_invite_uid']);
                $db->prepare('UPDATE users SET invitation_token = NULL, invitation_expires_at = NULL WHERE id = ?')
                   ->execute([$inviteUid]);

                // Auto-login
                session_regenerate_id(true);
                $stmt2 = $db->prepare('SELECT * FROM users WHERE id = ?');
                $stmt2->execute([$inviteUid]);
                $freshUser = $stmt2->fetch();
                $_SESSION['user'] = sanitizeUser($freshUser);
                $db->prepare('UPDATE users SET last_login = NOW() WHERE id = ?')->execute([$inviteUid]);

                // Send registration confirmation email (non-blocking).
                $fullName = trim(($freshUser['firstname'] ?? '') . ' ' . ($freshUser['lastname'] ?? ''));
                $mailHtml = mailTemplateRegistrationConfirmation($freshUser['firstname'] ?? 'there');
                $mailSent = sendMail(
                    $freshUser['email'] ?? '',
                    $fullName !== '' ? $fullName : ($freshUser['firstname'] ?? 'User'),
                    'Your Influmatch account registration confirmation',
                    $mailHtml
                );
                if (!$mailSent) {
                    error_log('[Influmatch] Registration confirmation email failed for user_id=' . $inviteUid);
                }

                jsonResponse([
                    'success'   => true,
                    'autologin' => true,
                    'user'      => sanitizeUser($freshUser),
                    'message'   => 'Passkey registered. Welcome to Influmatch!',
                ]);
            } else {
                jsonResponse(['success' => true, 'message' => 'Passkey registered successfully.']);
            }
        } catch (Exception $e) {
            error_log('[WebAuthn register] ' . $e->getMessage());
            jsonResponse(['success' => false, 'message' => $e->getMessage()], 400);
        }
        break;

    // ── AUTH BEGIN ───────────────────────────────────────────
    case 'auth_begin':
        $data  = getJsonBody();
        $email = strtolower(trim($data['email'] ?? ''));

        $challenge = random_bytes(32);
        $_SESSION['wk_challenge'] = base64_encode($challenge);
        $_SESSION['wk_type']      = 'get';

        $allowCredentials = [];
        if ($email) {
            $db   = getDB();
            $stmt = $db->prepare('SELECT pc.credential_id FROM passkey_credentials pc JOIN users u ON u.id = pc.user_id WHERE u.email = ? AND u.is_active = 1');
            $stmt->execute([$email]);
            $allowCredentials = array_map(
                fn($r) => ['type' => 'public-key', 'id' => $r['credential_id']],
                $stmt->fetchAll()
            );
        }

        jsonResponse([
            'challenge'        => b64u_enc($challenge),
            'rpId'             => RP_ID,
            'userVerification' => 'preferred',
            'timeout'          => 60000,
            'allowCredentials' => $allowCredentials,
        ]);
        break;

    // ── AUTH FINISH ──────────────────────────────────────────
    case 'auth_finish':
        $data = getJsonBody();
        rateLimit('passkey_auth', 15, 900);

        if (empty($_SESSION['wk_challenge']) || ($_SESSION['wk_type'] ?? '') !== 'get')
            jsonResponse(['success' => false, 'message' => 'Invalid session.'], 400);

        $expected = base64_decode($_SESSION['wk_challenge']);
        unset($_SESSION['wk_challenge'], $_SESSION['wk_type']);

        try {
            $credId = $data['id'] ?? '';
            $db     = getDB();
            $stmt   = $db->prepare('SELECT pc.*, u.id AS uid, u.firstname, u.lastname, u.email, u.role, u.avatar, u.phone, u.company, u.address, u.city, u.state, u.zip, u.country, u.is_active FROM passkey_credentials pc JOIN users u ON u.id = pc.user_id WHERE pc.credential_id = ?');
            $stmt->execute([$credId]);
            $row = $stmt->fetch();
            if (!$row || !$row['is_active']) throw new Exception('Unknown credential.');

            $cdj = b64u_dec($data['clientDataJSON'] ?? '');
            $cd  = json_decode($cdj, true);
            if (!$cd)                                          throw new Exception('Invalid clientDataJSON');
            if ($cd['type'] !== 'webauthn.get')                throw new Exception('Wrong type');
            if (b64u_dec($cd['challenge']) !== $expected)      throw new Exception('Challenge mismatch');
            if (rtrim($cd['origin'], '/') !== rtrim(RP_ORIGIN, '/')) throw new Exception('Origin mismatch');

            $authDataBytes = b64u_dec($data['authenticatorData'] ?? '');
            $parsed        = parse_auth_data($authDataBytes);
            if ($parsed['rpIdHash'] !== hash('sha256', RP_ID, true)) throw new Exception('RP ID mismatch');
            if (!($parsed['flags'] & 0x01))                   throw new Exception('User presence not set');

            // Verify signature
            $pem      = cose_to_pem(base64_decode($row['public_key']));
            $sigData  = $authDataBytes . hash('sha256', $cdj, true);
            $sig      = b64u_dec($data['signature'] ?? '');
            $valid    = openssl_verify($sigData, $sig, $pem, OPENSSL_ALGO_SHA256);
            if ($valid !== 1) throw new Exception('Invalid signature.');

            // Replay protection
            $newCount = $parsed['signCount'];
            if ($newCount !== 0 && $newCount <= (int)$row['sign_count']) {
                error_log('[WebAuthn] Possible cloned authenticator uid=' . $row['uid']);
                throw new Exception('Security alert: possible cloned authenticator.');
            }

            // Commit
            $db->prepare('UPDATE passkey_credentials SET sign_count=?, last_used_at=NOW() WHERE credential_id=?')
               ->execute([$newCount, $credId]);

            session_regenerate_id(true);
            $userArr = [
                'id'        => $row['uid'],
                'firstname' => $row['firstname'],
                'lastname'  => $row['lastname'],
                'email'     => $row['email'],
                'role'      => $row['role'],
                'avatar'    => $row['avatar'],
                'phone'     => $row['phone'],
                'company'   => $row['company'],
                'address'   => $row['address']   ?? null,
                'city'      => $row['city']       ?? null,
                'state'     => $row['state']      ?? null,
                'zip'       => $row['zip']        ?? null,
                'country'   => $row['country']    ?? null,
            ];
            $_SESSION['user'] = $userArr;
            $db->prepare('UPDATE users SET last_login=NOW() WHERE id=?')->execute([$row['uid']]);
            rateLimitReset('passkey_auth');

            jsonResponse(['success' => true, 'user' => $userArr]);
        } catch (Exception $e) {
            error_log('[WebAuthn auth] ' . $e->getMessage());
            jsonResponse(['success' => false, 'message' => 'Authentication failed.'], 401);
        }
        break;

    // ── LIST ─────────────────────────────────────────────────
    case 'list':
        $user = requireAuth();
        $db   = getDB();
        $stmt = $db->prepare('SELECT id, device_name, created_at, last_used_at FROM passkey_credentials WHERE user_id = ? ORDER BY created_at DESC');
        $stmt->execute([(int)$user['id']]);
        jsonResponse(['success' => true, 'passkeys' => $stmt->fetchAll()]);
        break;

    // ── REMOVE ───────────────────────────────────────────────
    case 'remove':
        $user = requireAuth();
        $data = getJsonBody();
        $id   = (int)($data['id'] ?? 0);
        if (!$id) jsonResponse(['success' => false, 'message' => 'Invalid ID.'], 422);
        $db   = getDB();
        $stmt = $db->prepare('SELECT id FROM passkey_credentials WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, (int)$user['id']]);
        if (!$stmt->fetch()) jsonResponse(['success' => false, 'message' => 'Not found.'], 404);
        $db->prepare('DELETE FROM passkey_credentials WHERE id = ?')->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Passkey removed.']);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Unknown action.'], 400);
}
