// Variables globales
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let favoritesManager;
let allHeroes = []; // Almacenar todos los héroes
let filteredHeroes = []; // Almacenar héroes filtrados
let filterBadges; // Instancia del componente FilterBadges

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

  // Inicializar itemsPerPage desde el select
  itemsPerPage = parseInt(document.querySelector("#itemsPerPage").value) || 10;

  // Configurar botón de cambio de datos
  const dataStatusSpan = document.querySelector(".data-status");
  dataStatusSpan.textContent = Config.USE_MOCK_DATA
    ? "Usando Data Mockeada"
    : "Usando API Marvel";
  dataStatusSpan.style.cursor = "pointer";
  dataStatusSpan.addEventListener("click", function () {
    Config.USE_MOCK_DATA = !Config.USE_MOCK_DATA;
    this.textContent = Config.USE_MOCK_DATA
      ? "Usando Data Mockeada"
      : "Usando API Marvel";
    currentPage = 1;
    loadHeroes();
  });

  // Cargar héroes
  loadHeroes();

  // Event Listeners
  setupEventListeners();

  // Inicializar FilterBadges
  filterBadges = new FilterBadges(
    document.getElementById("filterBadgesContainer"),
    handleRemoveFilter
  );
});

// Función para crear una tarjeta de héroe
function createHeroCard(hero) {
  const card = document.createElement("div");
  card.className = "hero-card";
  card.dataset.id = hero.id;

  card.innerHTML = `
    <input type="checkbox" class="card-checkbox" aria-label="Seleccionar héroe">
    <div class="checkbox-indicator"></div>
    <img src="${hero.getImageURL()}" alt="${
    hero.name
  }" class="hero-image" onerror="this.src='assets/images/image-not-found.jpg'">
    <div class="hero-info">
      <h3>${hero.name}</h3>
      <div class="hero-actions">
        <button class="add-favorite-btn" onclick="openCollectionModal(true, ${
          hero.id
        })">
          <i class="far fa-heart"></i> Añadir a Favoritos
        </button>
        <button class="remove-favorite-btn" onclick="openRemoveCollectionModal(true, ${
          hero.id
        })">
          <i class="fas fa-trash"></i> Quitar de Favoritos
        </button>
      </div>
    </div>
  `;

  setupCardEvents(card, hero);
  return card;
}

// Configurar eventos de la tarjeta
function setupCardEvents(card, hero) {
  const checkbox = card.querySelector(".card-checkbox");

  // Evento de checkbox
  checkbox.addEventListener("change", () => {
    card.classList.toggle("selected", checkbox.checked);
    updateActionsBar();
  });

  // Evento de clic en la imagen para ver detalles
  const image = card.querySelector(".hero-image");
  image.addEventListener("click", () => {
    showHeroDetails(hero);
  });
}

