// Variables globales
let collectionsManager;
let heroesGrid;
let heroesSearch;
let heroesActionsBar;

document.addEventListener("DOMContentLoaded", async () => {
  // Verificar autenticación
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  if (!userToken || !userName) {
    window.location.href = "login.html";
    return;
  }

  // Inicializar manejador de coleccionables
  collectionsManager = new Collections();
  window.collectionsManager = collectionsManager; // Make it globally available

  // Dispatch event to notify collectionsManager is ready
  window.dispatchEvent(new CustomEvent("collectionsManagerReady"));

  // Inicializar componentes
  heroesGrid = new HeroesGrid(".heroes-grid");
  window.heroesGrid = heroesGrid;

  heroesSearch = new HeroesSearch(
    document.getElementById("filterBadgesContainer")
  );
  heroesActionsBar = new HeroesActionsBar();

  // Configurar paginación
  setupPagination();

  // Cargar datos iniciales
  heroesGrid.loadHeroes();

  // Event Listeners para eventos personalizados
  setupCustomEventListeners();
});

function setupCustomEventListeners() {
  // Escuchar cambios en la fuente de datos
  window.addEventListener("dataSourceChanged", (e) => {
    const { isUsingMock } = e.detail;
    // Recargar los héroes con la nueva fuente de datos
    heroesGrid.loadHeroes();
    // Mostrar notificación del cambio
    showToast(
      `Cambiado a ${isUsingMock ? "datos mockeados" : "datos de la API"}`,
      "info"
    );
  });

  // Escuchar eventos de filtros
  document.addEventListener("filtersUpdated", (e) => {
    const { filters, resultCount } = e.detail;
    if (resultCount === 0) {
      showToast("No se encontraron héroes con los filtros aplicados", "info");
    } else {
      showToast(`Se encontraron ${resultCount} héroes`, "success");
    }
  });

  // Escuchar eventos de paginación
  document.addEventListener("paginationUpdated", (e) => {
    const { currentPage, totalPages } = e.detail;

    // Actualizar el input de página y el total
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

// Función auxiliar para mostrar notificaciones toast
window.showToast = function (message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }, 100);
};
