/**
 * Clase Collections que gestiona una colección de cómics
 * Implementa las operaciones básicas de gestión de una lista de colecciones
 * @class
 */
class Collections {
  // Campos privados
  #collections;
  #collectionComics;
  #collectionStats;

  // Propiedades estáticas
  static DEFAULT_COLLECTIONS = [
    "wishlist",
    "toread",
    "reading",
    "read",
    "collections",
  ];
  static COLLECTION_NAMES = {
    wishlist: "Lista de Deseos",
    toread: "Por Leer",
    reading: "Leyendo",
    read: "Leídos",
    collections: "Mis Favoritos",
  };
  static COPY_SUFFIX = " copia";

  constructor() {
    // Intentar cargar datos existentes primero
    const savedCollections = localStorage.getItem("collections");

    if (savedCollections) {
      // Si hay datos guardados, usarlos
      this.#collections = JSON.parse(savedCollections);
      this.#collectionComics = [];

      // Inicializar estadísticas para los datos existentes
      this.#collectionStats = {
        mock: {},
        api: {},
      };

      ["mock", "api"].forEach((dataSource) => {
        Collections.DEFAULT_COLLECTIONS.forEach((collection) => {
          this.#collectionStats[dataSource][collection] = {
            total: 0,
            totalPrice: 0,
            averagePrice: 0,
          };
        });
      });

