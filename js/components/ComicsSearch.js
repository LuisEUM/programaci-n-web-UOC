class ComicsSearch {
  constructor(filterBadgesContainer) {
    this.filterBadges = new FilterBadges(
      filterBadgesContainer,
      this.handleRemoveFilter.bind(this)
    );
    this.setupEventListeners();
    this.checkUrlParameters();
  }

  async checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters = {};

    // Procesar ID (tiene prioridad)
    const id = urlParams.get("id");
    if (id) {
      initialFilters.id = { value: id, displayText: `ID: ${id}` };
      document.querySelector("#searchById").value = id;
    }
    // Si no hay ID, procesar precio
    else {
      const price = urlParams.get("price");
      if (price) {
        initialFilters.price = {
          value: price,
          displayText: `Precio máximo: $${price}`,
        };
        document.querySelector("#priceFilter").value = price;
      }
    }

    // Procesar nombres (pueden ser múltiples)
    const names = urlParams.getAll("name");
    names.forEach((name) => {
      if (name && name.trim()) {
        const timestamp = Date.now();
        initialFilters[`name_${timestamp}`] = {
          value: name.trim(),
          displayText: `Nombre: ${name.trim()}`,
        };
      }
    });

    // Si hay filtros iniciales, aplicarlos
    if (Object.keys(initialFilters).length > 0) {
      Object.entries(initialFilters).forEach(([type, filter]) => {
        this.filterBadges.addFilter(type, filter.value, filter.displayText);
      });
      this.applyAllFilters();
    }
  }

  setupEventListeners() {
    // Event Listeners para los filtros
    document
      .querySelector("#searchByNameBtn")
      .addEventListener("click", () => this.handleSearchByName());
    document
      .querySelector("#searchByIdBtn")
      .addEventListener("click", () => this.handleSearchById());
    document
      .querySelector("#filterByPriceBtn")
      .addEventListener("click", () => this.handlePriceFilter());
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
      this.filterBadges.removeFilter("name");
      return;
    }

    // Añadir un badge por cada término de búsqueda
    searchTerms.forEach((term, index) => {
      const activeFilters = this.filterBadges.getActiveFilters();
      const isDuplicate = Object.entries(activeFilters).some(
        ([key, filter]) =>
          key.startsWith("name") &&
          filter.value.toLowerCase() === term.toLowerCase()
      );

      if (!isDuplicate) {
        this.filterBadges.addFilter(
          `name_${Date.now()}`,
          term,
          `Nombre: ${term}`
        );
        searchInput.value = "";
      } else {
        showToast("Este filtro ya está aplicado", "info");
      }
    });

    this.applyAllFilters();
  }

  handleSearchById() {
    const searchInput = document.querySelector("#searchById");
    const comicId = parseInt(searchInput.value);

    if (isNaN(comicId)) {
      showToast("Por favor ingresa un ID válido", "error");
      return;
    }

    this.filterBadges.addFilter("id", comicId, `ID: ${comicId}`);
    searchInput.value = "";
    this.applyAllFilters();
  }

  handlePriceFilter() {
    const priceInput = document.querySelector("#priceFilter");
    const maxPrice = parseFloat(priceInput.value);

    if (isNaN(maxPrice)) {
      showToast("Por favor ingresa un precio válido", "error");
      return;
    }

    this.filterBadges.addFilter(
      "price",
      maxPrice,
      `Precio máximo: $${maxPrice}`
    );
    priceInput.value = "";
    this.applyAllFilters();
  }

  handleRemoveFilter(type) {
    if (type === "all") {
      document.querySelector("#searchByName").value = "";
      document.querySelector("#searchById").value = "";
      document.querySelector("#priceFilter").value = "";
      document.dispatchEvent(
        new CustomEvent("filtersUpdated", { detail: { filters: [] } })
      );
    } else {
      this.applyAllFilters();
    }
  }

  applyAllFilters() {
    const activeFilters = this.filterBadges.getActiveFilters();

    // Enviar los filtros actualizados al grid
    window.comicsGrid.updateFilters(activeFilters);

    // Emitir evento con la cantidad de filtros activos
    document.dispatchEvent(
      new CustomEvent("filtersUpdated", {
        detail: {
          filters: activeFilters,
          resultCount: window.comicsGrid.filteredComics.length,
        },
      })
    );
  }
}
