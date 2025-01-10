class CollectionStats {
  constructor(container) {
    this.container = container;
    this.collectionsManager = window.collectionsManager;
    this.render();
  }

  calculateStats(collection) {
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
    const comics = this.collectionsManager.getCollection(dataSource, collection);
    const total = comics.length;
    
    // Obtener precios de la caché
    let totalPrice = 0;
    comics.forEach(comicId => {
      const comic = DataService.getCachedItem('comics', comicId);
      if (comic && comic.price) {
        totalPrice += comic.price;
      }
    });

    const averagePrice = total > 0 ? totalPrice / total : 0;

    return {
      total,
      totalPrice,
      averagePrice
    };
  }

  render() {
    const collections = [
      'wishlist',
      'toread',
      'reading',
      'read',
      'collections'
    ];

    this.container.innerHTML = `
      <div class="collection-stats">
        ${collections.map(collection => {
          const stats = this.calculateStats(collection);
          return `
            <div class="stat-card">
              <h3>${Collections.COLLECTION_NAMES[collection]} (${stats.total})</h3>
              <div class="stat-details">
                <div class="stat-item">
                  <i class="fas fa-book"></i>
                  <span>Total: ${stats.total} cómics</span>
                </div>
                <div class="stat-item">
                  <i class="fas fa-dollar-sign"></i>
                  <span>Total: $${stats.totalPrice.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                  <i class="fas fa-calculator"></i>
                  <span>Promedio: $${stats.averagePrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  update() {
    this.render();
  }
} 