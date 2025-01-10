/**
 * Controlador para la página de login (login.js)
 * Este controlador maneja la autenticación de usuarios, incluyendo:
 * - Verificación de sesión existente
 * - Gestión de usuario de prueba
 * - Manejo del formulario de login
 * - Funcionalidades de UI/UX mejoradas
 */

document.addEventListener("DOMContentLoaded", function () {
  // Verificar si existe una sesión activa
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  // Redirigir si ya hay una sesión activa
  if (userToken && userName) {
    window.location.href = "comics.html";
    return;
  }

  // Inicialización del usuario de prueba
  try {
    // Obtener datos del usuario de prueba desde la configuración
    const testUser = Config.MOCK_DATA.loginTestUser;

    // Asegurar que el usuario de prueba esté registrado en el sistema
    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];
    if (!registeredUsers.some((user) => user.usuario === testUser.usuario)) {
      registeredUsers.push(testUser);
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    }

    // Configurar toggle de visibilidad de contraseña
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.querySelector("#password");

    togglePassword.addEventListener("click", function () {
      // Alternar entre mostrar y ocultar contraseña
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      // Actualizar icono según el estado
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });

    // Mejorar UX haciendo los grupos de input completamente clickeables
    document.querySelectorAll(".input-group").forEach((group) => {
      group.addEventListener("click", function (e) {
        // Enfocar el input cuando se hace clic en cualquier parte del grupo
        if (e.target !== this.querySelector("input")) {
          this.querySelector("input").focus();
        }
      });
    });

    // Configurar botón de carga de usuario de prueba
    document
      .getElementById("testUserButton")
      .addEventListener("click", function () {
        // Rellenar formulario con datos de prueba
        document.getElementById("usuario").value = testUser.usuario;
        document.getElementById("password").value = testUser.password;
        showToast("Datos de prueba cargados", "success");
      });

    // Configurar manejo del formulario de login
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Obtener credenciales ingresadas
      const username = document.getElementById("usuario").value;
      const password = document.getElementById("password").value;
      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      // Verificar credenciales contra usuarios registrados
      const user = registeredUsers.find(
        (u) => u.usuario === username && u.password === password
      );

      if (user) {
        // Crear datos de sesión para usuario autenticado
        const userData = {
          username: user.usuario,
          token: generateToken(),
        };

        // Almacenar datos de sesión
        localStorage.setItem("userToken", userData.token);
        localStorage.setItem("userName", userData.username);

        // Redirigir a la página principal
        window.location.href = "index.html";
      } else {
        // Mostrar error si las credenciales son inválidas
        showError("Usuario o contraseña incorrectos");
      }
    });
  } catch (error) {
    // Manejar errores de inicialización
    console.error("Error cargando el usuario de prueba:", error);
    showToast("Error cargando datos de prueba", "error");
  }
});

/**
 * Genera un token aleatorio para la sesión del usuario
 * Combina un número aleatorio y timestamp para mayor unicidad
 * @returns {string} Token generado
 */
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Muestra mensajes de error en el formulario
 * Crea o actualiza un div de error sobre el formulario
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
  const errorDiv = document.querySelector(".error-message");
  if (!errorDiv) {
    // Crear nuevo div de error si no existe
    const newErrorDiv = document.createElement("div");
    newErrorDiv.className = "error-message";
    const form = document.querySelector("form");
    form.insertBefore(newErrorDiv, form.firstChild);
    newErrorDiv.textContent = message;
  } else {
    // Actualizar mensaje de error existente
    errorDiv.textContent = message;
  }
}

/**
 * Muestra notificaciones toast personalizadas
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación ('success', 'error', 'info')
 */
function showToast(message, type = "info") {
  // Determinar color de fondo según tipo de notificación
  const backgroundColor =
    type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8";

  // Configurar y mostrar toast
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: backgroundColor,
    },
    stopOnFocus: true,
  }).showToast();
}
