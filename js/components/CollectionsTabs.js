class CollectionsTabs {
  constructor(container, favoritesManager) {
    this.container = container;
    this.favoritesManager = favoritesManager;
    this.collections = Favorites.DEFAULT_COLLECTIONS;
    this.activeCollection = this.collections[0];
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.showCollection(this.activeCollection);
  }

  render() {
    // Crear los tabs
    const tabsContainer = document.createElement("div");
    tabsContainer.className = "collections-tabs";

    this.collections.forEach((collection) => {
      const tab = document.createElement("button");
      tab.className = `tab-btn ${
        collection === this.activeCollection ? "active" : ""
      }`;
      tab.dataset.collection = collection;
      tab.textContent =
        this.favoritesManager.getCollectionDisplayName(collection);
      tabsContainer.appendChild(tab);
    });


    const contentContainer = document.createElement("div");
    contentContainer.className = "collections-content";
    contentContainer.id = "collectionsContent";

    // Limpiar y agregar los nuevos elementos
    this.container.innerHTML = "";
    this.container.appendChild(tabsContainer);
    this.container.appendChild(contentContainer);
  }

  bindEvents() {
    const tabs = this.container.querySelectorAll(".tab-btn");
    tabs.forEach((tab) => {
      tab.addEventListener("click", async (e) => {
        // Actualizar clases activas
        tabs.forEach((t) => t.classList.remove("active"));
        e.target.classList.add("active");

        // Mostrar la colección seleccionada
        const collection = e.target.dataset.collection;
        await this.showCollection(collection);
      });
    });
  }

  async showCollection(collection) {
    const contentContainer = document.getElementById("collectionsContent");
    contentContainer.innerHTML = "";

    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
    const favorites =
      this.favoritesManager.getAllFavorites(dataSource)[collection] || [];
    const stats = this.favoritesManager.getCollectionStats(
      dataSource,
      collection
    );

    // Mostrar estadísticas solo una vez
    const statsContainer = document.createElement("div");
    statsContainer.className = "collection-stats";
    statsContainer.innerHTML = `
            <div class="collection-stat hidden">
                <span>
                    <i class="fas fa-book stat-icon"></i>
                    Total: <span class="stat-value">${stats.total}</span>
                </span>
                <span>
                    <i class="fas fa-dollar-sign stat-icon"></i>
                    Promedio: <span class="stat-value">$${stats.averagePrice.toFixed(
                      2
                    )}</span>
                </span>
            </div>
        `;
    contentContainer.appendChild(statsContainer);

    if (favorites.length === 0) {
      contentContainer.innerHTML += `
                <div class="no-results">
                    No hay cómics en la colección "${this.favoritesManager.getCollectionDisplayName(
                      collection
                    )}"
                </div>
            `;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "comics-grid";

    // Cargar y mostrar cada cómic
    for (const comicId of favorites) {
      try {
        const comic = await DataService.fetchItemById("comics", comicId);
        if (comic) {
          const cardElement = Card.createBasicCard(comic, {
            showId: true,
            showMetadata: true,
            actions: [
              {
                className: "remove-favorite-btn",
                icon: "fas fa-trash-alt",
                text: "Remover de Colección",
                onClick: async () => {
                  this.favoritesManager.removeFavorite(
                    dataSource,
                    collection,
                    comicId
                  );
                  await this.showCollection(collection); // Recargar la colección
                },
              },
            ],
          });
          grid.appendChild(cardElement);
        }
      } catch (error) {
        console.error(`Error loading comic ${comicId}:`, error);
      }
    }

    contentContainer.appendChild(grid);
  }
}
