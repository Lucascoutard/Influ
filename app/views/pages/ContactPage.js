/* ===================================================
   APP/VIEWS/PAGES/CONTACTPAGE.JS — Page Contact
   Cal.com booking style
   =================================================== */

const ContactPage = {

  render() {
    return `
      ${Header.render()}
      ${MobileNav.render()}

      <section class="contact-section">

        <div class="contact-header">
          <h1 class="contact-heading">A project? A question?</h1>
          <p class="contact-subheading">Book a slot</p>
        </div>

        <div class="contact-booking-wrapper">
          <div id="cal-inline-embed"></div>
        </div>

      </section>
    `;
  },

  afterRender() {
    ContactPage.initCal();
  },

  initCal() {
    // Supprime un éventuel script précédent pour éviter les doublons
    const existing = document.getElementById('cal-embed-script');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'cal-embed-script';
    script.type = 'text/javascript';
    script.innerHTML = `
      (function (C, A, L) {
        let p = function (a, ar) { a.q.push(ar); };
        let d = C.document;
        C.Cal = C.Cal || function () {
          let cal = C.Cal; let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {}; cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () { p(api, arguments); };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["-init-config", { namespace }]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
      })(window, "https://app.cal.com/embed/embed.js", "init");

      Cal("init", { origin: "https://app.cal.com" });

      Cal("inline", {
        elementOrSelector: "#cal-inline-embed",
        calLink: "influmatch/15min",
        layout: "month_view"
      });

      Cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#5e4ad0" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    `;
    document.body.appendChild(script);
  }
};
