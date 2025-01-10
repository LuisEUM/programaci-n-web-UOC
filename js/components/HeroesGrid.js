class HeroesGrid {
  constructor() {
    this.container = document.getElementById("heroesGrid");
    this.itemsPerPage =
      parseInt(document.getElementById("itemsPerPage").value) || 10;
    this.currentFilters = {};
    this.allHeroes = [];
    this.filteredHeroes = [];
    this.lastSearchId = 0;

    // Inicializar página desde URL o default
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = parseInt(urlParams.get("page"));
    this.currentPage = pageParam && pageParam > 0 ? pageParam : 1;
    this.totalPages = 1;

    this.setupPagination();
    this.initialize();
  }

  async initialize() {
    // Verificar filtros en la URL al cargar
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters = {};

    // Procesar ID de la URL (tiene prioridad)
    const initialId = urlParams.get("id");
    if (initialId) {
      initialFilters[`id_${initialId}`] = {
        value: initialId,
        label: `ID: ${initialId}`,
      };
    }
    // Si no hay ID, procesar nombre
    else {
      const name = urlParams.get("name");
      if (name && name.trim()) {
        initialFilters[`name_${Date.now()}`] = {
          value: name.trim(),
          label: `Nombre: ${name.trim()}`,
        };
      }
    }

    // Si hay filtros iniciales, establecerlos
    if (Object.keys(initialFilters).length > 0) {
      this.currentFilters = initialFilters;
      if (initialId) {
        await this.loadHeroes({ id: initialId });
      } else {
        await this.loadHeroes();
      }
    } else {
      await this.loadHeroes();
    }
  }

  setupPagination() {
    document.getElementById("firstPage").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage = 1;
        this.loadHeroes(this.getLastParams());
      }
    });

    document.getElementById("prevPage").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadHeroes(this.getLastParams());
      }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadHeroes(this.getLastParams());
      }
    });

    document.getElementById("lastPage").addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage = this.totalPages;
        this.loadHeroes(this.getLastParams());
      }
    });

    document.getElementById("pageInput").addEventListener("change", (e) => {
      const newPage = parseInt(e.target.value);
      if (newPage && newPage > 0 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.loadHeroes(this.getLastParams());
      } else {
        e.target.value = this.currentPage;
        window.showToast("Número de página inválido", "error");
      }
    });

    document.getElementById("itemsPerPage").addEventListener("change", (e) => {
      this.itemsPerPage = parseInt(e.target.value);
      this.currentPage = 1;
      this.loadHeroes(this.getLastParams());
    });
  }

  getLastParams() {
    // Si hay un filtro de ID activo, mantenerlo
    const idFilter = Object.entries(this.currentFilters).find(([key]) =>
      key.startsWith("id_")
    );
    if (idFilter) {
      return { id: idFilter[1].value };
    }
    // Si hay otros filtros, mantenerlos
    return this.currentFilters;
  }

  async loadHeroes(params = {}) {
    const searchId = ++this.lastSearchId;

    try {
      Spinner.show(this.container, "Cargando héroes...");
      let heroesData;

      // Si hay un ID específico en los parámetros o en los filtros actuales
      const idFilter =
        params.id ||
        Object.entries(this.currentFilters).find(([key]) =>
          key.startsWith("id_")
        )?.[1]?.value;

      // Verificar si esta búsqueda sigue siendo la más reciente
      if (searchId !== this.lastSearchId) {
        console.log("Búsqueda cancelada por una más reciente");
        return;
      }

      if (idFilter) {
        const response = await MarvelAPI.getHeroById(idFilter);
        // Verificar nuevamente después de la espera asíncrona
        if (searchId !== this.lastSearchId) return;

        if (response.data?.results?.length > 0) {
          heroesData = {
            results: response.data.results,
            total: 1,
          };
          this.filteredHeroes = response.data.results;
          this.currentPage = 1;
          this.itemsPerPage = 1;
        } else {
          this.container.innerHTML =
            '<div class="no-results">No se encontró el héroe</div>';
          this.updatePaginationControls(0);
          return;
        }
      } else {
        const offset = (this.currentPage - 1) * this.itemsPerPage;

        if (Config.USE_MOCK_DATA) {
          // Usar datos directamente del objeto Config
          this.allHeroes = Config.MOCK_DATA.heroes.map(
            (hero) =>
              new Hero(
                hero.id,
                hero.name,
                hero.description,
                hero.modified,
                hero.thumbnail,
                hero.resourceURI,
                hero.comics
              )
          );

          let heroesToShow = this.allHeroes;
          if (Object.keys(this.currentFilters).length > 0) {
            heroesToShow = this.applyLocalFilters(this.allHeroes);
          }

          heroesData = {
            results: heroesToShow.slice(offset, offset + this.itemsPerPage),
            total: heroesToShow.length,
          };
        } else {
          const { params: apiParams, hasLocalFilters } =
            this.getAPIFilterParams();
          const searchParams = {
            offset: offset,
            limit: hasLocalFilters ? 100 : this.itemsPerPage,
            ...apiParams,
          };

          const response = await MarvelAPI.getHeroes(searchParams);
          // Verificar después de cada operación asíncrona
          if (searchId !== this.lastSearchId) return;

          heroesData = response.data;

          if (hasLocalFilters) {
            const allResults = [];
            let currentOffset = 0;
            let totalResults = heroesData.total;

            while (currentOffset < totalResults && currentOffset < 1000) {
              if (currentOffset > 0) {
                const nextResponse = await MarvelAPI.getHeroes({
                  ...searchParams,
                  offset: currentOffset,
                });
                // Verificar después de cada operación asíncrona
                if (searchId !== this.lastSearchId) return;

                allResults.push(...nextResponse.data.results);
              } else {
                allResults.push(...heroesData.results);
              }
              currentOffset += searchParams.limit;
            }

            const filteredResults = this.applyLocalFilters(allResults);
            heroesData = {
              results: filteredResults.slice(
                offset,
                offset + this.itemsPerPage
              ),
              total: filteredResults.length,
            };
          }
        }
      }

      // Verificación final antes de renderizar
      if (searchId !== this.lastSearchId) return;

      if (!heroesData.results || heroesData.results.length === 0) {
        this.container.innerHTML =
          '<div class="no-results">No se encontraron héroes</div>';
        this.updatePaginationControls(0);
        return;
      }

      this.renderHeroes(
        heroesData.results.map(
          (hero) =>
            new Hero(
              hero.id,
              hero.name,
              hero.description,
              hero.modified,
              hero.thumbnail,
              hero.resourceURI,
              hero.comics
            )
        )
      );

      this.totalPages = Math.ceil(heroesData.total / this.itemsPerPage);
      this.updatePaginationControls(heroesData.total);

      // Validar página actual contra total de páginas
      if (heroesData.total > 0) {
        const totalPages = Math.ceil(heroesData.total / this.itemsPerPage);
        if (this.currentPage > totalPages) {
          this.container.innerHTML =
            '<div class="error">La página solicitada no existe</div>';
          showToast("La página solicitada no existe", "error");
          return;
        }
      }

      // Actualizar URL con la página actual y filtros
      this.updateUrlWithCurrentState();
    } catch (error) {
      // Verificar si el error ocurrió en la búsqueda más reciente
      if (searchId === this.lastSearchId) {
        console.error("Error loading heroes:", error);
        this.container.innerHTML =
          '<div class="error">Error al cargar los héroes. Por favor, intenta de nuevo más tarde.</div>';
        window.showToast("Error al cargar los héroes", "error");
      }
    }
  }

  applyLocalFilters(heroes) {
    let filtered = [...heroes];

    // Aplicar filtros de nombre
    const nameFilters = Object.entries(this.currentFilters)
      .filter(([key]) => key.startsWith("name_"))
      .map(([_, filter]) => filter.value);

    if (nameFilters.length > 0) {
      filtered = filtered.filter((hero) =>
        nameFilters.every((term) =>
          hero.name.toLowerCase().includes(term.toLowerCase())
        )
      );
    }

    // Filtro por ID (siempre tiene prioridad)
    if (this.currentFilters.id) {
      filtered = filtered.filter(
        (hero) => hero.id === parseInt(this.currentFilters.id.value)
      );
    }

    this.filteredHeroes = filtered;
    return filtered;
  }

  getAPIFilterParams() {
    const params = {};
    let hasLocalFilters = false;

    // Buscar filtros de ID primero (tienen prioridad)
    const idFilter = Object.entries(this.currentFilters).find(([key]) =>
      key.startsWith("id_")
    );
    if (idFilter) {
      params.id = idFilter[1].value;
      return { params, hasLocalFilters: false };
    }

    // Buscar filtros de nombre
    const nameFilters = Object.entries(this.currentFilters)
      .filter(([key]) => key.startsWith("name_"))
      .map(([_, filter]) => filter.value);

    if (nameFilters.length > 0) {
      params.nameStartsWith = nameFilters[0];
      hasLocalFilters = nameFilters.length > 1;
    }

    return { params, hasLocalFilters };
  }

  updateFilters(filters) {
    const hadIdFilter = Object.keys(this.currentFilters).some((key) =>
      key.startsWith("id_")
    );
    const hasIdFilter = Object.keys(filters).some((key) =>
      key.startsWith("id_")
    );

    this.currentFilters = filters;

    // Actualizar URL con el filtro activo
    const newUrl = new URL(window.location.href);

    // Limpiar parámetros existentes
    newUrl.searchParams.delete("id");
    newUrl.searchParams.delete("name");

    // Añadir nuevo parámetro según el tipo de filtro
    const idFilter = Object.entries(filters).find(([key]) =>
      key.startsWith("id_")
    );

    const nameFilter = Object.entries(filters).find(([key]) =>
      key.startsWith("name_")
    );

    if (idFilter) {
      newUrl.searchParams.set("id", idFilter[1].value);
      this.currentPage = 1;
      this.loadHeroes({ id: idFilter[1].value });
      window.history.pushState({}, "", newUrl);
      return;
    }

    if (nameFilter) {
      newUrl.searchParams.set("name", nameFilter[1].value);
    }

    // Actualizar URL
    window.history.pushState({}, "", newUrl);

    // Si se eliminó el filtro de ID
    if (hadIdFilter && !hasIdFilter) {
      this.itemsPerPage =
        parseInt(document.getElementById("itemsPerPage").value) || 10;
    }

    // Para otros filtros, proceder normalmente
    this.currentPage = 1;
    this.loadHeroes();
  }

  renderHeroes(heroes) {
    this.container.innerHTML = heroes
      .map((hero) => this.createHeroCard(hero))
      .join("");

    this.container.querySelectorAll(".hero-card").forEach((card) => {
      card.addEventListener("click", () =>
        this.showHeroDetails(card.dataset.id)
      );
    });
  }

  createHeroCard(hero) {
    const imageUrl = hero.getThumbnailURL();
    return `
      <div class="hero-card" data-id="${hero.id}">
        <img class="hero-image" src="${imageUrl}" alt="${hero.name}" onerror="this.src='assets/images/image-not-found.jpg'">
        <div class="hero-info">
          <h3 class="hero-name">${hero.name}</h3>
          <p class="hero-id">ID: ${hero.id}</p>
          <button class="view-details-btn">
            <i class="fas fa-info-circle"></i> Ver detalles
          </button>
        </div>
      </div>
    `;
  }

  async waitForElements() {
    const maxAttempts = 10;
    const delayMs = 50;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const modalElements = {
        title: this.modal.querySelector(".modal-title"),
        image: this.modal.querySelector(".hero-modal-image"),
        description: this.modal.querySelector(".hero-description"),
        comicsContainer: this.modal.querySelector(".comics-container"),
      };

      if (
        modalElements.title &&
        modalElements.image &&
        modalElements.description &&
        modalElements.comicsContainer
      ) {
        return modalElements;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error("Modal elements not found after waiting");
  }

  async showHeroDetails(heroId) {
    try {
      if (window.heroModal) {
        await window.heroModal.show(heroId);
        window.showToast("Detalles del héroe cargados con éxito", "success");
      } else {
        throw new Error("HeroModal component not found");
      }
    } catch (error) {
      console.error("Error loading hero details:", error);
      window.showToast("Error al cargar los detalles del héroe", "error");
    }
  }

  updatePaginationControls(total) {
    this.totalPages = Math.ceil(total / this.itemsPerPage);

    // Actualizar elementos de paginación
    document.getElementById("pageInput").value = this.currentPage;
    document.getElementById("totalPages").textContent = this.totalPages;

    // Actualizar estado de los botones
    document.getElementById("firstPage").disabled = this.currentPage === 1;
    document.getElementById("prevPage").disabled = this.currentPage === 1;
    document.getElementById("nextPage").disabled =
      this.currentPage === this.totalPages;
    document.getElementById("lastPage").disabled =
      this.currentPage === this.totalPages;

    // Emitir evento de actualización de paginación
    document.dispatchEvent(
      new CustomEvent("paginationUpdated", {
        detail: {
          currentPage: this.currentPage,
          totalPages: this.totalPages,
          itemsPerPage: this.itemsPerPage,
          total: total,
        },
      })
    );
  }

  showToast(message, type = "info") {
    console.log(`${type}: ${message}`);
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
    const idFilter = Object.entries(this.currentFilters).find(([key]) =>
      key.startsWith("id_")
    );
    if (idFilter) {
      newUrl.searchParams.set("id", idFilter[1].value);
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

  setPage(page) {
    const newPage = parseInt(page);
    if (newPage > 0) {
      this.currentPage = newPage;
      // Actualizar URL antes de cargar
      this.updateUrlWithCurrentState();
      this.loadHeroes(this.getLastParams());
    } else {
      showToast("Número de página inválido", "error");
    }
  }
}
