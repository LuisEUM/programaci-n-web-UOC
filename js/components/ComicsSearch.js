class ComicsSearch {
  constructor(filterBadgesContainer) {
    this.filterBadges = new FilterBadges(
      filterBadgesContainer,
      this.handleRemoveFilter.bind(this)
    );
    this.setupEventListeners();
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
