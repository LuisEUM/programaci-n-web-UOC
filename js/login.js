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

    const userData = {
      usuario: document.getElementById("usuario").value,
      password: document.getElementById("password").value,
      remember: document.getElementById("remember").checked,
    };

    // Obtener usuarios registrados
    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const testUser = {
      usuario: "test",
      password: "Test123",
    };

    // Verificar si es el usuario de prueba o un usuario registrado
    const isTestUser =
      userData.usuario === testUser.usuario &&
      userData.password === testUser.password;
    const registeredUser = registeredUsers.find(
      (user) =>
        user.usuario === userData.usuario && user.password === userData.password
    );

    if (isTestUser || registeredUser) {
      // Login exitoso
      const storage = userData.remember ? localStorage : sessionStorage;
      storage.setItem("userToken", "token-" + Date.now());
      storage.setItem("userName", userData.usuario);

      showToast("¡Inicio de sesión exitoso!", "success");
      setTimeout(() => {
        window.location.href = "/comics";
      }, 1500);
    } else {
      showToast("Usuario o contraseña incorrectos", "error");
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
