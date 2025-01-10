/**
 * Clase que representa un cómic en la aplicación.
 *
 * Usos principales:
 * - ComicsGrid: Para mostrar la lista de cómics y su información
 * - ComicModal: Para mostrar detalles del cómic en modal
 * - ComicDetailsModal: Para mostrar información detallada del cómic
 * - DataService: Para transformar datos de la API
 * - Collections: Para gestionar cómics en colecciones
 */
class Comic {
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
   * Crea una nueva instancia de cómic.
   * Usado en: fromAPI
   * Estado: Activo y en uso
   *
   * @param {number} id - ID único del cómic
   * @param {string} title - Título del cómic
   * @param {number} issueNumber - Número de edición
   * @param {string} description - Descripción del cómic
   * @param {number} pageCount - Número de páginas
   * @param {Object} thumbnail - Objeto con información de la imagen
   * @param {number} price - Precio del cómic
   * @param {Array} creators - Array de creadores
   * @param {Array} characters - Array de personajes
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
    // Validaciones
    if (!id || typeof id !== "number") throw new Error("ID inválido");
    if (!title || typeof title !== "string") throw new Error("Título inválido");
    if (typeof issueNumber !== "number")
      throw new Error("Número de edición inválido");
    if (!description || typeof description !== "string")
      throw new Error("Descripción inválida");
    if (typeof pageCount !== "number" || pageCount < 0)
      throw new Error("Número de páginas inválido");
    if (!thumbnail || !thumbnail.path || !thumbnail.extension)
      throw new Error("Thumbnail inválido");
    if (typeof price !== "number" || price < 0)
      throw new Error("Precio inválido");
    if (!Array.isArray(creators))
      throw new Error("Creadores debe ser un array");
    if (!Array.isArray(characters))
      throw new Error("Personajes debe ser un array");

    // Asignación de propiedades privadas
    this.#id = id;
    this.#title = title;
    this.#issueNumber = issueNumber;
    this.#description = description;
    this.#pageCount = pageCount;
    this.#thumbnail = thumbnail;
    this.#price = price;
    this.#creators = creators;
    this.#characters = characters;
  }

  /**
   * Obtiene la URL completa de la imagen del cómic.
   * Usado en: ComicsGrid, ComicModal, ComicDetailsModal
   * Estado: Activo y en uso
   *
   * @returns {string} URL completa de la imagen o imagen por defecto
   */
  getThumbnailURL() {
    if (this.#thumbnail && this.#thumbnail.path && this.#thumbnail.extension) {
      return `${this.#thumbnail.path}.${this.#thumbnail.extension}`;
    }
    return "assets/images/default-comic.png";
  }

  /**
   * Crea una instancia de Comic a partir de datos de la API de Marvel.
   * Usado en: ComicsGrid, DataService
   * Estado: Activo y en uso
   *
   * @param {Object} apiComic - Datos del cómic en formato API
   * @returns {Comic} Nueva instancia de Comic
   */
  static fromAPI(apiComic) {
    // console.log("Raw API Comic:", apiComic); // Debug log

    // Si estamos en modo mock, los datos ya vienen en el formato correcto
    if (Config.USE_MOCK_DATA) {
      return new Comic(
        apiComic.id,
        apiComic.title,
        apiComic.issueNumber,
        apiComic.description || "No description available",
        apiComic.pageCount,
        apiComic.thumbnail,
        apiComic.price || 0,
        apiComic.creators || [],
        apiComic.characters || []
      );
    }

    // Si son datos de la API, necesitamos transformarlos
    return new Comic(
      apiComic.id,
      apiComic.title,
      apiComic.issueNumber,
      apiComic.description || "No description available",
      apiComic.pageCount,
      apiComic.thumbnail,
      apiComic.prices?.[0]?.price || 0,
      apiComic.creators?.items?.map((creator) => creator.name) || [],
      apiComic.characters?.items?.map((char) => char.name) || []
    );
  }

  /**
   * Crea una instancia de Comic a partir de datos mock.
   * Usado en: DataService
   * Estado: Activo y en uso
   *
   * @param {Object} mockComic - Datos del cómic en formato mock
   * @returns {Comic} Nueva instancia de Comic
   */
  static fromMockData(mockComic) {
    return new Comic(
      mockComic.id,
      mockComic.title,
      mockComic.issueNumber,
      mockComic.description,
      mockComic.pageCount,
      mockComic.thumbnail,
      mockComic.price,
      mockComic.creators,
      mockComic.characters
    );
  }

  // Getters
  /**
   * Obtiene el ID del cómic.
   * Usado en: A través de toda la aplicación
   * Estado: Activo y en uso
   *
   * @returns {number} ID del cómic
   */
  get id() {
    return this.#id;
  }

  /**
   * Obtiene el título del cómic.
   * Usado en: A través de toda la aplicación
   * Estado: Activo y en uso
   *
   * @returns {string} Título del cómic
   */
  get title() {
    return this.#title;
  }

  /**
   * Obtiene el número de edición del cómic.
   * Usado en: A través de toda la aplicación
   * Estado: Activo y en uso
   *
   * @returns {number} Número de edición
   */
  get issueNumber() {
    return this.#issueNumber;
  }

  /**
   * Obtiene la descripción del cómic.
   * Usado en: A través de toda la aplicación
   * Estado: Activo y en uso
   *
   * @returns {string} Descripción del cómic
   */
  get description() {
    return this.#description;
  }

  /**
   * Obtiene el número de páginas del cómic.
   * Usado en: A través de toda la aplicación
   * Estado: Activo y en uso
   *
   * @returns {number} Número de páginas
   */
  get pageCount() {
    return this.#pageCount;
  }

  /**
   * Obtiene el objeto thumbnail del cómic.
   * Usado en: A través de toda la aplicación
   * Estado: Activo y en uso
   *
   * @returns {Object} Objeto con información de la imagen
   */
  get thumbnail() {
    return this.#thumbnail;
  }

  /**
   * Obtiene el precio del cómic.
   * Usado en: A través de toda la aplicación
   * Estado: Activo y en uso
   *
   * @returns {number} Precio del cómic
   */
  get price() {
    return this.#price;
  }

  /**
   * Establece el precio del cómic.
   * Usado en: Para actualizar precios
   * Estado: Activo y en uso
   *
   * @param {number} newPrice - Nuevo precio del cómic
   */
  set price(newPrice) {
    if (typeof newPrice !== "number" || newPrice < 0)
      throw new Error("Precio inválido");
    this.#price = newPrice;
  }

  /**
   * Obtiene los creadores del cómic.
   * Usado en: A través de toda la aplicación
   * Estado: Activo y en uso
   *
   * @returns {Array} Array de creadores
   */
  get creators() {
    return [...this.#creators];
  }

  /**
   * Obtiene los personajes del cómic.
   * Usado en: A través de toda la aplicación
   * Estado: Activo y en uso
   *
   * @returns {Array} Array de personajes
   */
  get characters() {
    return [...this.#characters];
  }
}

