// Variables globales
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let favoritesManager;
let allComics = []; // Almacenar todos los comics
let filteredComics = []; // Almacenar comics filtrados
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
    loadComics();
  });

  // Cargar héroes y cómics
  loadHeroes();
  loadComics();

  // Event Listeners
  setupEventListeners();

  // Inicializar FilterBadges
  filterBadges = new FilterBadges(
    document.getElementById("filterBadgesContainer"),
    handleRemoveFilter
  );
});

// Función para crear una tarjeta de cómic
function createComicCard(comic) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = comic.id;

  const thumbnailUrl = comic.getThumbnailURL();
  const shortDescription = comic.description
    ? comic.description.length > 50
      ? comic.description.substring(0, 47) + "..."
      : comic.description
    : "No description available";

  card.innerHTML = `
    <input type="checkbox" class="card-checkbox" aria-label="Seleccionar cómic">
    <div class="checkbox-indicator"></div>
    <span class="card-id">ID: ${comic.id}</span>
    <img class="card-image" src="${thumbnailUrl}" alt="${
    comic.title
  }" onerror="this.src='assets/images/image-not-found.jpg'">
    <div class="card-info">
      <h3 class="card-title">${comic.title}</h3>
      <p class="card-description">${shortDescription}</p>
      <div class="card-metadata">
        <p class="comic-price">$${comic.price.toFixed(2)}</p>
      </div>
      <div class="card-actions">
        <button class="add-favorite-btn" onclick="openCollectionModal(true, ${
          comic.id
        })">
          <i class="far fa-heart"></i> Añadir a Favoritos
        </button>
        <button class="remove-favorite-btn" onclick="openRemoveCollectionModal(true, ${
          comic.id
        })">
          <i class="fas fa-trash"></i> Quitar de Favoritos
        </button>
      </div>
    </div>
  `;

  setupCardEvents(card, comic);
  return card;
}

// Configurar eventos de la tarjeta
function setupCardEvents(card, comic) {
  const checkbox = card.querySelector(".card-checkbox");

  // Evento de checkbox
  checkbox.addEventListener("change", () => {
    card.classList.toggle("selected", checkbox.checked);
    updateActionsBar();
  });
}

