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
    this._favorites = {
      mock: {},
      api: {}
    };
    this.initializeDefaultCollections();
    this.loadFavorites();
  }

  initializeDefaultCollections() {
    ['mock', 'api'].forEach(dataSource => {
      Favorites.DEFAULT_COLLECTIONS.forEach(collection => {
        if (!this._favorites[dataSource][collection]) {
          this._favorites[dataSource][collection] = [];
        }
      });
    });
  }

  // Método para convertir un cómic a su forma serializable
  #serializeComic(comic) {
    return {
      id: comic.id,
      title: comic.title,
      issueNumber: comic.issueNumber,
      description: comic.description,
      pageCount: comic.pageCount,
      thumbnail: comic.thumbnail,
      price: comic.price,
      creators: comic.creators,
      characters: comic.characters
    };
  }

  // Método para deserializar un cómic
  #deserializeComic(data) {
    return new Comic(
      data.id,
      data.title,
      data.issueNumber,
      data.description,
      data.pageCount,
      data.thumbnail,
      data.price,
      data.creators,
      data.characters
    );
  }

  loadFavorites() {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        Object.keys(parsed).forEach(dataSource => {
          Object.keys(parsed[dataSource]).forEach(collection => {
            // Convertir los datos guardados en objetos Comic
            this._favorites[dataSource][collection] = 
              parsed[dataSource][collection].map(comicData => 
                this.#deserializeComic(comicData)
              );
          });
        });
      } catch (e) {
        console.error("Error parsing favorites:", e);
        this.initializeDefaultCollections();
      }
    }
  }

  saveFavorites() {
    // Serializar los objetos Comic antes de guardarlos
    const serialized = {};
    Object.keys(this._favorites).forEach(dataSource => {
      serialized[dataSource] = {};
      Object.keys(this._favorites[dataSource]).forEach(collection => {
        serialized[dataSource][collection] = 
          this._favorites[dataSource][collection].map(comic => 
            this.#serializeComic(comic)
          );
      });
    });
    localStorage.setItem("favorites", JSON.stringify(serialized));
  }

  addFavorite(dataSource, collection, comic) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    // Asegurarse de que comic es una instancia de Comic
    const comicObj = comic instanceof Comic ? comic : this.#deserializeComic(comic);
    
    if (!this.isFavorite(dataSource, collection, comicObj.id)) {
      this._favorites[dataSource][collection].push(comicObj);
      this.saveFavorites();
    }
  }

  removeFavorite(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    this._favorites[dataSource][collection] = 
      this._favorites[dataSource][collection].filter(comic => comic.id !== comicId);
    this.saveFavorites();
  }

  // Método para copiar una colección completa
  copyFavorites(dataSource, sourceCollection, targetName = null) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(sourceCollection);

    const newName = targetName || `${sourceCollection}${Favorites.COPY_SUFFIX}`;
    
    // Crear una copia profunda de los cómics
    this._favorites[dataSource][newName] = 
      this._favorites[dataSource][sourceCollection].map(comic => 
        this.#deserializeComic(this.#serializeComic(comic))
      );
    
    this.saveFavorites();
    return newName;
  }

  // Implementación del método showFavorites requerido
  showFavorites() {
    const result = {};
    Object.keys(this._favorites).forEach(dataSource => {
      result[dataSource] = {};
      Object.keys(this._favorites[dataSource]).forEach(collection => {
        result[dataSource][collection] = 
          this._favorites[dataSource][collection].map(comic => ({
            title: comic.title,
            price: comic.price
          }));
      });
    });
    return result;
  }

  // Métodos de validación y utilidad
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
