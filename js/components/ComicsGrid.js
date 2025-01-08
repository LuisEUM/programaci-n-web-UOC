class ComicsGrid {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.allComics = [];
    this.filteredComics = [];
    this.itemsPerPage = 5;
    this.currentFilters = {};

    // Inicializar página desde URL o default
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = parseInt(urlParams.get("page"));
    this.currentPage = pageParam && pageParam > 0 ? pageParam : 1;
    this.totalPages = 1;
  }

  async loadComics() {
    try {
      Spinner.show(this.container, "Cargando cómics...");
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
        this.updateCollectionButtons(comic.id);
      });

      // Actualizar paginación
      this.updatePagination(comicsData.total);

      // Validar página actual contra total de páginas
      const totalPages = Math.ceil(comicsData.total / this.itemsPerPage);
      if (this.currentPage > totalPages) {
        this.container.innerHTML =
          '<div class="error">La página solicitada no existe</div>';
        showToast("La página solicitada no existe", "error");
        return;
      }

      // Actualizar URL con la página actual
      this.updateUrlWithCurrentState();
    } catch (error) {
      console.error("Error loading comics:", error);
      this.container.innerHTML =
        '<div class="error">Error al cargar los cómics</div>';
      showToast("Error al cargar los cómics", "error");
    }
  }

  updateUrlWithCurrentState() {
    const newUrl = new URL(window.location.href);

    // Actualizar página
    if (this.currentPage > 1) {
      newUrl.searchParams.set("page", this.currentPage);
    } else {
      newUrl.searchParams.delete("page");
    }

    // Mantener filtros existentes
    if (this.currentFilters.id) {
      newUrl.searchParams.set("id", this.currentFilters.id.value);
    }
    if (this.currentFilters.price) {
      newUrl.searchParams.set("price", this.currentFilters.price.value);
    }

    // Manejar múltiples nombres
    newUrl.searchParams.delete("name");
    Object.entries(this.currentFilters)
      .filter(([key]) => key.startsWith("name_"))
      .forEach(([_, filter]) => {
        newUrl.searchParams.append("name", filter.value);
      });

    window.history.pushState({}, "", newUrl);
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
          <button class="add-collection-btn">
            <i class="far fa-heart"></i> Añadir a Colecciones
          </button>
          <button class="remove-collection-btn">
            <i class="fas fa-trash"></i> Quitar de Colecciones
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

    // Eventos de botones de colecciones
    const addCollectionBtn = card.querySelector(".add-collection-btn");
    const removeCollectionBtn = card.querySelector(".remove-collection-btn");

    addCollectionBtn.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("openCollectionModal", {
          detail: { isIndividual: true, comicId: comic.id },
        })
      );
    });

    removeCollectionBtn.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("openRemoveCollectionModal", {
          detail: { isIndividual: true, comicId: comic.id },
        })
      );
    });
  }

  updateCollectionButtons(comicId) {
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
    const card = document.querySelector(`.card[data-id="${comicId}"]`);

    if (card) {
      const collectionBtn = card.querySelector(".add-collection-btn");
      const removeBtn = card.querySelector(".remove-collection-btn");
      const isInAnyCollection = collectionsManager.isCollection(
        dataSource,
        null,
        comicId
      );

      if (collectionBtn && removeBtn) {
        if (isInAnyCollection) {
          collectionBtn.classList.add("added");
          collectionBtn.innerHTML = `<i class="fas fa-heart"></i> Añadido`;
          removeBtn.style.display = "inline-flex";
          removeBtn.classList.add("removing");
        } else {
          collectionBtn.classList.remove("added");
          collectionBtn.innerHTML = `<i class="far fa-heart"></i> Añadir a Colección`;
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
    const newPage = parseInt(page);
    if (newPage > 0) {
      this.currentPage = newPage;
      // Actualizar URL antes de cargar
      this.updateUrlWithCurrentState();
      this.loadComics();
    } else {
      showToast("Número de página inválido", "error");
    }
  }

  setItemsPerPage(items) {
    this.itemsPerPage = items;
    this.currentPage = 1;
    // Actualizar URL antes de cargar
    this.updateUrlWithCurrentState();
    this.loadComics();
  }

  applyFilters(filteredComics) {
    this.filteredComics = filteredComics;
    this.currentPage = 1;
    // Actualizar URL antes de cargar
    this.updateUrlWithCurrentState();
    this.loadComics();
  }
}
