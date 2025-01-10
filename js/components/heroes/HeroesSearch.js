class HeroesSearch {
  constructor(heroesGrid) {
    if (!heroesGrid) {
      throw new Error("HeroesGrid instance is required");
    }
    this.heroesGrid = heroesGrid;
    this.filterBadges = new FilterBadges(
      document.getElementById("filterBadgesContainer"),
      this.handleRemoveFilter.bind(this)
    );
    this.setupEventListeners();
    this.checkUrlParameters();
  }

  setupEventListeners() {
    // Event Listeners para búsqueda por nombre
    document
      .querySelector("#searchByNameBtn")
      .addEventListener("click", () => this.handleSearchByName());

    document
      .querySelector("#searchByName")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleSearchByName();
        }
      });

    // Event Listeners para búsqueda por ID
    document
      .querySelector("#searchByIdBtn")
      .addEventListener("click", () => this.handleSearchById());

    document.querySelector("#searchById").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleSearchById();
      }
    });
  }

  async checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const heroId = urlParams.get("id");

    if (heroId) {
      document.querySelector("#searchById").value = heroId;
      await this.handleSearchById(heroId);
    }
  }

  async handleSearchById(providedId = null) {
    const searchInput = document.querySelector("#searchById");
    const id = providedId || searchInput.value.trim();

    if (!id) {
      // Si no hay ID, eliminar solo los filtros de ID
      const activeFilters = this.filterBadges.getActiveFilters();
      Object.keys(activeFilters)
        .filter((key) => key.startsWith("id_"))
        .forEach((key) => this.filterBadges.removeFilter(key));
      return;
    }

    try {
      const response = await MarvelAPI.getHeroById(id);
      if (response.data?.results?.length > 0) {
        // Eliminar solo los filtros de ID anteriores si existen
        const activeFilters = this.filterBadges.getActiveFilters();
        Object.keys(activeFilters)
          .filter((key) => key.startsWith("id_"))
          .forEach((key) => this.filterBadges.removeFilter(key));

        // Añadir el nuevo filtro de ID
        this.filterBadges.addFilter(`id_${id}`, id, `ID: ${id}`);

        // Actualizar la URL sin recargar la página
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("id", id);
        window.history.pushState({}, "", newUrl);

        this.applyAllFilters();
      } else {
        window.showToast("No se encontró ningún héroe con ese ID", "error");
      }
    } catch (error) {
      console.error("Error buscando héroe por ID:", error);
      window.showToast("Error al buscar héroe por ID", "error");
    }

    // Limpiar el input después de la búsqueda
    if (!providedId) {
      searchInput.value = "";
    }
  }

  handleSearchByName() {
    const searchInput = document.querySelector("#searchByName");
    const searchTerms = searchInput.value
      .trim()
      .toLowerCase()
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    if (searchTerms.length === 0) {
      // Si no hay términos, eliminar solo los filtros de nombre
      const activeFilters = this.filterBadges.getActiveFilters();
      Object.keys(activeFilters)
        .filter((key) => key.startsWith("name_"))
        .forEach((key) => this.filterBadges.removeFilter(key));
      return;
    }

    // Eliminar los filtros de ID si existen
    const activeFilters = this.filterBadges.getActiveFilters();
    Object.keys(activeFilters)
      .filter((key) => key.startsWith("id_"))
      .forEach((key) => this.filterBadges.removeFilter(key));

    // Eliminar los filtros de nombre anteriores
    Object.keys(activeFilters)
      .filter((key) => key.startsWith("name_"))
      .forEach((key) => this.filterBadges.removeFilter(key));

    // Añadir los nuevos filtros de nombre
    searchTerms.forEach((term) => {
      this.filterBadges.addFilter(
        `name_${Date.now()}`,
        term,
        `Nombre: ${term}`
      );
    });

    // Limpiar el input después de procesar todos los términos
    searchInput.value = "";
    this.applyAllFilters();
  }

  handleRemoveFilter(type) {
    if (type === "all") {
      document.querySelector("#searchByName").value = "";
      this.heroesGrid.updateFilters({});
    } else {
      this.applyAllFilters();
    }
  }

  applyAllFilters() {
    const activeFilters = this.filterBadges.getActiveFilters();
    this.heroesGrid.updateFilters(activeFilters);

    // Emitir evento con la cantidad de filtros activos
    document.dispatchEvent(
      new CustomEvent("filtersUpdated", {
        detail: {
          filters: activeFilters,
          resultCount: this.heroesGrid.filteredHeroes.length,
        },
      })
    );
  }
}
