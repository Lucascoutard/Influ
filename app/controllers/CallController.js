/* ===================================================
   APP/CONTROLLERS/CALLCONTROLLER.JS
   Appels audio/vidÃ©o WebRTC â€” signalisation via polling
   =================================================== */

const CallController = {

  _pc:              null,   // RTCPeerConnection
  _localStream:     null,   // Flux local (micro + camÃ©ra)
  _convId:          null,   // ID de la conversation en appel
  _lastSignalId:    0,      // Dernier signal traitÃ© (poll en cours d'appel)
  _listenLastId:    0,      // Dernier signal traitÃ© (Ã©coute globale)
  _callInitializing:false,  // Guard anti double-clic sur les boutons d'appel
  _pollInterval:    null,   // Poll pendant l'appel
  _listenInterval:  null,   // Poll global (appels entrants)
  _durationInterval:null,   // Timer de durÃ©e
  _durationSecs:    0,
  _pendingOffer:    null,   // Offer WebRTC en attente d'acceptation
  _pendingSignalId: 0,
  _callerName:      '',
  _withVideo:       true,   // true = vidÃ©o+audio, false = audio seulement
  _micEnabled:      true,
  _camEnabled:      true,
  _iceCandidateQueue: [],   // ICE reÃ§us avant setRemoteDescription

  ICE_CONFIG: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      {
        urls: [
          'turn:influmatch.metered.live:80',
          'turn:influmatch.metered.live:80?transport=tcp',
          'turn:influmatch.metered.live:443',
          'turn:influmatch.metered.live:443?transport=tcp',
          'turns:influmatch.metered.live:443?transport=tcp',
        ],
        username:   '821134c37d96a5383fe63deb',
        credential: 'H90fTQNf0p9Oijzj',
      },
    ]
  },

  // ================================================================
  //  INIT â€” dÃ©marrage de l'Ã©coute globale des appels entrants
  // ================================================================

  startListening() {
    this.stopListening();
    // Ne pas remettre _listenLastId Ã  0 : Ã©vite de re-dÃ©tecter d'anciens offers
    this._listenInterval = setInterval(() => this._listenForCalls(), 3000);
  },

  stopListening() {
    if (this._listenInterval) { clearInterval(this._listenInterval); this._listenInterval = null; }
  },

  async _listenForCalls() {
    if (this._pc) return; // DÃ©jÃ  en appel
    try {
      const res  = await fetch(`api/calls.php?action=listen&after_id=${this._listenLastId}`);
      const data = await res.json();
      for (const signal of (data.signals || [])) {
        this._listenLastId = Math.max(this._listenLastId, signal.id);
        if (signal.type === 'offer') {
          this._onIncomingOffer(signal);
          break; // Un seul appel Ã  la fois
        }
      }
    } catch (_) {}
  },

  // ================================================================
  //  APPEL SORTANT (caller)
  // ================================================================

  async startCall(convId, convName, withVideo = true) {
    if (this._pc || this._callInitializing) { return; } // DÃ©jÃ  en appel ou en cours d'init
    this._callInitializing = true;

    this._convId     = convId;
    this._callerName = convName;
    this._withVideo  = withVideo;

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: withVideo });
    } catch (e) {
      this._callInitializing = false;
      this._showMediaError(e);
      return;
    }

    this._localStream = stream;
    this._pc = this._createPC();
    this._callInitializing = false; // _pc est set, le guard n'est plus nÃ©cessaire
    stream.getTracks().forEach(t => this._pc.addTrack(t, stream));

    const offer = await this._pc.createOffer();
    await this._pc.setLocalDescription(offer);

    // On encapsule l'offer avec le type d'appel pour que le callee le sache
    let signalRes;
    try {
      signalRes = await this._sendSignal('offer', { sdp: offer, withVideo });
    } catch (_) {
      this._cleanup();
      return;
    }
    this._lastSignalId = signalRes.id || 0;

    // Mise Ã  jour de _listenLastId pour ignorer cet offer lors de futures Ã©coutes
    this._listenLastId = Math.max(this._listenLastId, this._lastSignalId);

    this._showCallingUI(convName);
    this._insertCallEvent('outgoing');
    this._startCallPoll();
  },

  // ================================================================
  //  APPEL ENTRANT (callee)
  // ================================================================

  _onIncomingOffer(signal) {
    // Le payload contient { sdp, withVideo }
    const payload         = signal.payload || {};
    this._pendingOffer    = payload.sdp ?? payload; // compatibilitÃ© si sdp direct
    this._withVideo       = payload.withVideo !== false;
    this._pendingSignalId = signal.id;
    this._convId          = signal.conversation_id;
    this._callerName      = `${signal.firstname} ${signal.lastname}`;
    this._showIncomingUI();
  },

  async acceptCall() {
    const offer    = this._pendingOffer;
    const sigId    = this._pendingSignalId;
    if (!offer) return;

    document.getElementById('callIncomingUI')?.remove();

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: this._withVideo });
    } catch (e) {
      this._showMediaError(e);
      await this._sendSignal('reject', {}).catch(() => {});
      this._pendingOffer = null;
      return;
    }

    this._localStream = stream;
    this._pc = this._createPC();
    stream.getTracks().forEach(t => this._pc.addTrack(t, stream));

    await this._pc.setRemoteDescription(new RTCSessionDescription(offer));

    // Vider la queue ICE reÃ§us avant setRemoteDescription
    for (const c of this._iceCandidateQueue) {
      try { await this._pc.addIceCandidate(new RTCIceCandidate(c)); } catch (_) {}
    }
    this._iceCandidateQueue = [];

    const answer = await this._pc.createAnswer();
    await this._pc.setLocalDescription(answer);

    await this._sendSignal('answer', answer);
    this._lastSignalId = sigId;

    this._pendingOffer    = null;
    this._pendingSignalId = 0;

    this._showCallUI();
    this._startCallPoll();
  },

  async rejectCall() {
    await this._sendSignal('reject', {}).catch(() => {});
    this._insertCallEvent('missed');
    await this._saveCallEvent('missed', null).catch(() => {});
    this._pendingOffer    = null;
    this._pendingSignalId = 0;
    document.getElementById('callIncomingUI')?.remove();
  },

  // ================================================================
  //  FIN D'APPEL
  // ================================================================

  async endCall() {
    if (this._convId) await this._sendSignal('hangup', {}).catch(() => {});
    this._insertCallEvent('ended', this._durationSecs);
    await this._saveCallEvent('ended', this._durationSecs).catch(() => {});
    this._cleanup();
  },

  // ================================================================
  //  RTCPEERCONNECTION
  // ================================================================

  _createPC() {
    const pc = new RTCPeerConnection(this.ICE_CONFIG);

    // ICE timeout: hang up if no connection within 20 seconds
    const iceTimeout = setTimeout(() => {
      if (pc.connectionState !== 'connected') {
        const statusEl = document.getElementById('callStatus');
        if (statusEl) statusEl.textContent = 'Connection failed';
        setTimeout(() => this._cleanup(), 1500);
      }
    }, 20000);

    pc.onicecandidate = e => {
      if (e.candidate) {
        this._sendSignal('ice_candidate', e.candidate).catch(() => {});
      }
    };

    pc.ontrack = e => {
      const remoteVideo = document.getElementById('callRemoteVideo');
      if (remoteVideo && e.streams[0]) {
        remoteVideo.srcObject = e.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      const statusEl = document.getElementById('callStatus');
      if (statusEl) {
        if (state === 'connected')    statusEl.textContent = '';
        if (state === 'connecting')   statusEl.textContent = 'Connecting…';
        if (state === 'disconnected') statusEl.textContent = 'Connection lost…';
      }
      if (state === 'connected') clearTimeout(iceTimeout);
      if (['disconnected', 'failed', 'closed'].includes(state)) {
        clearTimeout(iceTimeout);
        setTimeout(() => this._cleanup(), 1500);
      }
    };

    return pc;
  },

  // ================================================================
  //  POLLING PENDANT L'APPEL
  // ================================================================

  _startCallPoll() {
    this._stopCallPoll();
    this._pollInterval = setInterval(() => this._pollSignals(), 1000);
  },

  _stopCallPoll() {
    if (this._pollInterval) { clearInterval(this._pollInterval); this._pollInterval = null; }
  },

  async _pollSignals() {
    if (!this._convId || !this._pc) return;
    try {
      const res  = await fetch(`api/calls.php?action=poll&conversation_id=${this._convId}&after_id=${this._lastSignalId}`);
      const data = await res.json();

      for (const signal of (data.signals || [])) {
        this._lastSignalId = Math.max(this._lastSignalId, signal.id);
        await this._handleSignal(signal);
      }
    } catch (_) {}
  },

  async _handleSignal(signal) {
    switch (signal.type) {

      case 'answer':
        if (this._pc && this._pc.signalingState === 'have-local-offer') {
          await this._pc.setRemoteDescription(new RTCSessionDescription(signal.payload.sdp ?? signal.payload));
          // Vider queue ICE
          for (const c of this._iceCandidateQueue) {
            try { await this._pc.addIceCandidate(new RTCIceCandidate(c)); } catch (_) {}
          }
          this._iceCandidateQueue = [];
          // Afficher l'UI d'appel (on est maintenant connectÃ©)
          this._showCallUI();
        }
        break;

      case 'ice_candidate':
        if (signal.payload) {
          if (this._pc && this._pc.remoteDescription) {
            try { await this._pc.addIceCandidate(new RTCIceCandidate(signal.payload)); } catch (_) {}
          } else {
            this._iceCandidateQueue.push(signal.payload);
          }
        }
        break;

      case 'hangup':
        this._onRemoteHangup(false);
        break;

      case 'reject':
        this._onRemoteHangup(true);
        break;
    }
  },

  _onRemoteHangup(rejected) {
    if (rejected) {
      const statusEl = document.getElementById('callStatus');
      if (statusEl) statusEl.textContent = 'Call declined';
      this._insertCallEvent('rejected');
      setTimeout(() => this._cleanup(), 1800);
    } else {
      this._insertCallEvent('ended', this._durationSecs);
      this._cleanup();
    }
  },

  // ================================================================
  //  CONTRÃ”LES MIC / CAMÃ‰RA
  // ================================================================

  toggleMic() {
    const track = this._localStream?.getAudioTracks()[0];
    if (!track) return;
    this._micEnabled = !this._micEnabled;
    track.enabled   = this._micEnabled;
    const btn = document.getElementById('callMicBtn');
    if (btn) btn.classList.toggle('call-ctrl--muted', !this._micEnabled);
    btn.title = this._micEnabled ? 'Mute microphone' : 'Unmute microphone';
  },

  toggleCamera() {
    const track = this._localStream?.getVideoTracks()[0];
    if (!track) return;
    this._camEnabled = !this._camEnabled;
    track.enabled   = this._camEnabled;
    const localVideo = document.getElementById('callLocalVideo');
    if (localVideo) localVideo.style.opacity = this._camEnabled ? '1' : '0.3';
    const btn = document.getElementById('callCamBtn');
    if (btn) btn.classList.toggle('call-ctrl--muted', !this._camEnabled);
    btn.title = this._camEnabled ? 'Turn off camera' : 'Turn on camera';
  },

  // ================================================================
  //  UI â€” APPEL EN COURS (attente de rÃ©ponse)
  // ================================================================

  _showCallingUI(name) {
    document.getElementById('callOverlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id        = 'callOverlay';
    overlay.className = 'call-overlay call-overlay--calling';
    overlay.innerHTML = `
      <div class="call-calling-card">
        <div class="call-avatar-ring">
          <div class="call-avatar">${this._esc(name).charAt(0).toUpperCase()}</div>
        </div>
        <div class="call-calling-name">${this._esc(name)}</div>
        <div class="call-calling-status" id="callStatus">${this._withVideo ? 'Video call in progress...' : 'Audio call in progress...'}</div>
        <div class="call-waves">
          <span></span><span></span><span></span>
        </div>
        <button class="call-end-btn" onclick="CallController.endCall()" title="Hang up">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.56 21 3 13.44 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
  },

  // ================================================================
  //  UI â€” APPEL CONNECTÃ‰
  // ================================================================

  _showCallUI() {
    document.getElementById('callOverlay')?.remove();

    this._durationSecs = 0;
    this._micEnabled   = true;
    this._camEnabled   = true;

    const overlay = document.createElement('div');
    overlay.id        = 'callOverlay';
    overlay.className = 'call-overlay call-overlay--active';
    overlay.innerHTML = `
      ${this._withVideo ? `
        <!-- VidÃ©o distante (fond) -->
        <video id="callRemoteVideo" class="call-remote-video" autoplay playsinline></video>
        <div class="call-remote-placeholder" id="callRemotePlaceholder">
          <div class="call-avatar call-avatar--lg">${this._esc(this._callerName).charAt(0).toUpperCase()}</div>
        </div>
        <!-- VidÃ©o locale (PIP) -->
        <video id="callLocalVideo" class="call-local-video" autoplay playsinline muted></video>
      ` : `
        <!-- Mode audio : avatar centrÃ© -->
        <div class="call-audio-screen">
          <div class="call-avatar-ring">
            <div class="call-avatar call-avatar--lg">${this._esc(this._callerName).charAt(0).toUpperCase()}</div>
          </div>
          <div class="call-audio-name">${this._esc(this._callerName)}</div>
          <div class="call-audio-label">Audio call</div>
        </div>
      `}

      <!-- En-tÃªte -->
      <div class="call-topbar">
        <div class="call-topbar-name">${this._esc(this._callerName)}</div>
        <div class="call-topbar-timer" id="callTimer">00:00</div>
        <div class="call-status-msg" id="callStatus"></div>
      </div>

      <!-- ContrÃ´les -->
      <div class="call-controls">
        <button id="callMicBtn" class="call-ctrl-btn" onclick="CallController.toggleMic()" title="Mute microphone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
            <line class="call-ctrl-slash" x1="2" y1="2" x2="22" y2="22"/>
          </svg>
        </button>
        ${this._withVideo ? `
        <button id="callCamBtn" class="call-ctrl-btn" onclick="CallController.toggleCamera()" title="Turn off camera">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            <line class="call-ctrl-slash" x1="2" y1="2" x2="22" y2="22"/>
          </svg>
        </button>` : ''}
        <button class="call-ctrl-btn call-ctrl-btn--end" onclick="CallController.endCall()" title="Hang up">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.56 21 3 13.44 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(overlay);

    if (this._withVideo) {
      // Brancher le flux local sur la balise vidÃ©o
      const localVideo = document.getElementById('callLocalVideo');
      if (localVideo && this._localStream) {
        localVideo.srcObject = this._localStream;
      }

      // Masquer le placeholder quand la vidÃ©o distante arrive
      const remoteVideo = document.getElementById('callRemoteVideo');
      if (remoteVideo) {
        remoteVideo.onloadedmetadata = () => {
          document.getElementById('callRemotePlaceholder')?.remove();
        };
      }
    }

    // Timer
    clearInterval(this._durationInterval);
    this._durationInterval = setInterval(() => {
      this._durationSecs++;
      const t = document.getElementById('callTimer');
      if (t) t.textContent = this._formatDuration(this._durationSecs);
    }, 1000);
  },

  // ================================================================
  //  UI â€” APPEL ENTRANT
  // ================================================================

  _showIncomingUI() {
    document.getElementById('callIncomingUI')?.remove();

    const ui = document.createElement('div');
    ui.id        = 'callIncomingUI';
    ui.className = 'call-incoming';
    ui.innerHTML = `
      <div class="call-incoming-avatar">${this._esc(this._callerName).charAt(0).toUpperCase()}</div>
      <div class="call-incoming-info">
        <div class="call-incoming-name">${this._esc(this._callerName)}</div>
        <div class="call-incoming-label">${this._withVideo ? 'Incoming video call' : 'Incoming audio call'}</div>
      </div>
      <div class="call-incoming-btns">
        <button class="call-incoming-reject" onclick="CallController.rejectCall()" title="Decline">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.56 21 3 13.44 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
          </svg>
        </button>
        <button class="call-incoming-accept" onclick="CallController.acceptCall()" title="Accept">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.56 21 3 13.44 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(ui);

    // Son de sonnerie
    this._ringSound();
  },

  // ================================================================
  //  ERREUR MEDIA
  // ================================================================

  // ================================================================
  //  NOTIFICATION DANS LE CHAT
  // ================================================================

  _insertCallEvent(type, duration = null) {
    // N'insÃ¨re que si le chat actif correspond Ã  la conversation
    if (!this._convId) return;
    if (typeof MessagesController !== 'undefined' &&
        MessagesController._activeConvId !== this._convId) return;

    const el = document.getElementById('chatMessages');
    if (!el) return;

    const callType = this._withVideo ? 'video' : 'audio';
    const configs = {
      outgoing: { icon: 'ðŸ“ž', label: `${callType.charAt(0).toUpperCase() + callType.slice(1)} call started...`, cls: '' },
      missed:   { icon: 'ðŸ“µ', label: `Missed ${callType} call`,                 cls: 'chat-call-event--missed' },
      rejected: { icon: 'ðŸ“µ', label: `${callType.charAt(0).toUpperCase() + callType.slice(1)} call declined`, cls: 'chat-call-event--missed' },
      ended:    { icon: 'ðŸ“ž', label: `${callType.charAt(0).toUpperCase() + callType.slice(1)} call Â· ${duration ? this._formatDuration(duration) : ''}`, cls: '' },
    };

    const { icon, label, cls } = configs[type] || configs.ended;

    const div = document.createElement('div');
    div.className = `chat-call-event ${cls}`.trim();
    div.innerHTML = `<span>${icon}</span><span>${label}</span>`;
    el.querySelector('.chat-state-msg')?.remove();
    el.appendChild(div);
    el.scrollTop = el.scrollHeight;
  },

  _showMediaError(e) {
    const name = e?.name || '';
    let msg;

    if (!navigator.mediaDevices) {
      msg = 'Video calls require a secure connection (HTTPS or localhost).\nPlease check your configuration.';
    } else if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      msg = 'Camera/microphone access denied.\n\nTo allow: click the ðŸ”’ icon in your browser address bar â†’ Permissions â†’ Camera & Microphone.';
    } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      msg = 'No camera or microphone detected on this device.\nPlug in a device and try again.';
    } else if (name === 'NotReadableError' || name === 'TrackStartError') {
      msg = 'Your camera or microphone is already in use by another application.\nClose it and try again.';
    } else if (name === 'OverconstrainedError') {
      msg = 'Your camera does not support the required configuration.';
    } else {
      msg = `Unable to access camera/microphone.\n(${name || 'Unknown error'})`;
    }

    alert(msg);
  },

  // ================================================================
  //  CLEANUP
  // ================================================================

  _cleanup() {
    this._stopCallPoll();
    clearInterval(this._durationInterval);
    this._durationInterval = null;
    this._durationSecs     = 0;

    if (this._localStream) {
      this._localStream.getTracks().forEach(t => t.stop());
      this._localStream = null;
    }
    if (this._pc) {
      this._pc.close();
      this._pc = null;
    }

    // EmpÃªche les anciens signals d'Ãªtre re-traitÃ©s par l'Ã©coute globale
    this._listenLastId    = Math.max(this._listenLastId, this._lastSignalId, this._pendingSignalId);

    this._convId          = null;
    this._lastSignalId    = 0;
    this._pendingOffer    = null;
    this._pendingSignalId = 0;
    this._iceCandidateQueue = [];
    this._withVideo       = true;
    this._micEnabled      = true;
    this._camEnabled      = true;
    this._callInitializing = false;

    document.getElementById('callOverlay')?.remove();
    document.getElementById('callIncomingUI')?.remove();
  },

  // ================================================================
  //  HELPERS
  // ================================================================

  async _sendSignal(type, payload) {
    const res = await fetch('api/calls.php?action=signal', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ conversation_id: this._convId, type, payload })
    });
    return res.json();
  },

  async _saveCallEvent(status, duration) {
    const res = await fetch('api/calls.php?action=save_call_event', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        conversation_id: this._convId,
        call_type:       this._withVideo ? 'video' : 'audio',
        status,
        duration: duration || null
      })
    });
    const data = await res.json();
    // Met Ã  jour le lastMsgId pour Ã©viter que le poll rÃ©affiche la bulle cÃ´tÃ© expÃ©diteur
    if (data.message && typeof MessagesController !== 'undefined') {
      const msgId = parseInt(data.message.id);
      if (msgId > MessagesController._lastMsgId) {
        MessagesController._lastMsgId = msgId;
      }
    }
    return data;
  },

  _formatDuration(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  },

  _ringSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const _ring = (start) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime + start);
        osc.frequency.setValueAtTime(480, ctx.currentTime + start + 0.15);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.05);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start + 0.25);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + 0.35);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + 0.4);
      };
      _ring(0);
      _ring(0.5);
    } catch (_) {}
  },

  _esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
};

