class HeroesSearch {
  constructor(gridComponent) {
    this.grid = gridComponent;
    this.filterBadges = new FilterBadges(
      document.getElementById("filterBadgesContainer"),
      this.handleRemoveFilter.bind(this)
    );
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Event listeners para búsqueda por nombre
    document.getElementById("searchByNameBtn").addEventListener("click", () => {
      this.handleSearchByName();
    });
    document
      .getElementById("searchByName")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.handleSearchByName();
      });

    // Event listeners para búsqueda por ID
    document.getElementById("searchByIdBtn").addEventListener("click", () => {
      this.handleSearchById();
    });
    document.getElementById("searchById").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSearchById();
    });
  }

  handleSearchByName() {
    const searchInput = document.getElementById("searchByName");
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
      this.filterBadges.addFilter(`name${index}`, term, `Nombre: ${term}`);
    });

    this.applyFilters();
  }

  handleSearchById() {
    const searchInput = document.getElementById("searchById");
    const heroId = parseInt(searchInput.value);

    if (isNaN(heroId)) {
      this.showToast("Por favor ingresa un ID válido", "error");
      return;
    }

    this.filterBadges.addFilter("id", heroId, `ID: ${heroId}`);
    this.applyFilters();
  }

  handleRemoveFilter(type) {
    if (type === "all") {
      // Limpiar todos los filtros
      document.getElementById("searchByName").value = "";
      document.getElementById("searchById").value = "";
      this.grid.loadHeroes();
    } else if (type.startsWith("name")) {
      // Remover filtro de nombre específico
      const searchInput = document.getElementById("searchByName");
      const currentTerms = searchInput.value
        .split(",")
        .map((term) => term.trim())
        .filter((term) => term.length > 0);

      const termToRemove = this.filterBadges.getActiveFilters()[type].value;
      const updatedTerms = currentTerms.filter(
        (term) => term.toLowerCase() !== termToRemove.toLowerCase()
      );

      searchInput.value = updatedTerms.join(", ");
      this.applyFilters();
    } else if (type === "id") {
      document.getElementById("searchById").value = "";
      this.applyFilters();
    }
  }

  async applyFilters() {
    const activeFilters = this.filterBadges.getActiveFilters();
    let params = {};

    // Aplicar filtros de nombre
    const nameFilters = Object.entries(activeFilters)
      .filter(([key]) => key.startsWith("name"))
      .map(([_, filter]) => filter.value);

    if (nameFilters.length > 0) {
      params.nameStartsWith = nameFilters[0]; // La API solo soporta un término de búsqueda
    }

    // Aplicar filtro de ID
    if (activeFilters.id) {
      params.id = activeFilters.id.value;
    }

    // Recargar héroes con los filtros aplicados
    await this.grid.loadHeroes(params);
  }

  showToast(message, type = "info") {
    // Implementar sistema de notificaciones toast
    console.log(`${type}: ${message}`);
  }
}