// Cargar héroes
async function loadHeroes() {
  try {
    const container = document.querySelector(".heroes-grid");
    container.innerHTML = '<div class="loading">Cargando héroes...</div>';

    // Cargar héroes desde el archivo correcto
    const response = await fetch("js/data/heroes.json");
    if (!response.ok) {
      throw new Error("Error al cargar los héroes");
    }
    const data = await response.json();

    // Limpiar contenedor
    container.innerHTML = "";

    // Crear y mostrar las tarjetas de héroes
    data.heroes.forEach((heroData) => {
      const card = document.createElement("div");
      card.className = "hero-card";
      card.dataset.id = heroData.id;

      card.innerHTML = `
        <img src="${heroData.image}" alt="${heroData.name}" class="hero-image" onerror="this.src='assets/images/image-not-found.jpg'">
        <div class="hero-info">
          <h3>${heroData.name}</h3>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading heroes:", error);
    const container = document.querySelector(".heroes-grid");
    container.innerHTML = '<div class="error">Error al cargar los héroes</div>';
  }
}

// Funciones de búsqueda y filtrado
function handleSearchByName() {
  const searchInput = document.querySelector("#searchByName");
  const searchTerms = searchInput.value
    .trim()
    .toLowerCase()
    .split(",")
    .map((term) => term.trim())
    .filter((term) => term.length > 0);

  if (searchTerms.length === 0) {
    filterBadges.removeFilter("name");
    return;
  }

  // Añadir un badge por cada término de búsqueda
  searchTerms.forEach((term, index) => {
    filterBadges.addFilter(`name${index}`, term, `Nombre: ${term}`);
  });

  applyAllFilters();
}

function handleSearchById() {
  const searchInput = document.querySelector("#searchById");
  const heroId = parseInt(searchInput.value);

  if (isNaN(heroId)) {
    showToast("Por favor ingresa un ID válido", "error");
    return;
  }

  filterBadges.addFilter("id", heroId, `ID: ${heroId}`);
  applyAllFilters();
}

// Función para aplicar todos los filtros activos
function applyAllFilters() {
  const activeFilters = filterBadges.getActiveFilters();
  filteredHeroes = [...allHeroes];

  // Aplicar filtros de nombre (pueden ser múltiples)
  const nameFilters = Object.entries(activeFilters)
    .filter(([key]) => key.startsWith("name"))
    .map(([_, filter]) => filter.value);

  if (nameFilters.length > 0) {
    filteredHeroes = filteredHeroes.filter((hero) =>
      nameFilters.some((term) =>
        hero.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  // Aplicar filtro de ID
  if (activeFilters.id) {
    filteredHeroes = filteredHeroes.filter(
      (hero) => hero.id === parseInt(activeFilters.id.value)
    );
  }

  // Actualizar la vista
  currentPage = 1;
  loadHeroes();

  // Mostrar mensaje con el número de resultados
  const resultCount = filteredHeroes.length;
  if (resultCount === 0) {
    showToast("No se encontraron héroes con los filtros aplicados", "info");
  } else {
    showToast(`Se encontraron ${resultCount} héroes`, "success");
  }
}

// Función para manejar la eliminación de filtros
function handleRemoveFilter(type) {
  if (type === "all") {
    // Limpiar todos los filtros
    filteredHeroes = [];
    // Limpiar inputs
    document.querySelector("#searchByName").value = "";
    document.querySelector("#searchById").value = "";
    currentPage = 1;
    loadHeroes();
  } else if (type.startsWith("name")) {
    // Obtener todos los términos de búsqueda actuales
    const searchInput = document.querySelector("#searchByName");
    const currentTerms = searchInput.value
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    // Remover el término específico
    const termToRemove = filterBadges.getActiveFilters()[type].value;
    const updatedTerms = currentTerms.filter(
      (term) => term.toLowerCase() !== termToRemove.toLowerCase()
    );

    // Actualizar el input con los términos restantes
    searchInput.value = updatedTerms.join(", ");

    // Reaplica los filtros restantes
    if (updatedTerms.length === 0) {
      filterBadges.removeFilter(type);
    }
    applyAllFilters();
  } else {
    // Manejar otros tipos de filtros
    switch (type) {
      case "id":
        document.querySelector("#searchById").value = "";
        break;
    }
    // Reaplica los filtros restantes
    applyAllFilters();
  }
}

// Actualizar botones de favoritos
function updateFavoriteButtons(heroId) {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
  const card = document.querySelector(`.card[data-id="${heroId}"]`);

  if (card) {
    const favoriteBtn = card.querySelector(".add-favorite-btn");
    const removeBtn = card.querySelector(".remove-favorite-btn");
    const isInAnyCollection = favoritesManager.isFavorite(
      dataSource,
      null,
      heroId
    );

    if (favoriteBtn && removeBtn) {
      if (isInAnyCollection) {
        favoriteBtn.classList.add("added");
        favoriteBtn.innerHTML = `<i class="fas fa-heart"></i> Añadido`;
        removeBtn.style.display = "inline-flex";
        removeBtn.classList.add("removing");
      } else {
        favoriteBtn.classList.remove("added");
        favoriteBtn.innerHTML = `<i class="far fa-heart"></i> Añadir a Favoritos`;
        removeBtn.style.display = "none";
        removeBtn.classList.remove("removing");
      }
    }
  }
}

// Actualizar barra de acciones
function updateActionsBar() {
  const selectedCards = document.querySelectorAll(".card.selected");
  const actionsBar = document.getElementById("actionsBar");
  const selectedCount = document.querySelector(".selected-count");

  if (selectedCards.length > 0) {
    actionsBar.classList.add("visible");
    selectedCount.textContent = `${selectedCards.length} héroes seleccionados`;
  } else {
    actionsBar.classList.remove("visible");
    selectedCount.textContent = "0 héroes seleccionados";
  }
}

// Mostrar detalles del héroe
function showHeroDetails(hero) {
  // Crear el modal si no existe
  let modal = document.querySelector(".hero-details-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "hero-details-modal";
    document.body.appendChild(modal);
  }

  // Actualizar contenido del modal
  modal.innerHTML = `
    <div class="hero-details-content">
      <button class="close-modal-btn">
        <i class="fas fa-times"></i>
      </button>
      <div class="hero-details-header">
        <img src="${hero.getImageURL()}" alt="${
    hero.name
  }" class="hero-details-image">
        <div class="hero-details-info">
          <h2 class="hero-details-title">${hero.name}</h2>
          <div class="hero-details-actions">
            <button class="add-favorite-btn" onclick="openCollectionModal(true, ${
              hero.id
            })">
              <i class="far fa-heart"></i> Añadir a Favoritos
            </button>
            <button class="remove-favorite-btn" onclick="openRemoveCollectionModal(true, ${
              hero.id
            })">
              <i class="fas fa-trash"></i> Quitar de Favoritos
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Mostrar el modal
  modal.style.display = "block";

  // Agregar evento para cerrar el modal
  const closeBtn = modal.querySelector(".close-modal-btn");
  closeBtn.onclick = () => (modal.style.display = "none");

  // Cerrar al hacer clic fuera del contenido
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };

  // Cerrar con la tecla Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
    }
  });
}

