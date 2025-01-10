// Variables globales
let collectionsManager;
let comicsGrid;
let comicsSearch;
let comicsActionsBar;
let comicsCollectionModal;
let heroesCarousel;
let comicModal;

document.addEventListener("DOMContentLoaded", async () => {
  // Verificar autenticación
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  if (!userToken || !userName) {
    window.location.href = "login.html";
    return;
  }

  // Inicializar preferencia de fuente de datos si no existe
  if (!localStorage.getItem("dataSourcePreference")) {
    localStorage.setItem("dataSourcePreference", "mock");
    Config.USE_MOCK_DATA = true;
  }

  // Inicializar manejador de coleccionables
  collectionsManager = new Collections();
  window.collectionsManager = collectionsManager; // Make it globally available

  // Dispatch event to notify collectionsManager is ready
  window.dispatchEvent(new CustomEvent("collectionsManagerReady"));

  // Inicializar componentes
  comicsGrid = new ComicsGrid(".comics-grid");
  window.comicsGrid = comicsGrid;

  comicsSearch = new ComicsSearch(
    document.getElementById("filterBadgesContainer")
  );
  comicsActionsBar = new ComicsActionsBar();
  comicsCollectionModal = new ComicsCollectionModal();
  heroesCarousel = new HeroesCarousel(".carousel-wrapper");
  comicModal = new ComicModal();
  window.comicModal = comicModal;

  // Configurar paginación
  setupPagination();

  // Cargar datos iniciales
  comicsGrid.loadComics();

  // Event Listeners para eventos personalizados
  setupCustomEventListeners();
});

function setupPagination() {
  document
    .querySelector("#itemsPerPage")
    .addEventListener("change", function () {
      comicsGrid.setItemsPerPage(parseInt(this.value));
    });

  document.querySelector("#firstPage").addEventListener("click", () => {
    if (comicsGrid.currentPage > 1) {
      comicsGrid.setPage(1);
    }
  });

  document.querySelector("#prevPage").addEventListener("click", () => {
    if (comicsGrid.currentPage > 1) {
      comicsGrid.setPage(comicsGrid.currentPage - 1);
    }
  });

  document.querySelector("#nextPage").addEventListener("click", () => {
    if (comicsGrid.currentPage < comicsGrid.totalPages) {
      comicsGrid.setPage(comicsGrid.currentPage + 1);
    }
  });

  document.querySelector("#lastPage").addEventListener("click", () => {
    if (comicsGrid.currentPage < comicsGrid.totalPages) {
      comicsGrid.setPage(comicsGrid.totalPages);
    }
  });

  document.querySelector("#pageInput").addEventListener("change", function () {
    const newPage = parseInt(this.value);
    if (newPage && newPage > 0 && newPage <= comicsGrid.totalPages) {
      comicsGrid.setPage(newPage);
    } else {
      this.value = comicsGrid.currentPage;
      showToast("Número de página inválido", "error");
    }
  });
}

function setupCustomEventListeners() {
  // Escuchar cambios en la fuente de datos
  window.addEventListener("dataSourceChanged", (e) => {
    const { isUsingMock } = e.detail;
    // Recargar los cómics con la nueva fuente de datos
    comicsGrid.loadComics();
    // Mostrar notificación del cambio
    showToast(
      `Cambiado a ${isUsingMock ? "datos mockeados" : "datos de la API"}`,
      "info"
    );
  });

  // Escuchar eventos de filtros
  document.addEventListener("filtersUpdated", (e) => {
    const { filters, resultCount } = e.detail;
    comicsGrid.applyFilters(filters);

    if (resultCount === 0) {
      showToast("No se encontraron cómics con los filtros aplicados", "info");
    } else {
      showToast(`Se encontraron ${resultCount} cómics`, "success");
    }
  });

  // Escuchar eventos de paginación
  document.addEventListener("paginationUpdated", (e) => {
    const { currentPage, totalPages, itemsPerPage } = e.detail;

    // Actualizar el input de página y el total
    const pageInput = document.querySelector("#pageInput");
    const totalPagesSpan = document.querySelector("#totalPages");

    if (pageInput) pageInput.value = currentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages;

    // Actualizar estado de botones de navegación
    document.querySelector("#firstPage").disabled = currentPage === 1;
    document.querySelector("#prevPage").disabled = currentPage === 1;
    document.querySelector("#nextPage").disabled = currentPage === totalPages;
    document.querySelector("#lastPage").disabled = currentPage === totalPages;
  });

  // Escuchar eventos de actualización de botones de coleccionables
  document.addEventListener("updateCollectionButtons", (e) => {
    comicsGrid.updateCollectionButtons(e.detail.comicId);
  });
}

// Función auxiliar para mostrar notificaciones toast
function showToast(message, type = "info") {
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
}
