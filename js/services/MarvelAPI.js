/**
 * Clase que maneja las interacciones con la API de Marvel.
 * Proporciona métodos estáticos para realizar peticiones a los endpoints de cómics y héroes.
 */
class MarvelAPI {
  /** @type {string} URL base de la API de Marvel */
  static BASE_URL = Config.MARVEL_API_BASE_URL;

  /** @type {string} Clave pública de la API de Marvel */
  static PUBLIC_KEY = Config.MARVEL_PUBLIC_KEY;

  /** @type {string} Clave privada de la API de Marvel */
  static PRIVATE_KEY = Config.MARVEL_PRIVATE_KEY;

  /**
   * Genera un hash MD5 requerido para autenticar las peticiones a la API de Marvel.
   * @param {string} timestamp - Marca de tiempo actual
   * @returns {string} Hash MD5 generado
   */
  static generateHash(timestamp) {
    return CryptoJS.MD5(
      timestamp + this.PRIVATE_KEY + this.PUBLIC_KEY
    ).toString();
  }

  /**
   * Obtiene una lista de cómics de la API de Marvel.
   * @param {Object} params - Parámetros de la petición
   * @param {number} [params.limit=Config.LIMIT] - Límite de resultados por página
   * @param {number} [params.offset=0] - Número de resultados a saltar
   * @param {string} [params.titleStartsWith] - Filtro por título que comienza con
   * @returns {Promise<Object>} Respuesta de la API con los cómics
   * @throws {Error} Si hay un error en la petición
   */
  static async getComics(params = {}) {
    const timestamp = new Date().getTime().toString();
    const hash = this.generateHash(timestamp);
    const queryParams = new URLSearchParams({
      ts: timestamp,
      apikey: this.PUBLIC_KEY,
      hash: hash,
      limit: params.limit || Config.LIMIT,
      offset: params.offset || 0,
      orderBy: params.orderBy || 'title', // Añadimos ordenamiento por defecto
      ...(params.titleStartsWith && {
        titleStartsWith: params.titleStartsWith,
      }),
    });
  
    try {
      const response = await fetch(`${this.BASE_URL}/comics?${queryParams}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("API Response:", data); // Para debugging
      return data;
    } catch (error) {
      console.error("Error fetching comics:", error);
      throw error;
    }
  }

  /**
   * Obtiene un cómic específico por su ID.
   * @param {number} id - ID del cómic a buscar
   * @returns {Promise<Object|null>} Datos del cómic transformados o null si no se encuentra
   * @throws {Error} Si hay un error en la petición
   */
  static async getComicById(id) {
    const timestamp = new Date().getTime().toString();
    const hash = this.generateHash(timestamp);
    const queryParams = new URLSearchParams({
      ts: timestamp,
      apikey: this.PUBLIC_KEY,
      hash: hash,
    });
    try {
      const response = await fetch(
        `${this.BASE_URL}/comics/${id}?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Transformar el resultado usando el mismo método que getComics
      if (data.data?.results?.[0]) {
        const transformedComic = {
          id: data.data.results[0].id,
          title: data.data.results[0].title,
          issueNumber: data.data.results[0].issueNumber,
          description:
            data.data.results[0].description || "No description available",
          pageCount: data.data.results[0].pageCount || 0,
          thumbnail: {
            path:
              data.data.results[0].thumbnail?.path ||
              "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available",
            extension: data.data.results[0].thumbnail?.extension || "jpg",
          },
          price: data.data.results[0].prices?.[0]?.price || 0,
          creators:
            data.data.results[0].creators?.items?.map(
              (creator) => creator.name
            ) || [],
          characters:
            data.data.results[0].characters?.items?.map(
              (character) => character.name
            ) || [],
        };
        return transformedComic;
      }
      return null;
    } catch (error) {
      console.error("Error fetching comic:", error);
      throw error;
    }
  }

  /**
   * Obtiene una lista de héroes de la API de Marvel.
   * @param {Object} params - Parámetros de la petición
   * @param {number} [params.limit=Config.LIMIT] - Límite de resultados por página
   * @param {number} [params.offset=0] - Número de resultados a saltar
   * @param {string} [params.nameStartsWith] - Filtro por nombre que comienza con
   * @returns {Promise<Object>} Respuesta de la API con los héroes
   * @throws {Error} Si hay un error en la petición
   */
  static async getHeroes(params = {}) {
    const timestamp = new Date().getTime().toString();
    const hash = this.generateHash(timestamp);
    const queryParams = new URLSearchParams({
      ts: timestamp,
      apikey: this.PUBLIC_KEY,
      hash: hash,
      limit: params.limit || Config.LIMIT,
      offset: params.offset || 0,
      ...(params.nameStartsWith && { nameStartsWith: params.nameStartsWith }),
    });
    try {
      const response = await fetch(
        `${this.BASE_URL}/characters?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching heroes:", error);
      throw error;
    }
  }

  /**
   * Obtiene un héroe específico por su ID.
   * @param {number} id - ID del héroe a buscar
   * @returns {Promise<Object>} Datos del héroe
   * @throws {Error} Si hay un error en la petición
   */
  static async getHeroById(id) {
    const timestamp = new Date().getTime().toString();
    const hash = this.generateHash(timestamp);
    const queryParams = new URLSearchParams({
      ts: timestamp,
      apikey: this.PUBLIC_KEY,
      hash: hash,
    });
    try {
      const response = await fetch(
        `${this.BASE_URL}/characters/${id}?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching hero:", error);
      throw error;
    }
  }
}

// Crear una instancia global
window.marvelAPI = new MarvelAPI();
