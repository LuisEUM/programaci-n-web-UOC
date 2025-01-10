/**
 * Clase que gestiona las colecciones de cómics del usuario.
 * Maneja tanto datos mock como datos de la API, permitiendo al usuario
 * organizar sus cómics en diferentes colecciones predefinidas.
 *
 * @usage Esta clase se utiliza principalmente en:
 * - CollectionModal: Para gestionar las colecciones desde el modal
 * - ComicsCollectionModal: Para mover/clonar cómics entre colecciones
 * - ComicsGrid: Para mostrar estado de colecciones
 * - DataService: Para cargar y gestionar datos de colecciones
 */

class Collections {
  // Campos privados para encapsulación
  #collections;
  #collectionComics;
  #collectionStats;

  /**
   * Colecciones predeterminadas disponibles en la aplicación
   * @static
   */
  static DEFAULT_COLLECTIONS = [
    "wishlist",
    "toread",
    "reading",
    "read",
    "collections",
  ];

  /**
   * Nombres para mostrar de las colecciones
   * @static
   */
  static COLLECTION_NAMES = {
    wishlist: "Lista de Deseos",
    toread: "Por Leer",
    reading: "Leyendo",
    read: "Leídos",
    collections: "Mis Favoritos",
  };

  /**
   * Sufijo usado para copias de colecciones
   * @static
   */
  static COPY_SUFFIX = " copia";

  /**
   * Inicializa el gestor de colecciones.
   * - Carga las colecciones del usuario desde localStorage
   * - Migra colecciones antiguas si existen
   * - Inicializa estadísticas
   */
  constructor() {
    const userName = localStorage.getItem("userName");
    const userCollections = localStorage.getItem(`collections_${userName}`);

    if (userCollections) {
      this.#collections = JSON.parse(userCollections);
    } else {
      const oldCollections = localStorage.getItem("collections");

      if (oldCollections && userName) {
        this.#collections = JSON.parse(oldCollections);
        localStorage.setItem(
          `collections_${userName}`,
          JSON.stringify(this.#collections)
        );
        localStorage.removeItem("collections");
      } else {
        this.#collections = {
          mock: {},
          api: {},
        };

        ["mock", "api"].forEach((dataSource) => {
          Collections.DEFAULT_COLLECTIONS.forEach((collection) => {
            this.#collections[dataSource][collection] = [];
          });
        });
      }
    }

    this.#collectionComics = [];
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

    this.#updateAllCollectionStats();
  }

