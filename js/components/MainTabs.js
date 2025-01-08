class MainTabs {
  constructor(container, onTabChange) {
    this.container = container;
    this.onTabChange = onTabChange;
    this.tabs = [
      { id: "comics", label: "Comics" },
      { id: "heroes", label: "Heroes" },
      { id: "collections", label: "Collections" },
    ];
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
            <div class="tabs">
                ${this.tabs
                  .map(
                    (tab, index) => `
                    <button class="tab-btn ${index === 0 ? "active" : ""}" 
                            data-tab="${tab.id}">
                        ${tab.label}
                    </button>
                `
                  )
                  .join("")}
            </div>
        `;
  }

  bindEvents() {
    this.container.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Remover clase active de todos los tabs
        this.container
          .querySelectorAll(".tab-btn")
          .forEach((tab) => tab.classList.remove("active"));

        // Añadir clase active al tab seleccionado
        e.target.classList.add("active");

        // Llamar al callback con el tab seleccionado
        const selectedTab = e.target.dataset.tab;
        this.onTabChange(selectedTab);
      });
    });
  }

  setActiveTab(tabId) {
    this.container.querySelectorAll(".tab-btn").forEach((tab) => {
      if (tab.dataset.tab === tabId) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
  }
}
