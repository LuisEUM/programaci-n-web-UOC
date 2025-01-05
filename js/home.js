document.addEventListener("DOMContentLoaded", function () {
  // Verificar si el usuario está autenticado
  const userToken =
    localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
  const userName =
    localStorage.getItem("userName") || sessionStorage.getItem("userName");

  if (userToken && userName) {
    // Usuario autenticado - Modificar la barra de navegación
    const authButtons = document.querySelector(".auth-buttons");
    authButtons.innerHTML = `
            <span class="welcome-text">Bienvenido, ${userName}</span>
            <button class="logout-button" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </button>
        `;

    // Modificar el CTA del banner si el usuario está autenticado
    const ctaButton = document.querySelector(".cta-button");
    ctaButton.href = "/comics";
    ctaButton.textContent = "Explorar Comics";

    // Agregar estilos para los nuevos elementos
    const style = document.createElement("style");
    style.textContent = `
            .welcome-text {
                color: var(--secondary-color);
                margin-right: 1rem;
            }
            .logout {
                background-color: var(--error-color) !important;
                color: var(--white) !important;
            }
            .logout:hover {
                opacity: 0.9;
            }
        `;
    document.head.appendChild(style);
  }
});

// Función para cerrar sesión
function logout() {
  // Eliminar datos de autenticación
  localStorage.removeItem("userToken");
  localStorage.removeItem("userName");
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("userName");

  // Recargar la página
  window.location.reload();
}
