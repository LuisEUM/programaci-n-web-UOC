// Variables globales
let favoritesManager;
let comicsGrid;
let comicsSearch;
let comicsActionsBar;
let comicsCollectionModal;
let heroesCarousel;

document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  if (!userToken || !userName) {
    window.location.href = "login.html";
    return;
  }

  // Inicializar manejador de favoritos
  favoritesManager = new Favorites();

  // Esperar a que el Navbar esté listo
  setTimeout(() => {
    // Configurar botón de cambio de datos
    setupDataToggle();
  }, 0);

  // Inicializar componentes
  comicsGrid = new ComicsGrid(".comics-grid");
  window.comicsGrid = comicsGrid; // Para acceso global (necesario para los filtros)

  comicsSearch = new ComicsSearch(
    document.getElementById("filterBadgesContainer")
  );
  comicsActionsBar = new ComicsActionsBar();
  comicsCollectionModal = new ComicsCollectionModal();
  heroesCarousel = new HeroesCarousel(".carousel-wrapper");

  // Configurar paginación
  setupPagination();

  // Cargar datos iniciales
  comicsGrid.loadComics();

  // Event Listeners para eventos personalizados
  setupCustomEventListeners();
});

function setupDataToggle() {
  const dataStatusSpan = document.querySelector(".data-status");
  if (!dataStatusSpan) return; // Si no existe el elemento, salimos

  dataStatusSpan.textContent = Config.USE_MOCK_DATA
    ? "Usando Data Mockeada"
    : "Usando API Marvel";
  dataStatusSpan.style.cursor = "pointer";

  // Asegurarnos de que el ícono esté presente
  const icon = document.createElement("i");
  icon.className = "fas fa-database";
  icon.setAttribute("aria-hidden", "true");

  // Si ya existe un ícono, no lo agregamos
  if (!dataStatusSpan.querySelector("i")) {
    dataStatusSpan.insertBefore(icon, dataStatusSpan.firstChild);
    dataStatusSpan.insertBefore(
      document.createTextNode(" "),
      dataStatusSpan.lastChild
    );
  }

  dataStatusSpan.addEventListener("click", function () {
    Config.USE_MOCK_DATA = !Config.USE_MOCK_DATA;
    const text = Config.USE_MOCK_DATA
      ? "Usando Data Mockeada"
      : "Usando API Marvel";

    // Mantener el ícono al actualizar el texto
    this.innerHTML = "";
    this.appendChild(icon);
    this.appendChild(document.createTextNode(" " + text));

    comicsGrid.loadComics();
  });
}

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

  // Escuchar eventos de actualización de botones de favoritos
  document.addEventListener("updateFavoriteButtons", (e) => {
    comicsGrid.updateFavoriteButtons(e.detail.comicId);
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
