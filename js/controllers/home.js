/**
 * Controlador para la página de inicio (home.js)
 * Este controlador maneja la lógica de la página principal, incluyendo:
 * - Verificación de autenticación
 * - Inicialización del gestor de colecciones
 * - Modificación dinámica de elementos UI según estado de autenticación
 * - Gestión de eventos y navegación
 */

document.addEventListener("DOMContentLoaded", function () {
  // Obtener tokens de autenticación del almacenamiento local
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");
  const isAuthenticated = userToken && userName;

  // Inicializar el gestor de colecciones si el usuario está autenticado
  if (isAuthenticated) {
    // Crear nueva instancia del gestor de colecciones
    const collectionsManager = new Collections();
    // Hacer disponible globalmente el gestor de colecciones
    window.collectionsManager = collectionsManager;
    // Notificar que el gestor está listo para su uso
    window.dispatchEvent(new CustomEvent("collectionsManagerReady"));
  }

  // Actualizar el botón de llamada a la acción (CTA) según estado de autenticación
  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    if (isAuthenticated) {
      // Usuario autenticado: mostrar acceso a cómics
      ctaButton.href = "comics.html";
      ctaButton.innerHTML = `
        <i class="fas fa-book-open"></i>
        <span>Explorar Comics</span>
      `;
    } else {
      // Usuario no autenticado: mostrar invitación a registro
      ctaButton.href = "register.html";
      ctaButton.innerHTML = `
        <i class="fas fa-rocket"></i>
        <span>¡Únete Ahora!</span>
      `;
    }
  }

  // Gestionar comportamiento de las tarjetas de características
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    const originalHref = card.getAttribute("href");
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir a login al hacer clic
      card.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
      });
    }
  });
});

/**
 * Función para cerrar la sesión del usuario
 * - Elimina todos los datos de autenticación del almacenamiento
 * - Recarga la página para reflejar el nuevo estado
 */
function logout() {
  // Limpiar datos de autenticación de localStorage y sessionStorage
  localStorage.removeItem("userToken");
  localStorage.removeItem("userName");
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("userName");

  // Recargar la página para actualizar la UI
  window.location.reload();
}