  /**
   * Valida que la fuente de datos sea válida
   * @private
   * @param {string} dataSource - Fuente de datos a validar ('mock' o 'api')
   * @throws {Error} Si la fuente de datos no es válida
   */
  #validateDataSource(dataSource) {
    if (!["mock", "api"].includes(dataSource)) {
      throw new Error("Invalid data source");
    }
  }

  /**
   * Valida que la colección exista
   * @private
   * @param {string} collection - Nombre de la colección a validar
   * @throws {Error} Si la colección no existe
   */
  #validateCollection(collection) {
    if (!Collections.DEFAULT_COLLECTIONS.includes(collection)) {
      throw new Error("Invalid collection");
    }
  }

  /**
   * Añade un cómic a una colección específica
   * @usage
   * - CollectionModal.js: Para añadir cómics desde el modal
   * - ComicsCollectionModal.js: Para añadir durante movimiento/clonación
   * - collections.js: Para manejar la adición de cómics
   * @param {string} dataSource - Fuente de datos ('mock' o 'api')
   * @param {string} collection - Nombre de la colección
   * @param {number} comicId - ID del cómic
   */
  async addCollection(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    comicId = parseInt(comicId);

    if (!this.#collections[dataSource][collection].includes(comicId)) {
      this.#collections[dataSource][collection].push(comicId);
      await this.#updateCollectionStats(dataSource, collection);
      this.saveCollections();
      this.#notifyCollectionUpdate();
    }
  }

  /**
   * Elimina un cómic de una colección
   * @usage
   * - CollectionModal.js: Para remover cómics desde el modal
   * - ComicsCollectionModal.js: Para remover durante movimiento
   * - collections.js: Para manejar la eliminación de cómics
   * @param {string} dataSource - Fuente de datos ('mock' o 'api')
   * @param {string} collection - Nombre de la colección
   * @param {number} comicId - ID del cómic
   */
  async removeCollection(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);
    this.#validateCollection(collection);

    comicId = parseInt(comicId);

    this.#collections[dataSource][collection] = this.#collections[dataSource][
      collection
    ].filter((id) => parseInt(id) !== comicId);

    await this.#updateCollectionStats(dataSource, collection);
    this.saveCollections();
    this.#notifyCollectionUpdate();
  }

  /**
   * Verifica si un cómic está en una colección
   * @usage
   * - CollectionModal.js: Para verificar estado de cómics
   * - ComicsCollectionModal.js: Para validar operaciones
   * - ComicsGrid.js: Para verificar pertenencia a colecciones
   * @param {string} dataSource - Fuente de datos ('mock' o 'api')
   * @param {string} collection - Nombre de la colección (opcional)
   * @param {number} comicId - ID del cómic
   * @returns {boolean} true si el cómic está en la colección
   */
  isCollection(dataSource, collection, comicId) {
    this.#validateDataSource(dataSource);
    comicId = parseInt(comicId);

    if (!collection) {
      return Object.values(this.#collections[dataSource]).some(
        (collectionIds) => collectionIds.includes(comicId)
      );
    }

    this.#validateCollection(collection);
    return this.#collections[dataSource][collection].includes(comicId);
  }

  /**
   * Obtiene todas las colecciones de una fuente de datos
   * @usage
   * - collections.js: Para obtener cómics de colecciones
   * - DataService.js: Para obtener todas las colecciones
   * @param {string} dataSource - Fuente de datos ('mock' o 'api')
   * @returns {Object} Colecciones de la fuente de datos
   */
  getAllCollections(dataSource) {
    this.#validateDataSource(dataSource);
    return this.#collections[dataSource];
  }

  /**
   * Obtiene el nombre para mostrar de una colección
   * @usage
   * - ComicsCollectionModal.js: Para mostrar nombres en mensajes
   * - DataService.js: Para obtener nombres legibles
   * @param {string} collection - Nombre interno de la colección
   * @returns {string} Nombre para mostrar
   */
  getCollectionDisplayName(collection) {
    return Collections.COLLECTION_NAMES[collection] || collection;
  }

  /**
   * Guarda las colecciones en localStorage
   * @usage
   * - CollectionModal.js: Para persistir cambios
   * - collections.js: Para guardar modificaciones
   * - Usado internamente en addCollection y removeCollection
   */
  saveCollections() {
    const userName = localStorage.getItem("userName");
    if (userName) {
      localStorage.setItem(
        `collections_${userName}`,
        JSON.stringify(this.#collections)
      );
    }
  }

  /**
   * Carga las colecciones desde localStorage
   * @usage
   * - collections.js: Para cargar colecciones específicas
   * - CollectionModal.js: Para recargar después de cambios
   */
  loadCollections() {
    const userName = localStorage.getItem("userName");
    if (userName) {
      const savedCollections = localStorage.getItem(`collections_${userName}`);
      if (savedCollections) {
        this.#collections = JSON.parse(savedCollections);
      }
    }
  }

  // Métodos para la práctica (gestión de colección local)

  /**
   * Añade un cómic a la colección local
   * @todo Implementar uso o considerar eliminación - Solo usado internamente por addMultipleCollections
   * @param {Comic} comic - Instancia de Comic a añadir
   * @throws {Error} Si el parámetro no es una instancia de Comic
   */
  addCollectionComic(comic) {
    if (!(comic instanceof Comic)) {
      throw new Error("Solo se pueden agregar instancias de Comic");
    }
    if (!this.#collectionComics.some((c) => c.id === comic.id)) {
      this.#collectionComics.push(comic);
    }
  }

  /**
   * Elimina un cómic de la colección local
   * @todo Implementar uso o considerar eliminación - Sin uso actual
   * @param {number} comicId - ID del cómic a eliminar
   */
  removeCollectionComic(comicId) {
    this.#collectionComics = this.#collectionComics.filter(
      (comic) => comic.id !== comicId
    );
  }

  /**
   * Muestra los cómics en la colección local
   * @todo Implementar uso o considerar eliminación - Sin uso actual
   * @returns {Array<{title: string, price: number}>} Array de objetos con título y precio
   */
  showCollections() {
    return this.#collectionComics.map((comic) => ({
      title: comic.title,
      price: comic.price,
    }));
  }

  /**
   * Añade múltiples cómics a la colección local
   * @todo Implementar uso o considerar eliminación - Sin uso actual
   * @param {...Comic} comics - Cómics a añadir
   */
  addMultipleCollections(...comics) {
    comics.forEach((comic) => this.addCollectionComic(comic));
  }

  /**
   * Crea una copia de la colección local
   * @todo Implementar uso o considerar eliminación - Sin uso actual
   * @returns {Array<Comic>} Copia de la colección
   */
  copyCollections() {
    return [...this.#collectionComics];
  }

  /**
   * Busca un cómic por ID en la colección local (implementación recursiva)
   * @todo Implementar uso o considerar eliminación - Solo usado recursivamente dentro del método
   * @param {number} comicId - ID del cómic a buscar
   * @param {Array<Comic>} comics - Array de cómics donde buscar
   * @returns {Comic|null} Cómic encontrado o null
   */
  findComicById(comicId, comics = this.#collectionComics) {
    if (comics.length === 0) return null;
    if (comics[0].id === comicId) return comics[0];
    return this.findComicById(comicId, comics.slice(1));
  }

  /**
   * Calcula el precio promedio de la colección local
   * @todo Implementar uso o considerar eliminación - Sin uso actual
   * @returns {number} Precio promedio
   */
  calculateAveragePrice() {
    if (this.#collectionComics.length === 0) return 0;
    const total = this.#collectionComics.reduce(
      (sum, comic) => sum + comic.price,
      0
    );
    return total / this.#collectionComics.length;
  }

  /**
   * Obtiene los títulos de cómics con precio menor o igual al especificado
   * @todo Implementar uso o considerar eliminación - Sin uso actual
   * @param {number} maxPrice - Precio máximo
   * @returns {Array<string>} Títulos de los cómics
   */
  getAffordableComicTitles(maxPrice) {
    return this.#collectionComics
      .filter((comic) => comic.price <= maxPrice)
      .map((comic) => comic.title);
  }

  /**
   * Calcula el precio promedio de una colección específica
   * @todo Implementar uso o considerar eliminación - No se encontraron usos directos
   * @param {string} dataSource - Fuente de datos ('mock' o 'api')
   * @param {string} collection - Nombre de la colección
   * @returns {Promise<number>} Precio promedio
   */
  async calculateCollectionAveragePrice(dataSource, collection) {
    try {
      const comicIds = this.#collections[dataSource][collection];
      if (!comicIds || comicIds.length === 0) return 0;

      let totalPrice = 0;
      let validComics = 0;

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

  /**
   * Obtiene estadísticas de una colección específica
   * @todo Implementar uso o considerar eliminación - No se encontraron usos directos
   * @param {string} dataSource - Fuente de datos ('mock' o 'api')
   * @param {string} collection - Nombre de la colección
   * @returns {Object} Estadísticas de la colección
   */
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

  /**
   * Obtiene todas las estadísticas de una fuente de datos
   * @todo Implementar uso o considerar eliminación - No se encontraron usos directos
   * @param {string} dataSource - Fuente de datos ('mock' o 'api')
   * @returns {Object} Todas las estadísticas
   */
  getAllCollectionStats(dataSource) {
    this.#validateDataSource(dataSource);
    return this.#collectionStats[dataSource];
  }

  /**
   * Actualiza las estadísticas de una colección específica
   * @private
   */
  async #updateCollectionStats(dataSource, collection) {
    if (dataSource === "api" && Config.USE_MOCK_DATA) {
      return;
    }

    const comicIds = this.#collections[dataSource][collection];
    let totalPrice = 0;
    let validComics = 0;

    if (dataSource === "api") {
      for (const comicId of comicIds) {
        const comic = await this.#fetchWithDelay(comicId);
        if (comic && typeof comic.price === "number") {
          totalPrice += comic.price;
          validComics++;
        }
      }
    } else {
      validComics = comicIds.length;
    }

    this.#collectionStats[dataSource][collection] = {
      total: comicIds.length,
      totalPrice: totalPrice,
      averagePrice: validComics > 0 ? totalPrice / validComics : 0,
    };
  }

  /**
   * Actualiza las estadísticas de todas las colecciones
   * @private
   */
  async #updateAllCollectionStats() {
    for (const dataSource of ["mock", "api"]) {
      for (const collection of Collections.DEFAULT_COLLECTIONS) {
        await this.#updateCollectionStats(dataSource, collection);
      }
    }
  }

  /**
   * Obtiene el conteo de cómics en una colección
   * @todo Implementar uso o considerar eliminación - No se encontraron usos directos
   * @param {string} collection - Nombre de la colección
   * @returns {Object} Conteo de cómics por fuente de datos
   */
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

  /**
   * Obtiene el total de cómics únicos en todas las colecciones
   * @usage
   * - Navbar.js: Para mostrar el total de cómics únicos
   * @returns {number} Total de cómics únicos
   */
  getTotalUniqueComics() {
    const userName = localStorage.getItem("userName");
    const collections = localStorage.getItem(`collections_${userName}`);

    if (!collections) {
      return 0;
    }

    const parsedCollections = JSON.parse(collections);
    const source = Config.USE_MOCK_DATA ? "mock" : "api";

    if (!parsedCollections[source]) {
      return 0;
    }

    const uniqueComics = new Set();
    Object.values(parsedCollections[source]).forEach((collectionArray) => {
      if (Array.isArray(collectionArray)) {
        collectionArray.forEach((comicId) => uniqueComics.add(comicId));
      }
    });

    return uniqueComics.size;
  }

  /**
   * Notifica cambios en las colecciones
   * @private
   */
  #notifyCollectionUpdate() {
    window.dispatchEvent(new CustomEvent("collectionsUpdated"));
  }

  /**
   * Realiza una petición con delay para evitar límites de la API
   * @private
   * @param {number} comicId - ID del cómic
   * @param {number} delayMs - Delay en milisegundos
   * @returns {Promise<Comic|null>} Cómic o null si hay error
   */
  async #fetchWithDelay(comicId, delayMs = 1000) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    try {
      const comic = await DataService.fetchItemById("comics", comicId);
      return comic;
    } catch (error) {
      console.error(`Error loading comic ${comicId}:`, error);
      return null;
    }
  }
}
