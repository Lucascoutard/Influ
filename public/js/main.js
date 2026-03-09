/* ===================================================
   PUBLIC/JS/MAIN.JS — App Bootstrap
   =================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  Router.init();
  await AppController.init();
});
