document.addEventListener("DOMContentLoaded", async () => {
  // Verificar autenticación
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  if (!userToken || !userName) {
    window.location.href = "login.html";
    return;
  }
});
