/* ===================================================
   APP/VIEWS/PAGES/LEGALPAGE.JS
   Privacy Policy · Terms of Use · DMCA · Legal Notices
   =================================================== */

const LegalPage = {

  _currentPage: null,

  render(page) {
    this._currentPage = page;

    return `
      ${Header.render()}
      ${MobileNav.render()}
      <div class="legal-wrap">
        <div class="legal-container">
          <nav class="legal-nav">
            ${this._renderNav(page)}
          </nav>
          <article class="legal-article" id="legalArticle">
            ${this._renderContent(page)}
          </article>
        </div>
      </div>
    `;
  },

  _renderNav(page) {
    const links = [
      { key: 'privacy',  icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        label: 'Privacy Policy' },
      { key: 'cgu',      icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>',
        label: 'Terms of Use' },
      { key: 'dmca',     icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
        label: 'DMCA' },
      { key: 'mentions', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
        label: 'Legal Notices' },
    ];
    return links.map(l => `
      <a href="#${l.key}" class="legal-nav-link ${page === l.key ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
             stroke-linecap="round" stroke-linejoin="round">${l.icon}</svg>
        ${l.label}
      </a>
    `).join('');
  },

  _renderContent(page) {
    if (page === 'privacy') return this._privacy();
    if (page === 'cgu')     return this._cgu();
    if (page === 'dmca')    return this._dmca();
    return this._mentions();
  },

  // ================================================================
  //  PRIVACY POLICY
  // ================================================================
  _privacy() { return `
    <div class="legal-hero">
      <div class="legal-hero-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
      <h1 class="legal-title">Privacy Policy</h1>
      <p class="legal-subtitle">Last updated: March 23, 2026 · Applicable in France, the EU, and the United States</p>
    </div>
    <div class="legal-alert"><strong>Your privacy matters.</strong> Influmatch only collects data strictly necessary to operate the platform. We never sell your data to third parties.</div>

    <h2>1. Data Controller</h2>
    <p>Influmatch — sole proprietorship co-founded by Lucas Coutard and James Flogny.<br>
    Email: <a href="mailto:info@contactinflumatch.com">info@contactinflumatch.com</a> ·
    LinkedIn: <a href="https://www.linkedin.com/in/lucas-coutard-0b7210332/" target="_blank" rel="noopener">Lucas Coutard</a> ·
    <a href="https://www.linkedin.com/in/james-flogny-674555328/" target="_blank" rel="noopener">James Flogny</a></p>

    <h2>2. Data We Collect</h2>
    <div class="legal-table-wrap"><table class="legal-table">
      <thead><tr><th>Category</th><th>Data</th><th>Purpose</th><th>Legal Basis</th></tr></thead>
      <tbody>
        <tr><td><strong>Account</strong></td><td>First name, last name, email, hashed password, role</td><td>Account creation & management</td><td>Contract performance (Art. 6.1.b GDPR)</td></tr>
        <tr><td><strong>Profile</strong></td><td>Profile photo, phone, company</td><td>Profile customization</td><td>Consent (Art. 6.1.a GDPR)</td></tr>
        <tr><td><strong>Social media</strong></td><td>Instagram, TikTok, YouTube links</td><td>Brand/creator matching</td><td>Contract performance (Art. 6.1.b GDPR)</td></tr>
        <tr><td><strong>Collaborations</strong></td><td>Campaign titles, budgets, statuses, tasks</td><td>Project management</td><td>Contract performance (Art. 6.1.b GDPR)</td></tr>
        <tr><td><strong>Messages</strong></td><td>Message content</td><td>User communication</td><td>Contract performance (Art. 6.1.b GDPR)</td></tr>
        <tr><td><strong>Login</strong></td><td>Last login date, PHP session</td><td>Security</td><td>Legitimate interest (Art. 6.1.f GDPR)</td></tr>
      </tbody>
    </table></div>

    <h2>3. Data Retention</h2>
    <ul>
      <li><strong>Account data:</strong> retained while account is active, deleted within 30 days of account closure.</li>
      <li><strong>Collaborations & messages:</strong> retained for 3 years after the end of the collaboration.</li>
      <li><strong>Profile photos:</strong> deleted immediately upon request or account closure.</li>
      <li><strong>Login logs:</strong> 12 months for security purposes.</li>
    </ul>

    <h2>4. Your Rights by Country</h2>

    <div class="legal-zone legal-zone--eu">
      <div class="legal-zone-header"><span class="legal-zone-flag">🇫🇷 🇪🇺</span><span class="legal-zone-label">France &amp; European Union</span><span class="legal-zone-badge">GDPR</span></div>
      <p>Under Regulation (EU) 2016/679, EU residents have the following rights:</p>
      <div class="legal-rights-grid" style="margin:12px 0">
        <div class="legal-right" style="background:#fff"><div class="legal-right-icon">👁</div><div class="legal-right-title">Access</div><div class="legal-right-desc">Get a copy of your data (Art. 15)</div></div>
        <div class="legal-right" style="background:#fff"><div class="legal-right-icon">✏️</div><div class="legal-right-title">Rectification</div><div class="legal-right-desc">Correct inaccurate data (Art. 16)</div></div>
        <div class="legal-right" style="background:#fff"><div class="legal-right-icon">🗑</div><div class="legal-right-title">Erasure</div><div class="legal-right-desc">Delete your data (Art. 17)</div></div>
        <div class="legal-right" style="background:#fff"><div class="legal-right-icon">📦</div><div class="legal-right-title">Portability</div><div class="legal-right-desc">Structured format (Art. 20)</div></div>
        <div class="legal-right" style="background:#fff"><div class="legal-right-icon">⏸</div><div class="legal-right-title">Restriction</div><div class="legal-right-desc">Limit processing (Art. 18)</div></div>
        <div class="legal-right" style="background:#fff"><div class="legal-right-icon">🚫</div><div class="legal-right-title">Objection</div><div class="legal-right-desc">Object to processing (Art. 21)</div></div>
      </div>
      <p>Contact: <a href="mailto:info@contactinflumatch.com">info@contactinflumatch.com</a> — response within <strong>30 days</strong>.<br>
      Complaints: <a href="https://www.cnil.fr" target="_blank" rel="noopener">CNIL (France)</a> ·
      EU ODR: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">Online Dispute Resolution</a></p>
    </div>

    <div class="legal-zone legal-zone--us">
      <div class="legal-zone-header"><span class="legal-zone-flag">🇺🇸</span><span class="legal-zone-label">United States</span><span class="legal-zone-badge">CCPA / CPRA</span></div>
      <p><strong>California residents</strong> have the following rights under the CCPA / CPRA:</p>
      <ul>
        <li><strong>Right to Know —</strong> Request details on what personal information we collect and how we use it.</li>
        <li><strong>Right to Delete —</strong> Available directly from your account settings.</li>
        <li><strong>Right to Correct —</strong> Available directly from your profile.</li>
        <li><strong>Right to Opt-Out of Sale —</strong> Influmatch <strong>does NOT sell</strong> your personal information. No opt-out needed.</li>
        <li><strong>Right to Non-Discrimination —</strong> We will never penalize you for exercising your privacy rights.</li>
        <li><strong>Right to Limit Sensitive Data Use —</strong> We only use sensitive data to provide our services.</li>
      </ul>
      <p><strong>Other US states</strong> (Virginia VCDPA, Colorado CPA, Connecticut CTDPA, Texas TDPSA…) — similar rights apply. Contact us to submit any privacy request.<br>
      📧 <a href="mailto:info@contactinflumatch.com">info@contactinflumatch.com</a> — Response within <strong>45 days</strong> as required by California law.</p>
    </div>

    <h2>5. Security</h2>
    <ul>
      <li>Passwords are <strong>hashed with bcrypt</strong> — never stored in plain text.</li>
      <li>Sessions are managed server-side (PHP).</li>
      <li>All database queries use <strong>prepared statements</strong> (SQL injection protection).</li>
    </ul>

    <h2>6. Third-Party Services</h2>
    <div class="legal-table-wrap"><table class="legal-table">
      <thead><tr><th>Service</th><th>Purpose</th><th>Data Shared</th><th>Policy</th></tr></thead>
      <tbody>
        <tr><td><strong>Cal.com</strong></td><td>Booking</td><td>Name, email, timezone</td><td><a href="https://cal.com/privacy" target="_blank" rel="noopener">cal.com/privacy</a></td></tr>
        <tr><td><strong>Hostinger</strong></td><td>Hosting</td><td>Server data only</td><td><a href="https://www.hostinger.com/privacy-policy" target="_blank" rel="noopener">hostinger.com</a></td></tr>
      </tbody>
    </table></div>

    <h2>7. Cookies</h2>
    <p>Influmatch does not use tracking or analytics cookies. Only strictly necessary session cookies are set. Cal.com may set third-party cookies on the Contact page — manageable via the cookie banner.</p>

    <h2>8. Contact</h2>
    <p>📧 <a href="mailto:info@contactinflumatch.com">info@contactinflumatch.com</a><br>
    CNIL (France): <a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a> ·
    FTC (USA): <a href="https://www.ftc.gov" target="_blank" rel="noopener">ftc.gov</a></p>
  `; },

  // ================================================================
  //  TERMS OF USE
  // ================================================================
  _cgu() { return `
    <div class="legal-hero">
      <div class="legal-hero-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
      <h1 class="legal-title">Terms of Use</h1>
      <p class="legal-subtitle">Last updated: March 23, 2026 · Applicable in France, the EU, and the United States</p>
    </div>
    <div class="legal-alert">By creating an account or using Influmatch, you agree to these Terms of Use in their entirety.</div>

    <h2>1. About Influmatch</h2>
    <p>Influmatch is a platform connecting <strong>brands</strong> with <strong>content creators</strong>. It facilitates the creation, management, and tracking of marketing collaborations, accessible at <strong>influmatch.fr</strong>.</p>

    <h2>2. Eligibility</h2>
    <ul>
      <li>You must be at least <strong>18 years old</strong> to create an account.</li>
      <li>You must provide accurate and up-to-date information when registering.</li>
      <li>Only one account per person or entity is permitted.</li>
      <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
    </ul>

    <h2>3. User Roles</h2>
    <div class="legal-table-wrap"><table class="legal-table">
      <thead><tr><th>Role</th><th>Access</th><th>Responsibilities</th></tr></thead>
      <tbody>
        <tr><td><strong>Brand</strong></td><td>Create collaborations, validate deliverables, messaging</td><td>Accuracy of briefs, financial commitments</td></tr>
        <tr><td><strong>Creator / Influencer</strong></td><td>Task tracking, messaging, status updates</td><td>Meeting deadlines, content quality, legal compliance of posts</td></tr>
        <tr><td><strong>Admin</strong></td><td>Full platform access</td><td>User and collaboration management</td></tr>
      </tbody>
    </table></div>

    <h2>4. Collaborations & Sponsored Content</h2>
    <p><strong>4.1</strong> Influmatch acts as a <strong>technical intermediary only</strong>. We do not guarantee campaign results and are not a party to contracts between brands and creators.</p>
    <p><strong>4.2 Mandatory Disclosure.</strong></p>
    <div class="legal-zone legal-zone--us">
      <div class="legal-zone-header"><span class="legal-zone-flag">🇺🇸</span><span class="legal-zone-label">United States</span><span class="legal-zone-badge">FTC Guidelines</span></div>
      <p>All sponsored content must include a <strong>clear and conspicuous disclosure</strong> such as <strong>"#ad"</strong>, <strong>"#sponsored"</strong>, or <strong>"Paid partnership"</strong> at the beginning of the post, clearly visible before any "read more" prompt. This is required under <strong>FTC Endorsement Guides (16 CFR Part 255)</strong>. Failure to disclose may result in FTC enforcement action.</p>
    </div>
    <div class="legal-zone legal-zone--eu">
      <div class="legal-zone-header"><span class="legal-zone-flag">🇫🇷 🇪🇺</span><span class="legal-zone-label">France / EU</span><span class="legal-zone-badge">ARPP</span></div>
      <p>In France, all sponsored content must include "#sponsorisé", "#partenariat", or "Collaboration commerciale", per the ARPP guidelines and the French Influencer Law (June 9, 2023).</p>
    </div>

    <h2>5. Intellectual Property</h2>
    <p>You retain ownership of your content. By posting on Influmatch, you grant us a non-exclusive, royalty-free license to display it as part of the service. Influmatch's interface, code, and branding are protected by intellectual property law.</p>

    <h2>6. Prohibited Conduct</h2>
    <ul>
      <li>Posting illegal, defamatory, discriminatory, or violent content</li>
      <li>Impersonating any person or entity · Unauthorized account access</li>
      <li>Uploading viruses or malicious code</li>
      <li>Using bots, scrapers, or automated tools without written consent</li>
      <li>Promoting illegal, counterfeit, or dangerous products</li>
      <li>Fraud, money laundering, or criminal activity of any kind</li>
    </ul>

    <h2>7. Limitation of Liability</h2>
    <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, INFLUMATCH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES. INFLUMATCH'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO INFLUMATCH IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>

    <h2>8. Termination</h2>
    <p>You may close your account at any time via Settings → Security → Delete my account. Influmatch may suspend or terminate any account for violation of these Terms without notice.</p>

    <h2>9. Governing Law & Dispute Resolution</h2>
    <div class="legal-zone legal-zone--us">
      <div class="legal-zone-header"><span class="legal-zone-flag">🇺🇸</span><span class="legal-zone-label">United States</span><span class="legal-zone-badge">Arbitration</span></div>
      <p>For users located in the United States, any dispute arising from these Terms shall be resolved through <strong>binding individual arbitration</strong> administered by the American Arbitration Association (AAA).<br><br>
      <strong>CLASS ACTION WAIVER:</strong> You agree to resolve disputes on an individual basis only. You waive any right to bring or participate in any class action, collective, or representative proceeding.<br><br>
      Before initiating arbitration, both parties must attempt informal resolution by contacting <a href="mailto:info@contactinflumatch.com">info@contactinflumatch.com</a> for a period of <strong>30 days</strong>.</p>
    </div>
    <div class="legal-zone legal-zone--eu">
      <div class="legal-zone-header"><span class="legal-zone-flag">🇫🇷 🇪🇺</span><span class="legal-zone-label">France &amp; EU</span><span class="legal-zone-badge">French Law</span></div>
      <p>For EU users, these Terms are governed by <strong>French law</strong>. French courts shall have exclusive jurisdiction. EU consumer mediation is available via the <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">European ODR Platform</a>.</p>
    </div>

    <h2>10. Contact</h2>
    <p>📧 <a href="mailto:info@contactinflumatch.com">info@contactinflumatch.com</a></p>
  `; },

  // ================================================================
  //  DMCA POLICY
  // ================================================================
  _dmca() { return `
    <div class="legal-hero">
      <div class="legal-hero-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <h1 class="legal-title">DMCA Policy</h1>
      <p class="legal-subtitle">Digital Millennium Copyright Act — 17 U.S.C. § 512</p>
    </div>
    <div class="legal-alert"><strong>Influmatch respects intellectual property rights.</strong> We comply with the Digital Millennium Copyright Act (DMCA) and respond promptly to valid copyright infringement notices.</div>

    <h2>1. Safe Harbor</h2>
    <p>Influmatch qualifies for the DMCA safe harbor protection under <strong>17 U.S.C. § 512(c)</strong> as a service provider that stores user-generated content. This protection is contingent on our compliance with the notice-and-takedown procedures described below.</p>

    <h2>2. Designated Agent</h2>
    <div class="legal-info-block">
      <p><strong>DMCA Designated Agent:</strong> Influmatch — Lucas Coutard &amp; James Flogny</p>
      <p><strong>Email:</strong> <a href="mailto:info@contactinflumatch.com">info@contactinflumatch.com</a></p>
      <p><strong>Subject line:</strong> "DMCA Takedown Notice"</p>
      <p><em>Note: This contact is solely for DMCA notices. Other inquiries sent to this address will not be acted upon.</em></p>
    </div>

    <h2>3. Filing a DMCA Takedown Notice</h2>
    <p>If you believe content on Influmatch infringes your copyright, send a written notice containing <strong>all</strong> of the following:</p>
    <ul>
      <li>Your <strong>full legal name</strong>, address, phone number, and email address.</li>
      <li>Identification of the <strong>copyrighted work</strong> you claim has been infringed (or a representative list if multiple).</li>
      <li>The <strong>URL or specific location</strong> on Influmatch of the allegedly infringing content.</li>
      <li>A statement that you have a <strong>good faith belief</strong> that the use is not authorized by the copyright owner, its agent, or the law.</li>
      <li>A statement that the information in the notice is <strong>accurate</strong>, and under penalty of perjury, that you are the copyright owner or authorized to act on the owner's behalf.</li>
      <li>Your <strong>physical or electronic signature</strong>.</li>
    </ul>
    <div class="legal-alert" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;margin-top:12px">
      <strong>⚠ Warning:</strong> Submitting a false DMCA notice may expose you to liability for damages, including costs and attorneys' fees (17 U.S.C. § 512(f)).
    </div>

    <h2>4. Our Response</h2>
    <p>Upon receiving a valid DMCA notice, we will:</p>
    <ul>
      <li>Remove or disable access to the allegedly infringing content <strong>within 72 hours</strong>.</li>
      <li>Notify the user who posted the content.</li>
      <li>Terminate accounts of <strong>repeat infringers</strong> in appropriate circumstances.</li>
    </ul>

    <h2>5. Counter-Notice Procedure</h2>
    <p>If you believe your content was removed by mistake or misidentification, you may file a <strong>counter-notice</strong> containing:</p>
    <ul>
      <li>Your full legal name, address, phone number, and email.</li>
      <li>Identification of the removed content and its prior location.</li>
      <li>A statement under penalty of perjury that you have a good faith belief the content was removed by mistake or misidentification.</li>
      <li>A statement consenting to the jurisdiction of the federal district court for your district (or, if outside the US, any judicial district where Influmatch may be found).</li>
      <li>Your physical or electronic signature.</li>
    </ul>
    <p>If we receive a valid counter-notice, we may restore the content after <strong>10–14 business days</strong> unless the original complainant files a court action.</p>

    <h2>6. Repeat Infringer Policy</h2>
    <p>In accordance with <strong>17 U.S.C. § 512(i)</strong>, Influmatch will terminate the accounts of users who are determined to be <strong>repeat copyright infringers</strong>.</p>

    <h2>7. For France & EU Users</h2>
    <div class="legal-zone legal-zone--eu">
      <div class="legal-zone-header"><span class="legal-zone-flag">🇫🇷 🇪🇺</span><span class="legal-zone-label">France &amp; EU</span><span class="legal-zone-badge">Droit d'auteur</span></div>
      <p>Pour les utilisateurs en France et dans l'UE, les droits d'auteur sont régis par le <strong>Code de la propriété intellectuelle</strong> et la <strong>Directive (UE) 2019/790</strong>. Signalez toute violation à <a href="mailto:info@contactinflumatch.com">info@contactinflumatch.com</a> avec l'objet "Signalement droits d'auteur". Nous traiterons votre demande dans les <strong>72 heures</strong>.</p>
    </div>
  `; },

  // ================================================================
  //  LEGAL NOTICES
  // ================================================================
  _mentions() { return `
    <div class="legal-hero">
      <div class="legal-hero-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <h1 class="legal-title">Legal Notices</h1>
      <p class="legal-subtitle">Pursuant to French Law No. 2004-575 of June 21, 2004 (LCEN)</p>
    </div>

    <h2>1. Publisher</h2>
    <div class="legal-info-block">
      <p><strong>Trade name:</strong> Influmatch</p>
      <p><strong>Legal form:</strong> Sole proprietorship (Entreprise individuelle)</p>
      <p><strong>Co-founders:</strong> Lucas Coutard &amp; James Flogny</p>
      <p><strong>Registered address:</strong> 14 Rue François Couperin, 77450 Esbly, France</p>
      <p><strong>SIRET:</strong> 989 360 490 00019</p>
      <p><strong>Business code (NAF):</strong> 7022Z — Business and management consultancy</p>
      <p><strong>Registration date:</strong> July 17, 2025</p>
      <p><strong>Email:</strong> <a href="mailto:info@contactinflumatch.com">info@contactinflumatch.com</a></p>
      <p><strong>LinkedIn:</strong>
        <a href="https://www.linkedin.com/in/lucas-coutard-0b7210332/" target="_blank" rel="noopener">Lucas Coutard</a> ·
        <a href="https://www.linkedin.com/in/james-flogny-674555328/" target="_blank" rel="noopener">James Flogny</a>
      </p>
    </div>

    <h2>2. Hosting</h2>
    <div class="legal-info-block">
      <p><strong>Host:</strong> Hostinger International Ltd.</p>
      <p><strong>Address:</strong> 61 Lordou Vironos Street, 6023 Larnaca, Cyprus</p>
      <p><strong>Website:</strong> <a href="https://www.hostinger.com" target="_blank" rel="noopener">www.hostinger.com</a></p>
    </div>

    <h2>3. Intellectual Property</h2>
    <p>All content (text, images, logo, interface, source code) is the exclusive property of Influmatch and is protected by French and international intellectual property law. Any reproduction without prior written consent is strictly prohibited.</p>

    <h2>4. Personal Data</h2>
    <p>See our <a href="#privacy">Privacy Policy</a>.</p>

    <h2>5. Governing Law</h2>
    <p>These legal notices are governed by French law. French courts have exclusive jurisdiction in case of dispute.</p>

    <h2>6. Contact</h2>
    <p>📧 <a href="mailto:info@contactinflumatch.com">info@contactinflumatch.com</a></p>
  `; },
};
