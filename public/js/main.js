/* ===================================================
   PUBLIC/JS/MAIN.JS — App Bootstrap
   =================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  LangManager.init();
  Router.init();
  await AppController.init();
  CookieBanner.init();
});