      // Actualizar estadísticas con los datos cargados
      this.#updateAllCollectionStats();
    } else {
      // Si no hay datos guardados, inicializar desde cero
      this.#collectionComics = [];
      this.#collections = {
        mock: {},
        api: {},
      };

      this.#collectionStats = {
        mock: {},
        api: {},
      };

      ["mock", "api"].forEach((dataSource) => {
        Collections.DEFAULT_COLLECTIONS.forEach((collection) => {
          this.#collections[dataSource][collection] = [];
          this.#collectionStats[dataSource][collection] = {
            total: 0,
            totalPrice: 0,
            averagePrice: 0,
          };
        });
      });

      // Guardar el estado inicial
      this.saveCollections();
    }
  }

  #validateDataSource(dataSource) {
    if (!["mock", "api"].includes(dataSource)) {
      throw new Error("Invalid data source");
    }
  }

  #validateCollection(collection) {
    if (!Collections.DEFAULT_COLLECTIONS.includes(collection)) {
      throw new Error("Invalid collection");
    }
  }

  // Métodos públicos
  async addCollection(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    // Asegurarse de que comicId sea un número
    comicId = parseInt(comicId);

    // Verificar que el cómic no esté ya en la colección
    if (!this.#collections[dataSource][collection].includes(comicId)) {
      this.#collections[dataSource][collection].push(comicId);
      await this.#updateCollectionStats(dataSource, collection);
      this.saveCollections();
      this.#notifyCollectionUpdate();
    }
  }

  async removeCollection(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    // Asegurarse de que comicId sea un número
    comicId = parseInt(comicId);

    // Filtrar el ID del cómic de la colección
    this.#collections[dataSource][collection] = this.#collections[dataSource][
      collection
    ].filter((id) => parseInt(id) !== comicId);

    await this.#updateCollectionStats(dataSource, collection);
    this.saveCollections();
    this.#notifyCollectionUpdate();
  }

  isCollection(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);

    // Asegurarse de que comicId sea un número
    comicId = parseInt(comicId);

    if (!collection) {
      return Object.values(this.#collections[dataSource]).some(
        (collectionIds) => collectionIds.includes(comicId)
      );
    }

    this.#validateCollection(collection);
    return this.#collections[dataSource][collection].includes(comicId);
  }

  getAllCollections(dataSource) {
    this.#validateDataSource(dataSource);
    return this.#collections[dataSource];
  }

  getCollectionDisplayName(collection) {
    return Collections.COLLECTION_NAMES[collection] || collection;
  }

  saveCollections() {
    localStorage.setItem("collections", JSON.stringify(this.#collections));
  }

  loadCollections() {
    const savedCollections = localStorage.getItem("collections");
    if (savedCollections) {
      this.#collections = JSON.parse(savedCollections);
    }
  }

  // Métodos requeridos por la práctica
  addCollectionComic(comic) {
    if (!(comic instanceof Comic)) {
      throw new Error("Solo se pueden agregar instancias de Comic");
    }
    if (!this.#collectionComics.some((c) => c.id === comic.id)) {
      this.#collectionComics.push(comic);
    }
  }

  removeCollectionComic(comicId) {
    this.#collectionComics = this.#collectionComics.filter(
      (comic) => comic.id !== comicId
    );
  }

  showCollections() {
    return this.#collectionComics.map((comic) => ({
      title: comic.title,
      price: comic.price,
    }));
  }

  addMultipleCollections(...comics) {
    comics.forEach((comic) => this.addCollectionComic(comic));
  }

  copyCollections() {
    return [...this.#collectionComics];
  }

  findComicById(comicId, comics = this.#collectionComics) {
    if (comics.length === 0) return null;
    if (comics[0].id === comicId) return comics[0];
    return this.findComicById(comicId, comics.slice(1));
  }

  calculateAveragePrice() {
    if (this.#collectionComics.length === 0) return 0;
    const total = this.#collectionComics.reduce(
      (sum, comic) => sum + comic.price,
      0
    );
    return total / this.#collectionComics.length;
  }

  getAffordableComicTitles(maxPrice) {
    return this.#collectionComics
      .filter((comic) => comic.price <= maxPrice)
      .map((comic) => comic.title);
  }

  async calculateCollectionAveragePrice(dataSource, collection) {
    try {
      const comicIds = this.#collections[dataSource][collection];
      if (!comicIds || comicIds.length === 0) return 0;

      let totalPrice = 0;
      let validComics = 0;

      // Obtener los objetos Comic completos
      for (const comicId of comicIds) {
        const comic = await DataService.fetchItemById("comics", comicId);
        if (comic && typeof comic.price === "number") {
          totalPrice += comic.price;
          validComics++;
        }
      }

      return validComics > 0 ? totalPrice / validComics : 0;
    } catch (error) {
      console.error("Error calculating average price:", error);
      return 0;
    }
  }

  // Método para obtener estadísticas de una colección
  getCollectionStats(dataSource, collection) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    if (!this.#collectionStats[dataSource][collection]) {
      this.#collectionStats[dataSource][collection] = {
        total: 0,
        totalPrice: 0,
        averagePrice: 0,
      };
    }

    return this.#collectionStats[dataSource][collection];
  }

  // Método para obtener todas las estadísticas
  getAllCollectionStats(dataSource) {
    this.#validateDataSource(dataSource);
    return this.#collectionStats[dataSource];
  }

  // Método para actualizar las estadísticas de una colección específica
  async #updateCollectionStats(dataSource, collection) {
    const comicIds = this.#collections[dataSource][collection];
    let totalPrice = 0;
    let validComics = 0;

    for (const comicId of comicIds) {
      try {
        const comic = await DataService.fetchItemById("comics", comicId);
        if (comic && typeof comic.price === "number") {
          totalPrice += comic.price;
          validComics++;
        }
      } catch (error) {
        console.error(`Error loading comic ${comicId}:`, error);
      }
    }

    this.#collectionStats[dataSource][collection] = {
      total: comicIds.length,
      totalPrice: totalPrice,
      averagePrice: validComics > 0 ? totalPrice / validComics : 0,
    };
  }

  // Actualizar todas las colecciones
  async #updateAllCollectionStats() {
    for (const dataSource of ["mock", "api"]) {
      for (const collection of Collections.DEFAULT_COLLECTIONS) {
        await this.#updateCollectionStats(dataSource, collection);
      }
    }
  }

  getCollectionCount(collection) {
    const collections = JSON.parse(localStorage.getItem("collections")) || {
      mock: { [collection]: [] },
      api: { [collection]: [] },
    };

    const counts = Utils.getCollectionCounts(collections);
    return {
      mock: counts.mock[collection] || 0,
      api: counts.api[collection] || 0,
      total: (counts.mock[collection] || 0) + (counts.api[collection] || 0),
    };
  }

  getTotalUniqueComics() {
    const collections = JSON.parse(localStorage.getItem("collections")) || {
      mock: {},
      api: {}
    };
    
    // Usar solo la fuente actual
    const source = localStorage.getItem('dataSourcePreference') || 'mock';
    const currentCollections = {
      [source]: collections[source] || {}
    };
    
    return Utils.getUniqueComicsCount(currentCollections);
  }

  #notifyCollectionUpdate() {
    window.dispatchEvent(new CustomEvent("collectionsUpdated"));
  }
}
