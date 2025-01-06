class FilterBadges {
  constructor(container, onRemoveFilter) {
    this.container = container;
    this.onRemoveFilter = onRemoveFilter;
    this.activeFilters = new Map();
    this.init();
  }

  init() {
    this.container.className = "filter-badges";
    this.render();
  }

  addFilter(type, value, displayText) {
    this.activeFilters.set(type, { value, displayText });
    this.render();
  }

  removeFilter(type) {
    if (this.activeFilters.has(type)) {
      this.activeFilters.delete(type);
      this.render();
      if (this.onRemoveFilter) {
        this.onRemoveFilter(type);
      }
    }
  }

  clearAll() {
    if (this.activeFilters.size > 0) {
      this.activeFilters.clear();
      this.render();
      if (this.onRemoveFilter) {
        this.onRemoveFilter("all");
      }
    }
  }

  render() {
    this.container.innerHTML = "";

    if (this.activeFilters.size === 0) {
      this.container.style.display = "none";
      return;
    }

    this.container.style.display = "flex";

    this.activeFilters.forEach((filter, type) => {
      const badge = document.createElement("div");
      badge.className = "filter-badge";
      badge.innerHTML = `
        <span class="filter-text">${filter.displayText}</span>
        <button class="remove-filter" aria-label="Remover filtro">
          <i class="fas fa-times"></i>
        </button>
      `;

      badge.querySelector(".remove-filter").addEventListener("click", (e) => {
        e.stopPropagation();
        this.removeFilter(type);
      });

      this.container.appendChild(badge);
    });

    if (this.activeFilters.size > 1) {
      const clearAllBtn = document.createElement("button");
      clearAllBtn.className = "clear-all-filters";
      clearAllBtn.innerHTML = `
        <i class="fas fa-times-circle"></i>
        Limpiar filtros
      `;
      clearAllBtn.addEventListener("click", () => {
        this.clearAll();
      });
      this.container.appendChild(clearAllBtn);
    }
  }

  getActiveFilters() {
    return Object.fromEntries(this.activeFilters);
  }

  hasActiveFilters() {
    return this.activeFilters.size > 0;
  }
}
