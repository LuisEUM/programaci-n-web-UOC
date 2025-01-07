document.addEventListener("DOMContentLoaded", async function () {
  // Cargar el usuario de prueba desde el JSON
  try {
    const response = await fetch("js/data/test-user.json");
    const testUser = await response.json();

    // Asegurar que el usuario de prueba esté disponible en localStorage
    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    if (!registeredUsers.some((user) => user.usuario === testUser.usuario)) {
      registeredUsers.push(testUser);
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    }

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

    // Hacer que todo el input-group sea clickeable
    document.querySelectorAll(".input-group").forEach((group) => {
      group.addEventListener("click", function (e) {
        if (e.target !== this.querySelector("input")) {
          this.querySelector("input").focus();
        }
      });
    });

    // Botón de usuario de prueba
    document
      .getElementById("testUserButton")
      .addEventListener("click", function () {
        document.getElementById("usuario").value = testUser.usuario;
        document.getElementById("password").value = testUser.password;
        showToast("Datos de prueba cargados", "success");
      });

    // Handle login form submission
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("usuario").value;
      const password = document.getElementById("password").value;
      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      const user = registeredUsers.find(
        (u) => u.usuario === username && u.password === password
      );

      if (user) {
        const userData = {
          username: user.usuario,
          token: generateToken(),
        };

        localStorage.setItem("userToken", userData.token);
        localStorage.setItem("userName", userData.username);

        window.location.href = "home.html";
      } else {
        showError("Usuario o contraseña incorrectos");
      }
    });
  } catch (error) {
    console.error("Error cargando el usuario de prueba:", error);
    showToast("Error cargando datos de prueba", "error");
  }
});

// Función para generar un token aleatorio
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Función para mostrar mensajes de error
function showError(message) {
  const errorDiv = document.querySelector(".error-message");
  if (!errorDiv) {
    const newErrorDiv = document.createElement("div");
    newErrorDiv.className = "error-message";
    const form = document.querySelector("form");
    form.insertBefore(newErrorDiv, form.firstChild);
    newErrorDiv.textContent = message;
  } else {
    errorDiv.textContent = message;
  }
}

// Función para mostrar toasts
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
