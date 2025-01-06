document.addEventListener("DOMContentLoaded", function () {
  // Toggle password visibility
  const togglePassword = document.querySelector(".toggle-password");
  const passwordInput = document.querySelector("#password");

  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });

  // Botón de usuario de prueba
  document
    .getElementById("testUserButton")
    .addEventListener("click", function () {
      document.getElementById("usuario").value = "test";
      document.getElementById("password").value = "Test123";
      showToast("Datos de prueba cargados", "success");
    });

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const registeredUsers =
      JSON.parse(sessionStorage.getItem("registeredUsers")) || [];

    const user = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const userData = {
        username: user.username,
        token: generateToken(),
      };

      sessionStorage.setItem("userToken", userData.token);
      sessionStorage.setItem("userName", userData.username);

      window.location.href = "index.html";
    } else {
      showError("Usuario o contraseña incorrectos");
    }
  });
});

function showToast(message, type = "info") {
  const backgroundColor =
    type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8";

  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor,
    stopOnFocus: true,
  }).showToast();
}
