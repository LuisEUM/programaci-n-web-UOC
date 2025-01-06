/**
 * Clase Favorites que gestiona una colección de cómics favoritos
 * Implementa las operaciones básicas de gestión de una lista de favoritos
 * @class
 */
class Favorites {
  // Campos privados
  #favorites;
  #favoriteComics;
  #collectionStats;

  // Propiedades estáticas
  static DEFAULT_COLLECTIONS = [
    "wishlist",
    "toread",
    "reading",
    "read",
    "favorites",
  ];
  static COLLECTION_NAMES = {
    wishlist: "Lista de Deseos",
    toread: "Por Leer",
    reading: "Leyendo",
    read: "Leídos",
    favorites: "Mis Favoritos",
  };
  static COPY_SUFFIX = " copia";

  constructor() {
    // Intentar cargar datos existentes primero
    const savedFavorites = localStorage.getItem("favorites");

    if (savedFavorites) {
      // Si hay datos guardados, usarlos
      this.#favorites = JSON.parse(savedFavorites);
      this.#favoriteComics = [];

      // Inicializar estadísticas para los datos existentes
      this.#collectionStats = {
        mock: {},
        api: {},
      };

      ["mock", "api"].forEach((dataSource) => {
        Favorites.DEFAULT_COLLECTIONS.forEach((collection) => {
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
      this.#favoriteComics = [];
      this.#favorites = {
        mock: {},
        api: {},
      };

      this.#collectionStats = {
        mock: {},
        api: {},
      };

      ["mock", "api"].forEach((dataSource) => {
        Favorites.DEFAULT_COLLECTIONS.forEach((collection) => {
          this.#favorites[dataSource][collection] = [];
          this.#collectionStats[dataSource][collection] = {
            total: 0,
            totalPrice: 0,
            averagePrice: 0,
          };
        });
      });

      // Guardar el estado inicial
      this.saveFavorites();
    }
  }

  #validateDataSource(dataSource) {
    if (!["mock", "api"].includes(dataSource)) {
      throw new Error("Invalid data source");
    }
  }

  #validateCollection(collection) {
    if (!Favorites.DEFAULT_COLLECTIONS.includes(collection)) {
      throw new Error("Invalid collection");
    }
  }

  // Métodos públicos
  async addFavorite(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    if (!this.#favorites[dataSource][collection].includes(comicId)) {
      this.#favorites[dataSource][collection].push(comicId);
      await this.#updateCollectionStats(dataSource, collection);
      this.saveFavorites();
    }
  }

  async removeFavorite(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    this.#favorites[dataSource][collection] = this.#favorites[dataSource][
      collection
    ].filter((id) => id !== comicId);
    await this.#updateCollectionStats(dataSource, collection);
    this.saveFavorites();
  }

  isFavorite(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);

    if (!collection) {
      return Object.values(this.#favorites[dataSource]).some((collectionIds) =>
        collectionIds.includes(comicId)
      );
    }

    this.#validateCollection(collection);
    return this.#favorites[dataSource][collection].includes(comicId);
  }

  getAllFavorites(dataSource) {
    this.#validateDataSource(dataSource);
    return this.#favorites[dataSource];
  }

  getCollectionDisplayName(collection) {
    return Favorites.COLLECTION_NAMES[collection] || collection;
  }

  saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(this.#favorites));
  }

  loadFavorites() {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      this.#favorites = JSON.parse(savedFavorites);
    }
  }

  // Métodos requeridos por la práctica
  addFavoriteComic(comic) {
    if (!(comic instanceof Comic)) {
      throw new Error("Solo se pueden agregar instancias de Comic");
    }
    if (!this.#favoriteComics.some((c) => c.id === comic.id)) {
      this.#favoriteComics.push(comic);
    }
  }

  removeFavoriteComic(comicId) {
    this.#favoriteComics = this.#favoriteComics.filter(
      (comic) => comic.id !== comicId
    );
  }

  showFavorites() {
    return this.#favoriteComics.map((comic) => ({
      title: comic.title,
      price: comic.price,
    }));
  }

  addMultipleFavorites(...comics) {
    comics.forEach((comic) => this.addFavoriteComic(comic));
  }

  copyFavorites() {
    return [...this.#favoriteComics];
  }

  findComicById(comicId, comics = this.#favoriteComics) {
    if (comics.length === 0) return null;
    if (comics[0].id === comicId) return comics[0];
    return this.findComicById(comicId, comics.slice(1));
  }

  calculateAveragePrice() {
    if (this.#favoriteComics.length === 0) return 0;
    const total = this.#favoriteComics.reduce(
      (sum, comic) => sum + comic.price,
      0
    );
    return total / this.#favoriteComics.length;
  }

  getAffordableComicTitles(maxPrice) {
    return this.#favoriteComics
      .filter((comic) => comic.price <= maxPrice)
      .map((comic) => comic.title);
  }

  async calculateCollectionAveragePrice(dataSource, collection) {
    try {
      const comicIds = this.#favorites[dataSource][collection];
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
    return this.#collectionStats[dataSource][collection];
  }

  // Método para obtener todas las estadísticas
  getAllCollectionStats(dataSource) {
    this.#validateDataSource(dataSource);
    return this.#collectionStats[dataSource];
  }

  // Método para actualizar las estadísticas de una colección específica
  async #updateCollectionStats(dataSource, collection) {
    const comicIds = this.#favorites[dataSource][collection];
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
      for (const collection of Favorites.DEFAULT_COLLECTIONS) {
        await this.#updateCollectionStats(dataSource, collection);
      }
    }
  }
}
