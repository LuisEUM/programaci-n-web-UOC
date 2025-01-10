/**
 * Controlador para la página de héroes (heroes.js)
 * Este controlador maneja la visualización y gestión de héroes de Marvel, incluyendo:
 * - Paginación y navegación
 * - Filtrado y búsqueda
 * - Integración con modo mock/API
 * - Gestión de eventos personalizados
 * - Notificaciones al usuario
 */

// Variables globales para componentes principales
let collectionsManager; // Gestor de colecciones
let heroesGrid; // Grid de visualización de héroes
let heroesSearch; // Componente de búsqueda
let heroesActionsBar; // Barra de acciones

/**
 * Configura la paginación y navegación del grid de héroes
 * Maneja eventos de botones e input de página
 */
function setupPagination() {
  // Configurar navegación a primera página
  document.getElementById("firstPage").addEventListener("click", () => {
    if (heroesGrid.currentPage > 1) {
      heroesGrid.setPage(1);
    }
  });

  // Configurar navegación a página anterior
  document.getElementById("prevPage").addEventListener("click", () => {
    if (heroesGrid.currentPage > 1) {
      heroesGrid.setPage(heroesGrid.currentPage - 1);
    }
  });

  // Configurar navegación a página siguiente
  document.getElementById("nextPage").addEventListener("click", () => {
    if (heroesGrid.currentPage < heroesGrid.totalPages) {
      heroesGrid.setPage(heroesGrid.currentPage + 1);
    }
  });

  // Configurar navegación a última página
  document.getElementById("lastPage").addEventListener("click", () => {
    if (heroesGrid.currentPage < heroesGrid.totalPages) {
      heroesGrid.setPage(heroesGrid.totalPages);
    }
  });

  // Configurar input manual de página
  const pageInput = document.getElementById("pageInput");
  if (pageInput) {
    pageInput.addEventListener("change", (e) => {
      const page = parseInt(e.target.value);
      if (page && page > 0 && page <= heroesGrid.totalPages) {
        heroesGrid.setPage(page);
      } else {
        e.target.value = heroesGrid.currentPage;
        window.showToast("Número de página inválido", "error");
      }
    });
  }

  // Configurar items por página
  document.getElementById("itemsPerPage").addEventListener("change", (e) => {
    heroesGrid.itemsPerPage = parseInt(e.target.value);
    heroesGrid.setPage(1);
  });
}

// Inicialización del controlador
document.addEventListener("DOMContentLoaded", async () => {
  // Verificar autenticación del usuario
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  // Redirigir si no hay sesión activa
  if (!userToken || !userName) {
    window.location.href = "login.html";
    return;
  }

  // Inicializar preferencia de fuente de datos
  if (!localStorage.getItem("dataSourcePreference")) {
    localStorage.setItem("dataSourcePreference", "mock");
    Config.USE_MOCK_DATA = true;
  }

  // Inicializar y exponer el gestor de colecciones
  collectionsManager = new Collections();
  window.collectionsManager = collectionsManager;
  window.dispatchEvent(new CustomEvent("collectionsManagerReady"));

  // Inicializar componentes de la interfaz
  heroesGrid = new HeroesGrid();
  window.heroesGrid = heroesGrid;
  heroesSearch = new HeroesSearch(heroesGrid);

  // Configurar sistema de navegación
  setupPagination();

  // Cargar datos iniciales en el grid
  heroesGrid.loadHeroes();

  // Configurar listeners de eventos personalizados
  setupCustomEventListeners();

  // Inicializar modal de héroe
  window.heroModal = new HeroModal();
});

/**
 * Configura los event listeners para eventos personalizados
 * Maneja cambios de fuente de datos, filtros y paginación
 */
function setupCustomEventListeners() {
  // Manejar cambios en la fuente de datos (mock/API)
  window.addEventListener("dataSourceChanged", (e) => {
    const { isUsingMock } = e.detail;
    // Recargar datos con la nueva fuente
    heroesGrid.loadHeroes();
    // Notificar al usuario del cambio
    showToast(
      `Cambiado a ${isUsingMock ? "datos mockeados" : "datos de la API"}`,
      "info"
    );
  });

  // Manejar actualizaciones de filtros
  document.addEventListener("filtersUpdated", (e) => {
    const { filters, resultCount } = e.detail;
    // Notificar resultados de la filtración
    if (resultCount === 0) {
      showToast("No se encontraron héroes con los filtros aplicados", "info");
    } else {
      showToast(`Se encontraron ${resultCount} héroes`, "success");
    }
  });

  // Manejar eventos de paginación
  document.addEventListener("paginationUpdated", (e) => {
    const { currentPage, totalPages } = e.detail;

    // Actualizar indicadores de página
    const pageInput = document.getElementById("pageInput");
    const totalPagesSpan = document.getElementById("totalPages");

    if (pageInput) pageInput.value = currentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages;

    // Actualizar estado de botones de navegación
    document.getElementById("firstPage").disabled = currentPage === 1;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
    document.getElementById("lastPage").disabled = currentPage === totalPages;
  });
}

/**
 * Muestra notificaciones toast en la interfaz
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (info, success, error)
 */
window.showToast = function (message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animación de entrada
  setTimeout(() => {
    toast.classList.add("show");
    // Animación de salida
    setTimeout(() => {
      toast.classList.remove("show");
      // Limpieza del DOM
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }, 100);
};
