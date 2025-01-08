/**
 * Clase Thumbnail: Representa una imagen en el sistema Marvel
 */
class Thumbnail {
  // Propiedades privadas
  #path;
  #extension;

  /**
   * Constructor de la clase Thumbnail
   * @param {string} path - Ruta de la imagen
   * @param {string} extension - Extensión del archivo
   */
  constructor(path, extension) {
    if (!path || typeof path !== "string")
      return (this.#path =
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_xlarge.jpg");
    if (!extension || typeof extension !== "string")
      return (this.#path = "jpg");

    this.#path = path;
    this.#extension = extension;
  }

  // Getters y Setters
  get path() {
    return this.#path;
  }
  set path(value) {
    if (!value || typeof value !== "string") throw new Error("Path inválido");
    this.#path = value;
  }

  get extension() {
    return this.#extension;
  }
  set extension(value) {
    if (!value || typeof value !== "string")
      throw new Error("Extension inválida");
    this.#extension = value;
  }

  /**
   * Obtiene la URL completa del thumbnail
   * @returns {string} URL de la imagen
   */
  getURL() {
    return `${this.#path}.${this.#extension}`;
  }

  /**
   * Valida si es una instancia válida de Thumbnail
   * @param {Object} thumbnail - Objeto a validar
   * @returns {boolean} true si es válido
   */
  static isValid(thumbnail) {
    return thumbnail instanceof Thumbnail;
  }

  /**
   * Crea un Thumbnail desde un objeto plano
   * @param {Object} data - Objeto con path y extension
   * @returns {Thumbnail} Nueva instancia de Thumbnail
   */
  static fromObject(data) {
    return new Thumbnail(data.path, data.extension);
  }
}

/**
 * Clase Comic: Representa un cómic de Marvel
 */
class Comic {
  // Propiedades privadas
  #id;
  #title;
  #issueNumber;
  #description;
  #pageCount;
  #thumbnail;
  #price;
  #creators;
  #characters;

  /**
   * Valida si el precio es válido
   * @param {number} price - Precio a validar
   * @returns {boolean} - true si es válido
   */
  static isValidPrice(price) {
    return typeof price === "number" && price >= 0;
  }

  /**
   * @param {number} id - ID único del cómic
   * @param {string} title - Título del cómic
   * @param {number} issueNumber - Número de la edición
   * @param {string} description - Descripción del cómic
   * @param {number} pageCount - Número de páginas
   * @param {Thumbnail|Object} thumbnail - Objeto Thumbnail o datos del thumbnail
   * @param {number} price - Precio del cómic
   * @param {Array} creators - Lista de creadores
   * @param {Array} characters - Lista de personajes
   */
  constructor(
    id,
    title,
    issueNumber,
    description,
    pageCount,
    thumbnail,
    price,
    creators,
    characters
  ) {
    // Validaciones básicas
    if (!id || typeof id !== "number") throw new Error("ID inválido");
    if (!title || typeof title !== "string") throw new Error("Título inválido");
    if (typeof issueNumber !== "number")
      throw new Error("Número de edición inválido");
    if (!description || typeof description !== "string")
      throw new Error("Descripción inválida");
    if (typeof pageCount !== "number" || pageCount < 0)
      throw new Error("Número de páginas inválido");
    if (!Comic.isValidPrice(price)) throw new Error("Precio inválido");
    if (!Array.isArray(creators))
      throw new Error("Creadores debe ser un array");
    if (!Array.isArray(characters))
      throw new Error("Personajes debe ser un array");

    // Asignación de propiedades
    this.#id = id;
    this.#title = title;
    this.#issueNumber = issueNumber;
    this.#description = description;
    this.#pageCount = pageCount;
    this.#thumbnail =
      thumbnail instanceof Thumbnail
        ? thumbnail
        : Thumbnail.fromObject(thumbnail);
    this.#price = price;
    this.#creators = [...creators];
    this.#characters = [...characters];
  }

  // Getters y Setters
  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }
  set title(value) {
    if (!value || typeof value !== "string") throw new Error("Título inválido");
    this.#title = value;
  }

  get issueNumber() {
    return this.#issueNumber;
  }
  set issueNumber(value) {
    if (typeof value !== "number")
      throw new Error("Número de edición inválido");
    this.#issueNumber = value;
  }

  get description() {
    return this.#description;
  }
  set description(value) {
    if (!value || typeof value !== "string")
      throw new Error("Descripción inválida");
    this.#description = value;
  }

  get pageCount() {
    return this.#pageCount;
  }
  set pageCount(value) {
    if (typeof value !== "number" || value < 0)
      throw new Error("Número de páginas inválido");
    this.#pageCount = value;
  }

  get price() {
    return this.#price;
  }
  set price(value) {
    if (!Comic.isValidPrice(value)) throw new Error("Precio inválido");
    this.#price = value;
  }

  get creators() {
    return [...this.#creators];
  }
  set creators(value) {
    if (!Array.isArray(value)) throw new Error("Creadores debe ser un array");
    this.#creators = [...value];
  }

  get characters() {
    return [...this.#characters];
  }
  set characters(value) {
    if (!Array.isArray(value)) throw new Error("Personajes debe ser un array");
    this.#characters = [...value];
  }

  /**
   * Obtiene la URL completa del thumbnail
   * @returns {string} URL de la imagen
   */
  getThumbnailURL() {
    return this.#thumbnail.getURL();
  }
}

/**
 * Clase Hero: Representa un héroe de Marvel
 */
class Hero {
  // Propiedades privadas
  #id;
  #name;
  #description;
  #modified;
  #thumbnail;
  #resourceURI;
  #comics;

  /**
   * Crea una instancia de Hero a partir de datos de la API
   * @param {Object} apiData - Datos de la API de Marvel
   * @returns {Hero} Nueva instancia de Hero
   */
  static createFromAPI(apiData) {
    return new Hero(
      apiData.id,
      apiData.name,
      apiData.description,
      apiData.modified,
      apiData.thumbnail,
      apiData.resourceURI,
      apiData.comics
    );
  }

  /**
   * Constructor de la clase Hero
   * @param {number} id - ID único del héroe
   * @param {string} name - Nombre del héroe
   * @param {string} description - Descripción del héroe
   * @param {string} modified - Fecha de última modificación
   * @param {Thumbnail|Object} thumbnail - Objeto Thumbnail o datos del thumbnail
   * @param {string} resourceURI - URI del recurso en la API
   * @param {Array} comics - Lista de cómics relacionados
   */
  constructor(id, name, description, modified, thumbnail, resourceURI, comics) {
    // Validaciones básicas
    if (!id || typeof id !== "number") throw new Error("ID inválido");
    if (!name || typeof name !== "string") throw new Error("Nombre inválido");
    if (!description || typeof description !== "string")
      throw new Error("Descripción inválida");
    if (!modified || typeof modified !== "string")
      throw new Error("Fecha inválida");
    if (!resourceURI || typeof resourceURI !== "string")
      throw new Error("URI inválido");
    if (!Array.isArray(comics)) throw new Error("Comics debe ser un array");

    // Asignación de propiedades
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#modified = modified;
    this.#thumbnail =
      thumbnail instanceof Thumbnail
        ? thumbnail
        : Thumbnail.fromObject(thumbnail);
    this.#resourceURI = resourceURI;
    this.#comics = comics;
  }

  // Getters y Setters
  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }
  set name(value) {
    if (!value || typeof value !== "string") throw new Error("Nombre inválido");
    this.#name = value;
  }

  get description() {
    return this.#description;
  }
  set description(value) {
    if (!value || typeof value !== "string")
      throw new Error("Descripción inválida");
    this.#description = value;
  }

  get modified() {
    return this.#modified;
  }
  set modified(value) {
    if (!value || typeof value !== "string") throw new Error("Fecha inválida");
    this.#modified = value;
  }

  get resourceURI() {
    return this.#resourceURI;
  }
  set resourceURI(value) {
    if (!value || typeof value !== "string") throw new Error("URI inválido");
    this.#resourceURI = value;
  }

  get comics() {
    return [...this.#comics];
  }
  set comics(value) {
    if (!Array.isArray(value)) throw new Error("Comics debe ser un array");
    this.#comics = [...value];
  }

  /**
   * Obtiene la URL completa del thumbnail
   * @returns {string} URL de la imagen
   */
  getThumbnailURL() {
    return this.#thumbnail.getURL();
  }
}

/**
 * Clase Collections: Gestiona una colección de cómics
 */
class Collections {
  // Propiedad privada para almacenar los cómics
  #collectionComics;

  /**
   * Número máximo de cómics coleccionables permitidos
   */
  static MAX_COLLECTIONS = 50;

  constructor() {
    this.#collectionComics = [];
  }

  /**
   * Obtiene una copia de la lista de cómics coleccionables
   */
  get collectionComics() {
    return [...this.#collectionComics];
  }

  /**
   * Requisito 3: Agrega un cómic a la lista de coleccionables
   * @param {Comic} comic - Cómic a agregar
   * @throws {Error} Si el parámetro no es una instancia de Comic
   */
  addCollectionComic(comic) {
    if (!(comic instanceof Comic)) {
      throw new Error("Solo se pueden agregar instancias de Comic");
    }
    if (this.#collectionComics.length >= Collections.MAX_COLLECTIONS) {
      throw new Error("Has alcanzado el límite máximo de coleccionables");
    }
    if (!this.#collectionComics.some((c) => c.id === comic.id)) {
      this.#collectionComics.push(comic);
    }
  }

  /**
   * Requisito 3: Elimina un cómic de coleccionables por su ID
   * @param {number} comicId - ID del cómic a eliminar
   */
  removeCollectionComic(comicId) {
    if (typeof comicId !== "number") {
      throw new Error("El ID debe ser un número");
    }
    this.#collectionComics = this.#collectionComics.filter(
      (comic) => comic.id !== comicId
    );
  }

  /**
   * Requisito 3: Muestra todos los cómics en coleccionables
   * @returns {Array<{title: string, price: number}>} Array con información básica de los cómics
   */
  showCollections() {
    return this.#collectionComics.map((comic) => ({
      title: comic.title,
      price: comic.price,
    }));
  }

