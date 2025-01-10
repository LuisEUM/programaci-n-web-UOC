document.addEventListener("DOMContentLoaded", function () {
  // Verificar si el usuario está autenticado
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");
  const isAuthenticated = userToken && userName;

  // Inicializar collectionsManager solo si el usuario está autenticado
  if (isAuthenticated) {
    const collectionsManager = new Collections();
    window.collectionsManager = collectionsManager;
    window.dispatchEvent(new CustomEvent("collectionsManagerReady"));
  }

  // Modificar el CTA del banner según el estado de autenticación
  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    if (isAuthenticated) {
      ctaButton.href = "comics.html";
      ctaButton.innerHTML = `
        <i class="fas fa-book-open"></i>
        <span>Explorar Comics</span>
      `;
    } else {
      ctaButton.href = "register.html";
      ctaButton.innerHTML = `
        <i class="fas fa-rocket"></i>
        <span>¡Únete Ahora!</span>
      `;
    }
  }

  // Modificar los enlaces de las feature cards según autenticación
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    const originalHref = card.getAttribute('href');
    if (!isAuthenticated) {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'login.html';
      });
    }
  });
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
