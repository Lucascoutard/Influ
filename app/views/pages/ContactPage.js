/* ===================================================
   APP/VIEWS/PAGES/CONTACTPAGE.JS — Page Contact
   Même DA : dark panel gauche + form blanc droite
   =================================================== */

const ContactPage = {

  render() {
    const user = UserModel.getUser();

    return `
      ${Header.render()}
      ${MobileNav.render()}

      <section class="contact-section">
        <div class="contact-card">

          <!-- Panneau info gauche -->
          <div class="contact-info">
            <div class="contact-info-content">
              <h1 class="contact-title">Parlons de votre <em>projet</em></h1>
              <p class="contact-subtitle">
                Une question, une idée de collaboration, ou simplement envie d'en savoir plus ?
                On vous répond sous 24h.
              </p>

              <div class="contact-details">
                <div class="contact-detail">
                  <div class="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <span class="contact-detail-label">Email</span>
                    <a href="mailto:hello@influmatch.com" class="contact-detail-value">hello@influmatch.com</a>
                  </div>
                </div>
                <div class="contact-detail">
                  <div class="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <span class="contact-detail-label">Localisation</span>
                    <span class="contact-detail-value">Paris, France</span>
                  </div>
                </div>
                <div class="contact-detail">
                  <div class="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <span class="contact-detail-label">Réponse</span>
                    <span class="contact-detail-value">Sous 24 heures</span>
                  </div>
                </div>
              </div>

              <div class="contact-deco"></div>
            </div>
          </div>

          <!-- Formulaire droite -->
          <div class="contact-form-side">
            <h2 class="contact-form-title">Envoyez-nous un message</h2>

            <div class="auth-message" id="contactMessage"></div>

            <form class="auth-form" id="contactForm" onsubmit="ContactPage.handleSubmit(event)">
              <div class="form-row">
                <div class="form-group">
                  <label for="contactName">Nom complet</label>
                  <input type="text" id="contactName" required placeholder="Jean Dupont"
                         value="${user ? (user.firstname + ' ' + user.lastname) : ''}">
                </div>
                <div class="form-group">
                  <label for="contactEmail">Email</label>
                  <input type="email" id="contactEmail" required placeholder="votre@email.com"
                         value="${user ? user.email : ''}">
                </div>
              </div>
              <div class="form-group">
                <label for="contactPhone">Téléphone <span class="optional">(optionnel)</span></label>
                <input type="tel" id="contactPhone" placeholder="+33 6 12 34 56 78"
                       value="${user && user.phone ? user.phone : ''}">
              </div>
              <div class="form-group">
                <label for="contactSubject">Sujet</label>
                <select id="contactSubject" required>
                  <option value="" disabled selected>Choisir un sujet</option>
                  <option value="collaboration">Proposition de collaboration</option>
                  <option value="marque">Je suis une marque</option>
                  <option value="createur">Je suis un créateur</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="support">Support technique</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div class="form-group">
                <label for="contactMsg">Message</label>
                <textarea id="contactMsg" required rows="5" placeholder="Décrivez votre projet ou question..." minlength="10"></textarea>
              </div>
              <button type="submit" class="btn-auth" id="contactBtn">
                <span class="btn-auth-text">Envoyer le message</span>
                <span class="btn-auth-loader"></span>
              </button>
            </form>
          </div>

        </div>
      </section>
    `;
  },

  async handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('contactBtn');
    const msgEl = document.getElementById('contactMessage');
    btn.disabled = true;
    btn.classList.add('loading');
    if (msgEl) { msgEl.textContent = ''; msgEl.className = 'auth-message'; }

    const formData = {
      name:    document.getElementById('contactName').value,
      email:   document.getElementById('contactEmail').value,
      phone:   document.getElementById('contactPhone').value,
      subject: document.getElementById('contactSubject').value,
      message: document.getElementById('contactMsg').value,
    };

    try {
      const res = await fetch('api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      btn.disabled = false;
      btn.classList.remove('loading');

      if (data.success) {
        if (msgEl) { msgEl.textContent = data.message; msgEl.className = 'auth-message success'; }
        document.getElementById('contactForm').reset();
      } else {
        if (msgEl) { msgEl.textContent = data.message; msgEl.className = 'auth-message error'; }
      }
    } catch (err) {
      btn.disabled = false;
      btn.classList.remove('loading');
      if (msgEl) { msgEl.textContent = 'Erreur réseau. Vérifie que ton serveur PHP est lancé.'; msgEl.className = 'auth-message error'; }
    }
  }
};
