/**
 * Clase que representa un héroe en la aplicación.
 * Se utiliza en:
 * - HeroesGrid: Para mostrar la lista de héroes
 * - HeroModal: Para mostrar detalles del héroe
 * - HeroesCarousel: Para mostrar héroes destacados
 * - ComicsGrid: Para filtrar cómics por héroe
 */
class Hero {
  /**
   * @param {number} id - ID único del héroe
   * @param {string} name - Nombre del héroe
   * @param {string} description - Descripción del héroe
   * @param {string} modified - Fecha de última modificación
   * @param {object} thumbnail - Objeto con información de la imagen (path y extension)
   * @param {string} resourceURI - URI del recurso en la API
   * @param {string[]} comics - Array con nombres de cómics relacionados
   */
  constructor(
    id,
    name,
    description,
    modified,
    thumbnail,
    resourceURI,
    comics = []
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.modified = modified;
    this.thumbnail = thumbnail;
    this.resourceURI = resourceURI;
    this.comics = comics;
  }

  /**
   * Obtiene la URL completa de la imagen del héroe.
   * Usado en:
   * - HeroesGrid: Para mostrar la imagen en las tarjetas
   * - HeroModal: Para mostrar la imagen en el modal
   * - HeroesCarousel: Para mostrar la imagen en el carrusel
   * @returns {string} URL completa de la imagen
   */
  getThumbnailURL() {
    if (!this.thumbnail || !this.thumbnail.path || !this.thumbnail.extension) {
      return "assets/images/image-not-found.jpg";
    }
    return `${this.thumbnail.path}.${this.thumbnail.extension}`;
  }

  /**
   * Crea una instancia de Hero a partir de datos de la API de Marvel.
   * Usado en:
   * - DataService: Para crear héroes desde la API
   * - HeroesGrid: Para transformar respuestas de la API en objetos Hero
   * - HeroModal: Para crear el héroe a mostrar en el modal
   * @param {Object} apiHero - Datos del héroe en formato API
   * @returns {Hero} Nueva instancia de Hero
   */
  static fromAPI(apiHero) {
    return new Hero(
      apiHero.id,
      apiHero.name,
      apiHero.description || "No description available",
      apiHero.modified || new Date().toISOString(),
      apiHero.thumbnail || {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available",
        extension: "jpg",
      },
      apiHero.resourceURI || "",
      apiHero.comics?.items?.map((comic) => comic.name) || []
    );
  }
}
