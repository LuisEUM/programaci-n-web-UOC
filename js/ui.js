const UI = {
  offset: 0,
  currentSearchTerm: "",
  totalPages: 0,
  currentPage: 1,
  favoritesManager: new Favorites(),
  selectedComics: new Set(),
  currentComics: [],

  init() {
    this.bindEvents();
    this.updateToggleButton();
    this.loadInitialComics();
    this.isIndividualRemove = false;
    this.isRemoveAction = false;
    this.selectedComics = new Set();

    // Inicializar el modal de colecciones
    this.collectionModal = new CollectionModal();

    // Inicializar los tabs principales
    const tabsContainer = document.querySelector('.tabs-container');
    this.mainTabs = new MainTabs(tabsContainer, (tabName) => this.handleTabChange(tabName));

    // Inicializar paginación para cómics
    const comicsPaginationContainer = document.querySelector('#comicsTab .pagination');
    this.comicsPagination = new Pagination(comicsPaginationContainer, {
        itemsPerPage: Config.LIMIT,
        onPageChange: async (page) => {
            this.currentPage = page;
            this.offset = (page - 1) * this.comicsPagination.itemsPerPage;
            await this.loadComics();
        },
        onItemsPerPageChange: async (itemsPerPage) => {
            Config.LIMIT = itemsPerPage;
            this.offset = 0;
            this.currentPage = 1;
            await this.loadComics();
        }
    });

    // Inicializar paginación para héroes
    const heroesPaginationContainer = document.querySelector('#heroesTab .heroes-pagination');
    if (heroesPaginationContainer) {
        this.heroesPagination = new HeroesPagination(heroesPaginationContainer, {
            itemsPerPage: Config.LIMIT,
            onPageChange: (page) => {
                this.heroesOffset = (page - 1) * this.heroesPagination.itemsPerPage;
                this.loadHeroes();
            },
            onItemsPerPageChange: (itemsPerPage) => {
                this.heroesOffset = 0;
                this.loadHeroes();
            }
        });
    }

    // Cargar los cómics iniciales después de inicializar la paginación
    this.loadInitialComics();
  },

  updateToggleButton() {
    const toggleBtn = document.getElementById("toggleDataBtn");
    if (Config.USE_MOCK_DATA) {
      toggleBtn.textContent = "Usando Data Mockeada";
      toggleBtn.classList.add("mock");
    } else {
      toggleBtn.textContent = "Usando Data de la API";
      toggleBtn.classList.remove("mock");
    }
  },

  bindEvents() {
    // Búsqueda por nombre
    const searchInput = document.getElementById("searchInput");
    const searchByNameBtn = document.getElementById("searchByNameBtn");
    
    if (searchInput) {
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.handleSearchByName();
            }
        });
    }
    if (searchByNameBtn) {
        searchByNameBtn.addEventListener("click", () => this.handleSearchByName());
    }

    // Búsqueda por ID
    const searchById = document.getElementById("searchById");
    const searchByIdBtn = document.getElementById("searchByIdBtn");
    
    if (searchById) {
        searchById.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.handleSearchById();
            }
        });
    }
    if (searchByIdBtn) {
        searchByIdBtn.addEventListener("click", () => this.handleSearchById());
    }

    // Tabs principales
    const mainTabsContainer = document.querySelector('.tabs-container');
    if (mainTabsContainer) {
        this.mainTabs = new MainTabs(mainTabsContainer, (tabName) => this.handleTabChange(tabName));
    }

    // Paginación
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => this.handlePrevPage());
    }
    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => this.handleNextPage());
    }

    // Botón de toggle de datos
    const toggleDataBtn = document.getElementById("toggleDataBtn");
    if (toggleDataBtn) {
        toggleDataBtn.addEventListener("click", () => this.toggleDataSource());
    }

    // Botón de guardar favoritos
    const saveFavoritesBtn = document.querySelector(".save-favorites-btn");
    if (saveFavoritesBtn) {
        saveFavoritesBtn.addEventListener("click", () => this.saveFavorites());
    }

    // Botón de remover favoritos
    const removeFavoritesBtn = document.querySelector(".remove-favorites-btn");
    if (removeFavoritesBtn) {
        removeFavoritesBtn.addEventListener("click", () => this.removeFavorites());
    }
  },

  handleSearch(e) {
    if (e.key === "Enter") {
      const searchTerm = document.getElementById("searchInput").value.trim();
      this.currentSearchTerm = searchTerm;
      this.offset = 0;
      this.currentPage = 1;
      this.loadComics();
    }
  },

  handleTabChange(tabName) {
    // Ocultar todos los contenedores de tabs
    document.querySelectorAll('.tab-content').forEach(container => {
        container.style.display = 'none';
    });

    // Mostrar el contenedor correspondiente
    const tabContainer = document.getElementById(`${tabName}Tab`);
    if (tabContainer) {
        tabContainer.style.display = 'block';
    }

    // Mostrar/ocultar la sección de búsqueda según el tab
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
        searchSection.style.display = tabName === 'comics' ? 'flex' : 'none';
    }

    // Mostrar/ocultar la paginación según el tab
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.style.display = tabName === 'comics' ? 'flex' : 'none';
    }

    // Manejar la lógica específica de cada tab
    switch(tabName) {
        case 'comics':
            this.loadComics();
            break;
        case 'heroes':
            this.loadHeroes();
            break;
        case 'favorites':
            this.loadFavorites();
            break;
    }
  },

  handlePrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.offset = (this.currentPage - 1) * Config.LIMIT;
      this.loadComics();
    }
  },

  handleNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.offset = (this.currentPage - 1) * Config.LIMIT;
      this.loadComics();
    }
  },

  updatePagination(total) {
    this.totalPages = Math.ceil(total / Config.LIMIT);
    document.getElementById(
      "pageInfo"
    ).textContent = `${this.currentPage} of ${this.totalPages}`;

    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");

    prevBtn.disabled = this.currentPage === 1;
    nextBtn.disabled = this.currentPage === this.totalPages;
  },

  async loadInitialComics() {
    try {
        const response = await DataService.fetchItems("comics", {
            offset: this.offset,
            limit: Config.LIMIT
        });

        this.currentComics = response.results;
        
        // Inicializar la paginación con los datos correctos
        if (this.comicsPagination) {
            this.comicsPagination.update(response.total);
        }
        
        this.renderItems("comics", response.results);
    } catch (error) {
        console.error("Error loading initial comics:", error);
        this.showError("Error al cargar los cómics iniciales");
    }
  },

  async loadRandomComics() {
    try {
      const comics = await MarvelAPI.getComics({
        offset: Math.floor(Math.random() * 1000),
      });
      this.renderComics(comics);
    } catch (error) {
      console.error("Error loading random comics:", error);
      this.showError("Error al cargar cómics aleatorios");
    }
  },

  async loadComics() {
    try {
        const response = await DataService.fetchItems("comics", {
            offset: this.offset,
            titleStartsWith: this.currentSearchTerm,
            limit: this.comicsPagination.itemsPerPage
        });

        this.currentComics = response.results;
        this.comicsPagination.update(response.total);
        this.renderItems("comics", response.results);
    } catch (error) {
        console.error("Error loading comics:", error);
        this.showError("Error al cargar los cómics");
    }
  },

  renderItems(type, items) {
    const container = document.getElementById("comicsContainer");
    container.innerHTML = "";

    if (items.length === 0) {
      container.innerHTML = `<div class="no-results">No se encontraron ${type}.</div>`;
      return;
    }

    items.forEach((item) => {
      const cardElement = Card.createBasicCard(
        item,
        DataService.createCardOptions(
          type,
          item,
          this.selectedComics,
          this.favoritesManager
        )
      );
      container.appendChild(cardElement);
    });
  },

  async loadHeroes() {
    try {
        const response = await DataService.fetchItems("heroes", {
            offset: this.heroesOffset || 0,
            limit: this.heroesPagination?.itemsPerPage || Config.LIMIT
        });

        if (this.heroesPagination) {
            await this.heroesPagination.updateHeroesView(
                response.results,
                response.total,
                response.offset,
                response.limit
            );
        }
    } catch (error) {
        console.error("Error loading heroes:", error);
        this.showError("Error al cargar héroes");
    }
  },

  toggleIndividualFavorite(comicId) {
    this.tempComicId = comicId; // Almacenar temporalmente el ID del cómic
    this.openCollectionModal(true); // Indicar que es un favorito individual
  },

  toggleFavorite(comicId) {
    this.favoritesManager.toggleFavorite(comicId);
    const card = document.querySelector(`.card[data-id="${comicId}"]`);
    if (card.classList.contains("selected")) {
      card.classList.remove("selected");
    } else {
      card.classList.add("selected");
    }
  },

  getSelectedComics() {
    return this.currentComics.filter((comic) =>
      this.selectedComics.has(comic.id)
    );
  },

  updateActionsBar() {
    const actionsBar = document.getElementById("actionsBar");
    const selectedCount = actionsBar.querySelector(".selected-count");

    if (this.selectedComics.size > 0) {
      actionsBar.classList.add("visible");
      selectedCount.textContent = `${this.selectedComics.size} cómics seleccionados`;
    } else {
      actionsBar.classList.remove("visible");
      selectedCount.textContent = "0 cómics seleccionados";
    }
  },

  saveFavorites() {
    if (this.selectedComics.size > 0) {
      this.openCollectionModal();
    }
  },

  toggleSelect(comicId) {
    const card = document.querySelector(`.card[data-id="${comicId}"]`);
    if (this.selectedComics.has(comicId)) {
      this.selectedComics.delete(comicId);
      card.classList.remove("selected");
    } else {
      this.selectedComics.add(comicId);
      card.classList.add("selected");
    }
    this.updateActionsBar();
  },

  showError(message) {
    const container = document.getElementById("comicsContainer");
    container.innerHTML = `
          <div class="error-message">
              ${message}<br>Por favor, intenta de nuevo.
          </div>`;
  },

  toggleDataSource() {
    Config.USE_MOCK_DATA = !Config.USE_MOCK_DATA;
    console.log(`USE_MOCK_DATA is now: ${Config.USE_MOCK_DATA}`);
    this.loadComics();

    const toggleBtn = document.getElementById("toggleDataBtn");
    if (Config.USE_MOCK_DATA) {
      toggleBtn.textContent = "Usando Data Mockeada";
      toggleBtn.classList.add("mock");
    } else {
      toggleBtn.textContent = "Usando Data de la API";
      toggleBtn.classList.remove("mock");
    }
  },

  openCollectionModal(isIndividual = false) {
    this.isIndividualFavorite = isIndividual;
    this.collectionModal.open(); // Abrir el modal
  },

  closeCollectionModal() {
    this.collectionModal.close(); // Cerrar el modal
  },

  handleCollectionSelection(collection) {
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

    if (this.isIndividualFavorite && this.tempComicId !== null) {
      // Agregar favorito individual
      this.favoritesManager.addFavorite(
        dataSource,
        collection,
        this.tempComicId
      );
      this.updateFavoriteButtons(this.tempComicId);
      this.tempComicId = null;
      this.isIndividualFavorite = false;
    } else if (this.isIndividualRemove && this.tempComicId !== null) {
      // Remover favorito individual
      this.favoritesManager.removeFavorite(
        dataSource,
        collection,
        this.tempComicId
      );
      this.updateFavoriteButtons(this.tempComicId);
      this.tempComicId = null;
      this.isIndividualRemove = false;
    } else if (this.selectedComics.size > 0) {
      // Agregar o remover favoritos múltiples
      const selectedComicsList = this.getSelectedComics();
      selectedComicsList.forEach((comic) => {
        if (this.isRemoveAction) {
          this.favoritesManager.removeFavorite(
            dataSource,
            collection,
            comic.id
          );
        } else {
          this.favoritesManager.addFavorite(dataSource, collection, comic.id);
        }
        const card = document.querySelector(`.card[data-id="${comic.id}"]`);
        const checkbox = card.querySelector(".card-checkbox");
        checkbox.checked = false;
        card.classList.remove("selected");
        this.updateFavoriteButtons(comic.id);
      });
      this.selectedComics.clear();
      this.updateActionsBar();
      this.isRemoveAction = false; // Resetear indicador
    }
  },

  removeIndividualFavorite(comicId) {
    this.tempComicId = comicId; // Almacenar temporalmente el ID del cómic
    this.openRemoveCollectionModal(true); // Indicar que es una acción individual
  },

  openRemoveCollectionModal(isIndividual = false) {
    this.isIndividualRemove = isIndividual;
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

    if (isIndividual && this.tempComicId !== null) {
      // Deshabilitar colecciones en las que no está el cómic
      this.collectionButtons.forEach((button) => {
        const collection = button.dataset.collection;
        const isInCollection = this.favoritesManager.isFavorite(
          dataSource,
          collection,
          this.tempComicId
        );
        button.disabled = !isInCollection;
      });
    } else {
      // Habilitar todas las colecciones
      this.collectionButtons.forEach((button) => {
        button.disabled = false;
      });
    }

    // Cambiar el texto del modal para indicar que es una acción de remover
    this.collectionModal.querySelector("h2").textContent =
      "Selecciona una colección para remover";
    this.collectionModal.style.display = "block";
  },

  updateFavoriteButtons(comicId) {
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
    const isFavorite = this.favoritesManager.isFavorite(
      dataSource,
      null,
      comicId
    );

    const card = document.querySelector(`.card[data-id="${comicId}"]`);

    if (card) {
      const favoriteBtn = card.querySelector(".add-favorite-btn");
      const removeFavoriteBtn = card.querySelector(".remove-favorite-btn");

      if (isFavorite) {
        favoriteBtn.classList.add("added");
        favoriteBtn.innerHTML = `<i class="fas fa-heart"></i> Añadido a Favoritos`;
      } else {
        favoriteBtn.classList.remove("added");
        favoriteBtn.innerHTML = `<i class="far fa-heart"></i> Añadir a Favoritos`;
      }
    } else {
      console.warn(`No se encontró la tarjeta con data-id="${comicId}".`);
    }
  },

  removeFavorites() {
    if (this.selectedComics.size > 0) {
      this.isRemoveAction = true;
      this.openRemoveCollectionModal(false); // Acción múltiple
    }
  },

  async loadFavorites() {
    try {
        const container = document.getElementById("favoritesContainer");
        
        // Inicializar CollectionsTabs si no existe
        if (!this.collectionsTabs) {
            this.collectionsTabs = new CollectionsTabs(container, this.favoritesManager);
        }
        
        // El componente CollectionsTabs se encarga de mostrar el contenido
    } catch (error) {
        console.error("Error loading favorites:", error);
        this.showError("Error al cargar las colecciones");
    }
  },

  loadCollectionContent(collection) {
    const container = document.getElementById('favoritesContainer');
    container.innerHTML = '';

    const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';
    const favorites = this.favoritesManager.getAllFavorites(dataSource)[collection] || [];

    if (favorites.length === 0) {
        container.innerHTML = `<div class="no-results">No hay cómics en esta colección</div>`;
        return;
    }

    // Crear una tabla para mostrar los cómics de la colección
    const table = document.createElement('table');
    table.className = 'favorites-table';
    table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Acciones</th>
        </tr>
    `;

    favorites.forEach(async comicId => {
        const comic = await DataService.fetchItemById('comics', comicId);
        if (comic) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${comic.id}</td>
                <td>${comic.title}</td>
                <td>${Utils.truncateText(comic.description, 50)}</td>
                <td>
                    <button class="remove-favorite-btn" onclick="UI.removeIndividualFavorite(${comic.id})">
                        Remover
                    </button>
                </td>
            `;
            table.appendChild(row);
        }
    });

    container.appendChild(table);
  },

  handleSearchByName() {
    const searchTerm = document.getElementById("searchInput").value.trim();
    this.currentSearchTerm = searchTerm;
    this.offset = 0;
    this.currentPage = 1;
    this.loadComics();
  },

  handleSearchById() {
    const searchId = document.getElementById("searchById").value.trim();
    
    if (!searchId) {
        // Si el campo está vacío, mostrar todos los cómics
        this.currentSearchTerm = '';
        this.offset = 0;
        this.currentPage = 1;
        this.loadComics();
        return;
    }

    // Filtrar cómics que contengan el número en su ID
    const filteredComics = this.currentComics.filter(comic => {
        const comicId = comic.id.toString();
        return comicId.includes(searchId);
    });

    // En búsqueda con Enter o botón, si hay una coincidencia exacta, mostrar solo ese cómic
    const exactMatch = this.currentComics.find(comic => comic.id === parseInt(searchId));
    if (exactMatch) {
        this.renderItems("comics", [exactMatch]);
    } else {
        // Si no hay coincidencia exacta, mostrar todas las coincidencias parciales
        this.renderItems("comics", filteredComics);
    }

    if (filteredComics.length === 0) {
        this.showMessage("No se encontraron cómics con ese ID");
    }
  },

  findComicById(comicId, comics = this.currentComics) {
    // Implementación recursiva de búsqueda por ID
    if (comics.length === 0) {
        this.showMessage("No se encontró ningún cómic con ese ID");
        return null;
    }
    
    if (comics[0].id === comicId) {
        this.renderItems("comics", [comics[0]]); // Mostrar solo el cómic encontrado
        return comics[0];
    }
    
    return this.findComicById(comicId, comics.slice(1));
  },

  showMessage(message) {
    const container = document.getElementById("comicsContainer");
    container.innerHTML = `
        <div class="message">
            ${message}
        </div>
    `;
  },
};

document.addEventListener("DOMContentLoaded", () => UI.init());
