/**
 * Representa un héroe de Marvel con encapsulación completa de sus propiedades
 * Implementa validación de datos y protección contra modificaciones accidentales
 */
class Hero {
  // Propiedades privadas usando # para encapsulación
  #id;
  #name;
  #description;
  #modified;
  #thumbnail;
  #resourceURI;
  #comics;

  /**
   * @throws {Error} Si algún parámetro requerido es inválido o está ausente
   */
  constructor(
    id,
    name,
    description = "No description available",
    modified = new Date().toISOString(),
    thumbnail = null,
    resourceURI = "",
    comics = []
  ) {
    // Validaciones menos estrictas para mantener compatibilidad
    if (!id || typeof id !== "number") throw new Error("ID de héroe inválido");
    if (!name || typeof name !== "string")
      throw new Error("Nombre de héroe inválido");

    // Inicialización de propiedades privadas con valores por defecto
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#modified = modified;
    this.#thumbnail = thumbnail || {
      path: "assets/images/image-not-found",
      extension: "jpg",
    };
    this.#resourceURI = resourceURI;
    this.#comics = comics;
  }

  // Getters para acceso controlado a las propiedades privadas
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  get modified() {
    return this.#modified;
  }
  get thumbnail() {
    return this.#thumbnail;
  }
  get resourceURI() {
    return this.#resourceURI;
  }
  get comics() {
    return [...this.#comics];
  }

  // Getter de compatibilidad para la versión simple
  get image() {
    return this.getThumbnailURL();
  }

  /**
   * Genera la URL completa de la imagen del héroe
   * Combina path y extension del thumbnail según el formato de la API
   */
  getThumbnailURL() {
    return this.getImageURL();
  }

  /**
   * Método de compatibilidad con la implementación anterior
   */
  getImageURL() {
    if (this.#thumbnail && this.#thumbnail.path && this.#thumbnail.extension) {
      return `${this.#thumbnail.path}.${this.#thumbnail.extension}`;
    }
    return "assets/images/image-not-found.jpg";
  }

  /**
   * Método de compatibilidad para serialización
   */
  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      thumbnail: this.#thumbnail,
      description: this.#description,
      modified: this.#modified,
      resourceURI: this.#resourceURI,
      comics: this.#comics,
    };
  }

  /**
   * Crea una instancia de Hero a partir de datos de la API
   * Maneja valores faltantes o nulos con valores por defecto
   */
  static fromAPI(apiHero) {
    if (!apiHero) {
      throw new Error("No data provided to create Hero");
    }

    return new Hero(
      apiHero.id,
      apiHero.name,
      apiHero.description || "No description available",
      apiHero.modified || new Date().toISOString(),
      apiHero.thumbnail || {
        path: "assets/images/image-not-found",
        extension: "jpg",
      },
      apiHero.resourceURI || "",
      apiHero.comics?.items?.map((comic) => comic.name) || []
    );
  }
}