// Actualizar botones de favoritos
function updateFavoriteButtons(comicId) {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
  const card = document.querySelector(`.card[data-id="${comicId}"]`);

  if (card) {
    const favoriteBtn = card.querySelector(".add-favorite-btn");
    const removeBtn = card.querySelector(".remove-favorite-btn");
    const isInAnyCollection = favoritesManager.isFavorite(
      dataSource,
      null,
      comicId
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

// Manejar selección de colección
function handleCollectionSelection(
  collection,
  isRemove = false,
  comicId = null
) {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
  const selectedCards = document.querySelectorAll(".card.selected");
  let actionCount = 0;

  if (comicId) {
    // Manejo individual
    if (isRemove) {
      favoritesManager.removeFavorite(dataSource, collection, comicId);
      showToast(
        `Comic eliminado de ${favoritesManager.getCollectionDisplayName(
          collection
        )}`,
        "success"
      );
    } else {
      favoritesManager.addFavorite(dataSource, collection, comicId);
      showToast(
        `Comic añadido a ${favoritesManager.getCollectionDisplayName(
          collection
        )}`,
        "success"
      );
    }
    updateFavoriteButtons(comicId);
  } else {
    // Manejo múltiple
    selectedCards.forEach((card) => {
      const id = parseInt(card.dataset.id);
      if (isRemove) {
        if (favoritesManager.isFavorite(dataSource, collection, id)) {
          favoritesManager.removeFavorite(dataSource, collection, id);
          actionCount++;
        }
      } else {
        if (!favoritesManager.isFavorite(dataSource, collection, id)) {
          favoritesManager.addFavorite(dataSource, collection, id);
          actionCount++;
        }
      }
      updateFavoriteButtons(id);
      card.classList.remove("selected");
      const checkbox = card.querySelector(".card-checkbox");
      if (checkbox) checkbox.checked = false;
    });

    // Mostrar mensaje con el número de comics afectados
    const action = isRemove ? "eliminados de" : "añadidos a";
    const collectionName =
      favoritesManager.getCollectionDisplayName(collection);
    if (actionCount > 0) {
      showToast(
        `${actionCount} ${
          actionCount === 1 ? "comic" : "comics"
        } ${action} ${collectionName}`,
        "success"
      );
    } else {
      showToast(`No se realizaron cambios en ${collectionName}`, "info");
    }
  }

  // Actualizar el estado de los botones en el modal si es una selección individual
  if (comicId) {
    const buttons = document.querySelectorAll(".collection-btn");
    buttons.forEach((button) => {
      const buttonCollection = button.dataset.collection;
      const isInCollection = favoritesManager.isFavorite(
        dataSource,
        buttonCollection,
        comicId
      );
      button.disabled = isInCollection;

      if (isInCollection) {
        button.innerHTML = `${Favorites.COLLECTION_NAMES[buttonCollection]} (Ya añadido)`;
      } else {
        button.innerHTML = `<i class="${getCollectionIcon(
          buttonCollection
        )}"></i> ${Favorites.COLLECTION_NAMES[buttonCollection]}`;
      }
    });
  }

  // Cerrar el modal
  document.getElementById("collectionModal").style.display = "none";

  // Actualizar la barra de acciones
  updateActionsBar();
}

// Abrir modal de colecciones
function openCollectionModal(isIndividual = false, comicId = null) {
  const modal = document.getElementById("collectionModal");
  modal.style.display = "block";

  const buttons = modal.querySelectorAll(".collection-btn");
  buttons.forEach((button) => {
    const collection = button.dataset.collection;

    // Si es una selección individual, verificar si el cómic ya está en la colección
    if (isIndividual && comicId) {
      const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
      const isInCollection = favoritesManager.isFavorite(
        dataSource,
        collection,
        comicId
      );
      button.disabled = isInCollection;

      // Actualizar el texto del botón manteniendo el ícono
      if (isInCollection) {
        button.innerHTML = `<i class="${getCollectionIcon(collection)}"></i> ${
          Favorites.COLLECTION_NAMES[collection]
        } (Ya añadido)`;
      } else {
        button.innerHTML = `<i class="${getCollectionIcon(collection)}"></i> ${
          Favorites.COLLECTION_NAMES[collection]
        }`;
      }
    } else {
      // Para selección múltiple, habilitar todos los botones
      button.disabled = false;
      button.innerHTML = `<i class="${getCollectionIcon(collection)}"></i> ${
        Favorites.COLLECTION_NAMES[collection]
      }`;
    }

    button.onclick = () =>
      handleCollectionSelection(
        collection,
        false,
        isIndividual ? comicId : null
      );
  });
}

// Función auxiliar para obtener el ícono de cada colección
function getCollectionIcon(collection) {
  const icons = {
    wishlist: "fas fa-star",
    toread: "fas fa-bookmark",
    reading: "fas fa-book-open",
    read: "fas fa-check-circle",
    favorites: "fas fa-heart",
  };
  return icons[collection] || "fas fa-list";
}

// Abrir modal para remover de colecciones
function openRemoveCollectionModal(isIndividual = false, comicId = null) {
  const modal = document.getElementById("collectionModal");
  modal.style.display = "block";

  const buttons = modal.querySelectorAll(".collection-btn");
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

  buttons.forEach((button) => {
    const collection = button.dataset.collection;

    // Si es una selección individual, solo habilitar los botones de las colecciones donde está el cómic
    if (isIndividual && comicId) {
      const isInCollection = favoritesManager.isFavorite(
        dataSource,
        collection,
        comicId
      );
      button.disabled = !isInCollection; // Habilitar solo si está en la colección

      if (isInCollection) {
        button.innerHTML = `<i class="${getCollectionIcon(
          collection
        )}"></i> Quitar de ${Favorites.COLLECTION_NAMES[collection]}`;
      } else {
        button.innerHTML = `<i class="${getCollectionIcon(collection)}"></i> ${
          Favorites.COLLECTION_NAMES[collection]
        }`;
      }
    } else {
      // Para selección múltiple, habilitar todos los botones
      button.disabled = false;
      button.innerHTML = `<i class="${getCollectionIcon(
        collection
      )}"></i> Quitar de ${Favorites.COLLECTION_NAMES[collection]}`;
    }

    button.onclick = () =>
      handleCollectionSelection(
        collection,
        true,
        isIndividual ? comicId : null
      );
  });
}

// Actualizar barra de acciones
function updateActionsBar() {
  const selectedCards = document.querySelectorAll(".card.selected");
  const actionsBar = document.getElementById("actionsBar");
  const selectedCount = document.querySelector(".selected-count");

  if (selectedCards.length > 0) {
    actionsBar.classList.add("visible");

    // Calcular precio total y promedio
    const prices = Array.from(selectedCards).map((card) => {
      const priceText = card.querySelector(".comic-price").textContent;
      return parseFloat(priceText.replace("$", ""));
    });

    const totalPrice = prices.reduce((sum, price) => sum + price, 0);
    const avgPrice = totalPrice / prices.length;

    selectedCount.innerHTML = `
      <div class="price-info">
        <span class="selected-text">${
          selectedCards.length
        } cómics seleccionados</span>
        <div class="price-details">
          <span class="total-price">Total: $${totalPrice.toFixed(2)}</span>
          <span class="average-price">Promedio: $${avgPrice.toFixed(2)}</span>
        </div>
      </div>
    `;
  } else {
    actionsBar.classList.remove("visible");
    selectedCount.innerHTML =
      '<span class="selected-text">0 cómics seleccionados</span>';
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

// Event Listeners
function setupEventListeners() {
  // Event Listeners para los filtros
  document
    .querySelector("#searchByNameBtn")
    .addEventListener("click", handleSearchByName);
  document
    .querySelector("#searchByIdBtn")
    .addEventListener("click", handleSearchById);
  document
    .querySelector("#filterByPriceBtn")
    .addEventListener("click", handlePriceFilter);

  // Event Listeners para paginación
  document
    .querySelector("#itemsPerPage")
    .addEventListener("change", function () {
      currentPage = 1;
      itemsPerPage = parseInt(this.value);
      loadComics();
    });

  document.querySelector("#firstPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage = 1;
      loadComics();
    }
  });

  document.querySelector("#prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadComics();
    }
  });

  document.querySelector("#nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadComics();
    }
  });

  document.querySelector("#lastPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage = totalPages;
      loadComics();
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
        showToast("No hay cómics seleccionados", "error");
      }
    });

  document
    .querySelector(".remove-favorites-btn")
    .addEventListener("click", () => {
      const selectedCards = document.querySelectorAll(".card.selected");
      if (selectedCards.length > 0) {
        openRemoveCollectionModal(false);
      } else {
        showToast("No hay cómics seleccionados", "error");
      }
    });

  // Event Listener para el input de página
  document.querySelector("#pageInput").addEventListener("change", function () {
    const newPage = parseInt(this.value);
    if (newPage && newPage > 0 && newPage <= totalPages) {
      currentPage = newPage;
      loadComics();
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
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
  });

  // Event listener para búsqueda por nombre
  document.querySelector("#searchByNameBtn").addEventListener("click", () => {
    const searchInput = document.querySelector("#searchByName");
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
      // Verificar si ya existe un badge con este término
      const activeFilters = filterBadges.getActiveFilters();
      const isDuplicate = Object.entries(activeFilters).some(
        ([key, filter]) =>
          key.startsWith("name") &&
          filter.value.toLowerCase() === searchTerm.toLowerCase()
      );

      // Solo añadir si no es duplicado
      if (!isDuplicate) {
        filterBadges.addFilter(
          `name_${Date.now()}`,
          searchTerm,
          `Nombre: ${searchTerm}`
        );

        // Limpiar el input después de añadir el badge
        searchInput.value = "";

        // Aplicar los filtros
        applyAllFilters();
      } else {
        // Opcional: Mostrar mensaje de que ya existe el filtro
        showToast("Este filtro ya está aplicado", "info");
        searchInput.value = "";
      }
    }
  });

  // Event listener para búsqueda por ID
  document.querySelector("#searchByIdBtn").addEventListener("click", () => {
    const searchInput = document.querySelector("#searchById");
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
      filterBadges.addFilter("id", searchTerm, `ID: ${searchTerm}`);

      // Limpiar el input después de añadir el badge
      searchInput.value = "";

      applyAllFilters();
    }
  });

  // Event listener para filtro de precio
  document.querySelector("#filterByPriceBtn").addEventListener("click", () => {
    const priceInput = document.querySelector("#priceFilter");
    const price = priceInput.value.trim();

    if (price) {
      filterBadges.addFilter("price", price, `Precio máx: $${price}`);

      // Limpiar el input después de añadir el badge
      priceInput.value = "";

      applyAllFilters();
    }
  });
}