  /**
   * Requisito 4: Busca un cómic por ID de forma recursiva
   * @param {number} comicId - ID del cómic a buscar
   * @param {Array<Comic>} comics - Array donde buscar (opcional)
   * @returns {Comic|null} Cómic encontrado o null
   */
  findComicById(comicId, comics = this.#collectionComics) {
    if (typeof comicId !== "number") {
      throw new Error("El ID debe ser un número");
    }
    if (comics.length === 0) return null;
    if (comics[0].id === comicId) return comics[0];
    return this.findComicById(comicId, comics.slice(1));
  }

  /**
   * Requisito 5: Calcula el precio promedio usando reduce
   * @returns {number} Precio promedio de los cómics
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
   * Requisito 6: Agrega múltiples cómics usando el operador rest
   * @param {...Comic} comics - Lista de cómics a agregar
   * @throws {Error} Si algún parámetro no es una instancia de Comic
   */
  addMultipleCollections(...comics) {
    if (!comics.every((comic) => comic instanceof Comic)) {
      throw new Error("Todos los elementos deben ser instancias de Comic");
    }
    comics.forEach((comic) => this.addCollectionComic(comic));
  }

  /**
   * Requisito 7: Crea una copia usando el operador spread
   * @returns {Array<Comic>} Copia de la colección de coleccionables
   */
  copyCollections() {
    return [...this.#collectionComics];
  }

  /**
   * Requisito 8: Obtiene títulos de cómics asequibles usando map y filter
   * @param {number} maxPrice - Precio máximo a considerar
   * @returns {Array<string>} Títulos de los cómics que cumplen el criterio
   */
  getAffordableComicTitles(maxPrice) {
    if (typeof maxPrice !== "number" || maxPrice < 0) {
      throw new Error("El precio máximo debe ser un número positivo");
    }
    return this.#collectionComics
      .filter((comic) => comic.price <= maxPrice)
      .map((comic) => comic.title);
  }
}

// Requisito 1: Creación de héroes
const spidermanThumb = new Thumbnail(
  "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b",
  "jpg"
);
const spiderman = new Hero(
  1,
  "Spider-Man",
  "El amigable vecino",
  "2024-01-01",
  spidermanThumb,
  "http://marvel.com/characters/spiderman",
  ["Amazing Spider-Man", "Spider-Man 2099"]
);

// Requisito 2: Creación de cómics
const amazingSpidermanComicThumb = new Thumbnail(
  "http://i.annihil.us/u/prod/marvel/i/mg/c/e0/4bc4947ea8f4d",
  "jpg"
);
const amazingSpidermanComic = new Comic(
  15808,
  "Ultimate Spider-Man (2000) #110 (Mark Bagley Variant)",
  110,
  "#N/A",
  1,
  amazingSpidermanComicThumb,
  2.99,
  [
    "Mark Bagley",
    "Richard Isanove",
    "Brian Michael Bendis",
    "Wade Von Grawbadger",
    "Andrew Hennessy",
    "Stuart Immonen",
    "Vc Cory Petit",
    "Justin Ponsor",
    "Jeff Youngquist",
  ],
  ["Spider-Man (Ultimate)"]
);

// Segundo cómic para pruebas
const xmenThumb = new Thumbnail(
  "http://i.annihil.us/u/prod/marvel/i/mg/2/f0/4bc6670c80007",
  "jpg"
);
const xmenComic = new Comic(
  1158,
  "ULTIMATE X-MEN VOL. 5: ULTIMATE WAR TPB",
  0,
  "No description available",
  112,
  xmenThumb,
  9.99,
  ["Chris Bachalo", "Mark Millar"],
  [
    "Beast (Ultimate)",
    "Black Widow (Ultimate)",
    "Captain America (Ultimate)",
    "Colossus (Ultimate)",
    "Hawkeye (Ultimate)",
    "Hulk (Ultimate)",
    "Iceman (Ultimate)",
    "Jean Grey (Ultimate)",
    "Magneto (Ultimate)",
    "Nick Fury (Ultimate)",
    "Quicksilver (Ultimate)",
    "Rogue (Ultimate)",
    "Scarlet Witch (Ultimate)",
    "Storm (Ultimate)",
    "Thor (Ultimate)",
    "Vanisher (Ultimate)",
    "Wasp (Ultimate)",
  ]
);

// Pruebas Prerequisito 1 y 2: Thumbnail
console.log("--- Requisito 1: Thumbnail ---");
console.log("URL Thumbnail Héroe:", spidermanThumb.getURL());
console.log("URL Thumbnail Cómic 1:", amazingSpidermanComicThumb.getURL());
console.log("URL Thumbnail Cómic 2:", xmenThumb.getURL());

try {
  const invalidThumb = new Thumbnail(null, "jpg");
} catch (error) {
  console.log("Error validación thumbnail:", error.message);
}

// Pruebas Requisito 1 y 2: Hero y Comic

// Pruebas Hero
console.log("\n---Requisito 1: Hero - Datos Spider-Man:---", {
  nombre: spiderman.name,
  descripción: spiderman.description,
  thumbnail: spiderman.getThumbnailURL(),
  cómics: spiderman.comics,
});

// Pruebas Comic
console.log("\n---Comic - Datos Spider-Man:---", {
  título: amazingSpidermanComic.title,
  número: amazingSpidermanComic.issueNumber,
  precio: amazingSpidermanComic.price,
  creadores: amazingSpidermanComic.creators,
  personajes: amazingSpidermanComic.characters,
  thumbnail: amazingSpidermanComic.getThumbnailURL(),
});

// Prueba de modificación (setters)
try {
  spiderman.name = "Peter Parker";
  amazingSpidermanComic.price = 3.99;
  console.log("\nDatos modificados:", {
    "Nuevo nombre héroe": spiderman.name,
    "Nuevo precio cómic": amazingSpidermanComic.price,
  });
} catch (error) {
  console.log("Error en modificación:", error.message);
}

// Requisito 3: Agregar, eliminar y mostrar coleccionables
console.log("\n--- Requisito 3: Gestión Colección ---");

const collections = new Collections();

// Añadir cómic
collections.addCollectionComic(amazingSpidermanComic);
console.log("\nDespués de añadir:", collections.showCollections());

// Mostrar coleccionables actuales
console.log("\nLista actual:", collections.showCollections());

// Eliminar cómic
collections.removeCollectionComic(15808);
console.log("\nDespués de eliminar:", collections.showCollections());

// Requisito 4: Búsqueda recursiva
console.log("\n--- Requisito 4: Búsqueda Recursiva ---");
collections.addCollectionComic(amazingSpidermanComic);
const foundComic = collections.findComicById(15808);
console.log("Cómic encontrado por ID 2:", foundComic?.title);

// Requisito 6: Agregar múltiples cómics con rest
console.log("\n--- Requisito 6: Agregar Múltiples ---");
collections.addMultipleCollections(amazingSpidermanComic, xmenComic);
console.log(
  "Colecciones después de agregar múltiples:",
  collections.showCollections()
);

// Requisito 5: Precio promedio usando reduce
console.log("\n--- Requisito 5: Precio Promedio ---");
console.log(
  "Precio promedio de colecciones:",
  collections.calculateAveragePrice()
);

// Requisito 7: Copiar usando spread
console.log("\n--- Requisito 7: Copia con Spread ---");
const copiaFavoritos = collections.copyCollections();
console.log(
  "Copia de colecciones:",
  copiaFavoritos.map((c) => c.title)
);

// Requisito 8: Filtrar por precio máximo
console.log("\n--- Requisito 8: Filtrar por Precio ---");
console.log(
  "Cómics con precio <= 7.99:",
  collections.getAffordableComicTitles(7.99)
);
