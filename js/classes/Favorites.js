/**
 * Clase Favorites que gestiona una colección de cómics favoritos
 * Implementa las operaciones básicas de gestión de una lista de favoritos
 * @class
 */
class Favorites {
  static DEFAULT_COLLECTIONS = ["wishlist", "toread", "reading", "read", "favorites"];
  static COLLECTION_NAMES = {
    wishlist: "Lista de Deseos",
    toread: "Por Leer",
    reading: "Leyendo",
    read: "Leídos",
    favorites: "Mis Favoritos"
  };
  static COPY_SUFFIX = " copia";

  constructor() {
    this._favorites = this.loadFavorites();
    this.initializeDefaultCollections();
  }

  initializeDefaultCollections() {
    ['mock', 'api'].forEach(dataSource => {
      if (!this._favorites[dataSource]) {
        this._favorites[dataSource] = {};
      }
      Favorites.DEFAULT_COLLECTIONS.forEach(collection => {
        if (!this._favorites[dataSource][collection]) {
          this._favorites[dataSource][collection] = [];
        }
      });
    });
    this.saveFavorites();
  }

  // Getters y Setters
  get favorites() {
    return this._favorites;
  }

  set favorites(value) {
    this._favorites = value;
    this.saveFavorites();
  }

  static get defaultStructure() {
    return {
      mock: Favorites.DEFAULT_COLLECTIONS.reduce(
        (acc, col) => ({ ...acc, [col]: [] }),
        {}
      ),
      api: Favorites.DEFAULT_COLLECTIONS.reduce(
        (acc, col) => ({ ...acc, [col]: [] }),
        {}
      ),
    };
  }

  // Métodos privados
  #validateDataSource(dataSource) {
    if (!["mock", "api"].includes(dataSource)) {
      throw new Error('Invalid data source. Must be "mock" or "api"');
    }
  }

  #validateCollection(collection) {
    if (typeof collection !== "string" || collection.trim() === "") {
      throw new Error("Invalid collection name");
    }
    // Validar que la colección sea una de las permitidas
    if (!Favorites.DEFAULT_COLLECTIONS.includes(collection)) {
      throw new Error(`Invalid collection. Must be one of: ${Favorites.DEFAULT_COLLECTIONS.join(', ')}`);
    }
  }

  // Métodos de carga y guardado
  loadFavorites() {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        // Verificar que la estructura sea correcta
        if (!parsed.mock || !parsed.api) {
          return Favorites.defaultStructure;
        }
        return parsed;
      } catch (e) {
        console.error("Error parsing favorites:", e);
        return Favorites.defaultStructure;
      }
    }
    return Favorites.defaultStructure;
  }

  saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(this._favorites));
  }

  // Métodos de gestión de colecciones
  createCollection(dataSource, collectionName) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collectionName);

    if (!this._favorites[dataSource][collectionName]) {
      this._favorites[dataSource][collectionName] = [];
      this.saveFavorites();
    }
  }

  renameCollection(dataSource, oldName, newName) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(newName);

    if (this._favorites[dataSource][oldName]) {
      this._favorites[dataSource][newName] = [
        ...this._favorites[dataSource][oldName],
      ];
      delete this._favorites[dataSource][oldName];
      this.saveFavorites();
    }
  }

  // Método mejorado de copia de colecciones
  copyFavorites(dataSource, collectionName, newCollectionName = null) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collectionName);

    if (!this._favorites[dataSource][collectionName]) {
      throw new Error(`Collection ${collectionName} does not exist`);
    }

    // Si no se proporciona un nuevo nombre, genera uno automáticamente
    const targetName =
      newCollectionName || `${collectionName}${Favorites.COPY_SUFFIX}`;

    // Si el nombre de destino ya existe, añade un número
    let finalName = targetName;
    let counter = 1;
    while (this._favorites[dataSource][finalName]) {
      finalName = `${targetName} (${counter})`;
      counter++;
    }

    // Crea la nueva colección
    this._favorites[dataSource][finalName] = [
      ...this._favorites[dataSource][collectionName],
    ];
    this.saveFavorites();

    return finalName; // Retorna el nombre final de la colección creada
  }

  // Métodos de gestión de favoritos
  addFavorite(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    if (!this._favorites[dataSource][collection]) {
      this.createCollection(dataSource, collection);
    }

    if (!this._favorites[dataSource][collection].includes(comicId)) {
      this._favorites[dataSource][collection].push(comicId);
      this.saveFavorites();
    }
  }

  removeFavorite(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    if (this._favorites[dataSource]?.[collection]) {
      this._favorites[dataSource][collection] = this._favorites[dataSource][
        collection
      ].filter((id) => id !== comicId);
      this.saveFavorites();
    }
  }

  // Otros métodos existentes con mejoras
  getAllFavorites(dataSource) {
    this.#validateDataSource(dataSource);
    return this._favorites[dataSource] || {};
  }

  isFavorite(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);

    if (!collection) {
      return Object.values(this._favorites[dataSource] || {}).some(
        (collectionIds) => collectionIds.includes(comicId)
      );
    }

    this.#validateCollection(collection);
    return (
      this._favorites[dataSource]?.[collection]?.includes(comicId) || false
    );
  }

  // Métodos adicionales requeridos por la práctica
  addMultipleFavorites(dataSource, collection, ...comicIds) {
    comicIds.forEach((id) => this.addFavorite(dataSource, collection, id));
  }

  findComicById(comicId, comics = this.getAllFavorites("mock").general) {
    if (comics.length === 0) return null;
    if (comics[0] === comicId) return comics[0];
    return this.findComicById(comicId, comics.slice(1));
  }

  calculateAveragePrice(comics) {
    if (!comics || comics.length === 0) return 0;
    const total = comics.reduce((sum, comic) => sum + comic.price, 0);
    return total / comics.length;
  }

  getAffordableComicTitles(comics, maxPrice) {
    return comics
      .filter((comic) => comic.price <= maxPrice)
      .map((comic) => comic.title);
  }

  getCollectionDisplayName(collection) {
    return Favorites.COLLECTION_NAMES[collection] || collection;
  }
}