// Funciones auxiliares
function calculateAveragePrice(cards) {
  if (!cards || cards.length === 0) return 0;
  let total = 0;
  cards.forEach((card) => {
    const price = parseFloat(
      card.querySelector(".comic-price").textContent.replace("$", "")
    );
    total += price;
  });
  return total / cards.length;
}

// Cargar héroes
async function loadHeroes() {
  try {
    const response = await fetch("js/data/heroes.json");
    const data = await response.json();
    const heroesInner = document.querySelector(".heroes-inner");

    // Dividir los héroes en grupos de 9
    const heroGroups = [];
    for (let i = 0; i < data.heroes.length; i += 9) {
      heroGroups.push(data.heroes.slice(i, i + 9));
    }

    // Crear grupos de héroes
    heroGroups.forEach((group) => {
      const groupDiv = document.createElement("div");
      groupDiv.className = "heroes-group";

      group.forEach((hero) => {
        const heroCard = createHeroCard(hero);
        groupDiv.appendChild(heroCard);
      });

      heroesInner.appendChild(groupDiv);
    });

    // Actualizar controles del carrusel
    updateCarouselControls(heroGroups.length);
  } catch (error) {
    console.error("Error loading heroes:", error);
  }
}

// Crear tarjeta de héroe
function createHeroCard(hero) {
  const card = document.createElement("div");
  card.className = "hero-card";
  card.dataset.id = hero.id;

  card.innerHTML = `
    <img src="${hero.image}" alt="${hero.name}">
    <div class="hero-info">
      <h3>${hero.name}</h3>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `heroes.html?id=${hero.id}`;
  });

  return card;
}

// Cargar cómics
async function loadComics() {
  try {
    const container = document.querySelector(".comics-grid");
    container.innerHTML = '<div class="loading">Cargando cómics...</div>';

    // Cargar cómics desde comics.json si aún no están cargados
    if (allComics.length === 0) {
      const response = await fetch("js/data/comics.json");
      if (!response.ok) {
        throw new Error("Error fetching comics from comics.json");
      }
      const data = await response.json();
      allComics = data.comics.map((comic) => Comic.fromAPI(comic));
    }

    // Usar los comics filtrados si hay algún filtro activo, si no usar todos
    const comicsToShow = filteredComics.length > 0 ? filteredComics : allComics;

    if (!comicsToShow || comicsToShow.length === 0) {
      container.innerHTML =
        '<div class="no-results">No se encontraron cómics</div>';
      updatePagination(0);
      return;
    }

    // Calcular paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedComics = comicsToShow.slice(startIndex, endIndex);

    // Limpiar contenedor y mostrar cómics
    container.innerHTML = "";
    paginatedComics.forEach((comic) => {
      const card = createComicCard(comic);
      container.appendChild(card);
      // Actualizar estado del botón para este cómic
      updateFavoriteButtons(comic.id);
    });

    // Actualizar paginación
    updatePagination(comicsToShow.length);
  } catch (error) {
    console.error("Error loading comics:", error);
    showToast("Error al cargar los cómics", "error");
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
  const comicId = parseInt(searchInput.value);

  if (isNaN(comicId)) {
    showToast("Por favor ingresa un ID válido", "error");
    return;
  }

  filterBadges.addFilter("id", comicId, `ID: ${comicId}`);
  applyAllFilters();
}

function handlePriceFilter() {
  const priceInput = document.querySelector("#priceFilter");
  const maxPrice = parseFloat(priceInput.value);

  if (isNaN(maxPrice)) {
    showToast("Por favor ingresa un precio válido", "error");
    return;
  }

  filterBadges.addFilter("price", maxPrice, `Precio máximo: $${maxPrice}`);
  applyAllFilters();
}

// Función para aplicar todos los filtros activos
function applyAllFilters() {
  const activeFilters = filterBadges.getActiveFilters();
  filteredComics = [...allComics];

  // Aplicar filtros de nombre (pueden ser múltiples)
  const nameFilters = Object.entries(activeFilters)
    .filter(([key]) => key.startsWith("name"))
    .map(([_, filter]) => filter.value);

  if (nameFilters.length > 0) {
    filteredComics = filteredComics.filter((comic) =>
      nameFilters.some((term) =>
        comic.title.toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  // Aplicar filtro de ID
  if (activeFilters.id) {
    filteredComics = filteredComics.filter(
      (comic) => comic.id === parseInt(activeFilters.id.value)
    );
  }

  // Aplicar filtro de precio
  if (activeFilters.price) {
    filteredComics = filteredComics.filter(
      (comic) => comic.price <= parseFloat(activeFilters.price.value)
    );
  }

  // Actualizar la vista
  currentPage = 1;
  loadComics();

  // Mostrar mensaje con el número de resultados
  const resultCount = filteredComics.length;
  if (resultCount === 0) {
    showToast("No se encontraron cómics con los filtros aplicados", "info");
  } else {
    showToast(`Se encontraron ${resultCount} cómics`, "success");
  }
}

// Función para manejar la eliminación de filtros
function handleRemoveFilter(type) {
  if (type === "all") {
    // Limpiar todos los filtros
    filteredComics = [];
    // Limpiar inputs
    document.querySelector("#searchByName").value = "";
    document.querySelector("#searchById").value = "";
    document.querySelector("#priceFilter").value = "";
    currentPage = 1;
    loadComics();
  } else if (type.startsWith("name")) {
    // Obtener todos los términos de búsqueda actuales
    const searchInput = document.querySelector("#searchByName");
    const currentTerms = searchInput.value
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    // Remover el término específico
    const termToRemove = filterBadges.getActiveFilters()[type]?.value || "";
    const updatedTerms = currentTerms.filter(
      (term) => term.toLowerCase() !== termToRemove.toLowerCase()
    );

    // Actualizar el input con los términos restantes
    searchInput.value = updatedTerms.join(", ");

    // Si no quedan términos, resetear los comics filtrados
    if (updatedTerms.length === 0 && !filterBadges.hasActiveFilters()) {
      filteredComics = [];
      currentPage = 1;
      loadComics();
    } else {
      // Si quedan otros filtros, reaplicarlos
      applyAllFilters();
    }
  } else {
    // Manejar otros tipos de filtros
    switch (type) {
      case "id":
        document.querySelector("#searchById").value = "";
        break;
      case "price":
        document.querySelector("#priceFilter").value = "";
        break;
    }

    // Si no quedan filtros activos, mostrar todos los comics
    if (!filterBadges.hasActiveFilters()) {
      filteredComics = [];
      currentPage = 1;
      loadComics();
    } else {
      // Si quedan otros filtros, reaplicarlos
      applyAllFilters();
    }
  }
}

// Función para reaplicar los filtros restantes
function reapplyRemainingFilters() {
  applyAllFilters();
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

// Actualizar controles del carrusel
function updateCarouselControls(numGroups) {
  const wrapper = document.querySelector(".carousel-wrapper");
  const dots = document.querySelector(".carousel-dots");
  const controls = document.querySelector(".carousel-controls");

  // Limpiar controles existentes
  while (dots.firstChild) {
    dots.removeChild(dots.firstChild);
  }

  // Limpiar radio buttons existentes
  wrapper.querySelectorAll('input[type="radio"]').forEach((input) => {
    if (input.name === "hero-slider") {
      wrapper.removeChild(input);
    }
  });

  // Crear radio buttons y dots para cada grupo
  for (let i = 1; i <= numGroups; i++) {
    // Radio button
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "hero-slider";
    input.id = `hero${i}`;
    if (i === 1) input.checked = true;
    wrapper.insertBefore(input, wrapper.firstChild);

    // Dot
    const dot = document.createElement("label");
    dot.setAttribute("for", `hero${i}`);
    dots.appendChild(dot);
  }

  // Actualizar controles de navegación
  const prevLabel = controls.querySelector(".prev-slide");
  const nextLabel = controls.querySelector(".next-slide");

  function updateNavigationLabels() {
    const checkedInput = wrapper.querySelector(
      'input[name="hero-slider"]:checked'
    );
    const currentNum = parseInt(checkedInput.id.replace("hero", ""));

    prevLabel.setAttribute(
      "for",
      `hero${currentNum === 1 ? numGroups : currentNum - 1}`
    );
    nextLabel.setAttribute(
      "for",
      `hero${currentNum === numGroups ? 1 : currentNum + 1}`
    );
  }

  // Actualizar labels inicialmente
  updateNavigationLabels();

  // Agregar event listeners para actualizar las flechas cuando cambie la selección
  wrapper.querySelectorAll('input[name="hero-slider"]').forEach((input) => {
    input.addEventListener("change", updateNavigationLabels);
  });
}

// ... resto del código existente ...