// Event Listeners
function setupEventListeners() {
  // Event Listeners para los filtros
  document
    .querySelector("#searchByNameBtn")
    .addEventListener("click", handleSearchByName);
  document
    .querySelector("#searchByIdBtn")
    .addEventListener("click", handleSearchById);

  // Event Listeners para paginación
  document
    .querySelector("#itemsPerPage")
    .addEventListener("change", function () {
      currentPage = 1;
      itemsPerPage = parseInt(this.value);
      loadHeroes();
    });

  document.querySelector("#firstPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage = 1;
      loadHeroes();
    }
  });

  document.querySelector("#prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadHeroes();
    }
  });

  document.querySelector("#nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadHeroes();
    }
  });

  document.querySelector("#lastPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage = totalPages;
      loadHeroes();
    }
  });

  // Event Listeners para la barra de acciones
  document
    .querySelector(".save-favorites-btn")
    .addEventListener("click", () => {
      const selectedCards = document.querySelectorAll(".card.selected");
      if (selectedCards.length > 0) {
        openCollectionModal(false);
      } else {
        showToast("No hay héroes seleccionados", "error");
      }
    });

  document
    .querySelector(".remove-favorites-btn")
    .addEventListener("click", () => {
      const selectedCards = document.querySelectorAll(".card.selected");
      if (selectedCards.length > 0) {
        openRemoveCollectionModal(false);
      } else {
        showToast("No hay héroes seleccionados", "error");
      }
    });

  // Event Listener para el input de página
  document.querySelector("#pageInput").addEventListener("change", function () {
    const newPage = parseInt(this.value);
    if (newPage && newPage > 0 && newPage <= totalPages) {
      currentPage = newPage;
      loadHeroes();
    } else {
      this.value = currentPage;
      showToast("Número de página inválido", "error");
    }
  });

  // Cerrar modal al hacer clic fuera
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("collectionModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Cerrar modal con Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const modal = document.getElementById("collectionModal");
      modal.style.display = "none";
    }
  });

  // Botón de cerrar modal
  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("collectionModal").style.display = "none";
  });

  // Botón de logout
  document.querySelector(".logout-button").addEventListener("click", () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userName");
    window.location.href = "login.html";
  });
}

// Actualizar controles de paginación
function updatePagination(totalItems) {
  totalPages = Math.ceil(totalItems / itemsPerPage);

  // Actualizar el input de página y el total
  const pageInput = document.querySelector("#pageInput");
  const totalPagesSpan = document.querySelector("#totalPages");

  if (pageInput) pageInput.value = currentPage;
  if (totalPagesSpan) totalPagesSpan.textContent = totalPages;

  // Actualizar estado de botones de navegación
  const firstPageBtn = document.querySelector("#firstPage");
  const prevPageBtn = document.querySelector("#prevPage");
  const nextPageBtn = document.querySelector("#nextPage");
  const lastPageBtn = document.querySelector("#lastPage");

  if (firstPageBtn) firstPageBtn.disabled = currentPage === 1;
  if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
  if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
  if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages;

  // Actualizar el input de página
  if (pageInput) {
    pageInput.min = 1;
    pageInput.max = totalPages;
  }
}

// Mostrar notificación toast
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
