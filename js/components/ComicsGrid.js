class ComicsGrid {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.allComics = [];
    this.filteredComics = [];
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.totalPages = 1;
    this.currentFilters = {};
  }

  async loadComics() {
    try {
      this.container.innerHTML =
        '<div class="loading">Cargando cómics...</div>';

      let comicsData;
      const offset = (this.currentPage - 1) * this.itemsPerPage;

      if (Config.USE_MOCK_DATA) {
        // Cargar cómics desde comics.json solo si no están cargados
        if (this.allComics.length === 0) {
          const response = await fetch("js/data/comics.json");
          if (!response.ok) {
            throw new Error("Error fetching comics from comics.json");
          }
          const data = await response.json();
          this.allComics = data.comics.map((comic) => Comic.fromAPI(comic));
        }

        // Aplicar filtros localmente en modo mock
        let comicsToShow = this.allComics;
        if (Object.keys(this.currentFilters).length > 0) {
          comicsToShow = this.applyLocalFilters(this.allComics);
        }

        // Aplicar paginación a los datos filtrados
        const startIndex = offset;
        const endIndex = startIndex + this.itemsPerPage;
        comicsData = {
          results: comicsToShow.slice(startIndex, endIndex),
          total: comicsToShow.length,
        };
      } else {
        // Verificar si es búsqueda por ID específico
        if (this.currentFilters.id && !this.currentFilters.name_) {
          // Usar getComicById para búsqueda específica
          const comicData = await MarvelAPI.getComicById(
            this.currentFilters.id.value
          );
          const comic = comicData ? Comic.fromAPI(comicData) : null;
          comicsData = {
            results: comic ? [comic] : [],
            total: comic ? 1 : 0,
          };
        } else {
          // Búsqueda normal con filtros
          const { params, hasLocalFilters } = this.getAPIFilterParams();
          const apiParams = {
            offset: offset,
            limit: hasLocalFilters ? 100 : this.itemsPerPage,
            ...params,
          };

          const response = await MarvelAPI.getComics(apiParams);
          comicsData = response.data;
          comicsData.results = comicsData.results.map((comic) =>
            Comic.fromAPI(comic)
          );

          if (hasLocalFilters) {
            comicsData.results = this.applyLocalFilters(comicsData.results);
            comicsData.total = comicsData.results.length;

            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            comicsData.results = comicsData.results.slice(startIndex, endIndex);
          }
        }
      }

      if (!comicsData.results || comicsData.results.length === 0) {
        this.container.innerHTML =
          '<div class="no-results">No se encontraron cómics</div>';
        this.updatePagination(0);
        return;
      }

      // Limpiar contenedor y mostrar cómics
      this.container.innerHTML = "";
      comicsData.results.forEach((comic) => {
        const card = this.createComicCard(comic);
        this.container.appendChild(card);
        this.updateFavoriteButtons(comic.id);
      });

      // Actualizar paginación
      this.updatePagination(comicsData.total);
    } catch (error) {
      console.error("Error loading comics:", error);
      this.container.innerHTML =
        '<div class="error">Error al cargar los cómics</div>';
      showToast("Error al cargar los cómics", "error");
    }
  }

  applyLocalFilters(comics) {
    let filtered = [...comics];

    // Aplicar filtros de nombre
    const nameFilters = Object.entries(this.currentFilters)
      .filter(([key]) => key.startsWith("name"))
      .map(([_, filter]) => filter.value);

    if (nameFilters.length > 0) {
      filtered = filtered.filter((comic) =>
        nameFilters.some((term) =>
          comic.title.toLowerCase().includes(term.toLowerCase())
        )
      );
    }

    // Filtro por ID
    if (this.currentFilters.id) {
      filtered = filtered.filter(
        (comic) => comic.id === parseInt(this.currentFilters.id.value)
      );
    }

    // Filtro por precio
    if (this.currentFilters.price) {
      filtered = filtered.filter(
        (comic) => comic.price <= parseFloat(this.currentFilters.price.value)
      );
    }

    return filtered;
  }

  getAPIFilterParams() {
    const params = {};

    // Buscar filtros de nombre (pueden ser múltiples con name_)
    const nameFilters = Object.entries(this.currentFilters)
      .filter(([key]) => key.startsWith("name_"))
      .map(([_, filter]) => filter.value);

    if (nameFilters.length > 0) {
      // Usar el primer término de búsqueda para la API
      params.titleStartsWith = nameFilters[0];
    }

    // Solo incluir ID en los parámetros si hay otros filtros activos
    if (this.currentFilters.id && nameFilters.length > 0) {
      params.id = this.currentFilters.id.value;
    }

    // Nota: El filtro de precio se aplicará después ya que la API no soporta filtro por precio
    // Si hay filtro de precio, tendremos que filtrar los resultados después de recibirlos
    const hasLocalFilters = this.currentFilters.price || nameFilters.length > 1;

    return { params, hasLocalFilters };
  }

  updateFilters(filters) {
    this.currentFilters = filters;
    this.currentPage = 1; // Resetear a primera página al aplicar filtros
    this.loadComics();
  }

  createComicCard(comic) {
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
          <button class="add-favorite-btn">
            <i class="far fa-heart"></i> Añadir a Favoritos
          </button>
          <button class="remove-favorite-btn">
            <i class="fas fa-trash"></i> Quitar de Favoritos
          </button>
        </div>
      </div>
    `;

    this.setupCardEvents(card, comic);
    return card;
  }

  setupCardEvents(card, comic) {
    // Evento de checkbox
    const checkbox = card.querySelector(".card-checkbox");
    checkbox.addEventListener("change", () => {
      card.classList.toggle("selected", checkbox.checked);
      document.dispatchEvent(new CustomEvent("updateActionsBar"));
    });

    // Eventos de botones de favoritos
    const addFavoriteBtn = card.querySelector(".add-favorite-btn");
    const removeFavoriteBtn = card.querySelector(".remove-favorite-btn");

    addFavoriteBtn.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("openCollectionModal", {
          detail: { isIndividual: true, comicId: comic.id },
        })
      );
    });

    removeFavoriteBtn.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("openRemoveCollectionModal", {
          detail: { isIndividual: true, comicId: comic.id },
        })
      );
    });
  }

  updateFavoriteButtons(comicId) {
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

  updatePagination(totalItems) {
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
    document.dispatchEvent(
      new CustomEvent("paginationUpdated", {
        detail: {
          currentPage: this.currentPage,
          totalPages: this.totalPages,
          itemsPerPage: this.itemsPerPage,
        },
      })
    );
  }

  setPage(page) {
    this.currentPage = page;
    this.loadComics();
  }

  setItemsPerPage(items) {
    this.itemsPerPage = items;
    this.currentPage = 1;
    this.loadComics();
  }

  applyFilters(filteredComics) {
    this.filteredComics = filteredComics;
    this.currentPage = 1;
    this.loadComics();
  }
}
