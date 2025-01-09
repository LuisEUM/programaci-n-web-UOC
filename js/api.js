/**
 * Módulo que gestiona las llamadas a la API de Marvel
 * Implementa cache para optimizar las peticiones repetidas
 */

/**
 * Cache en memoria para almacenar resultados de peticiones previas
 * Estructura: { endpoint: { params: result } }
 */
const apiCache = {};

/**
 * Realiza una petición a la API de Marvel con gestión de caché
 * @param {string} endpoint - Ruta del endpoint
 * @param {Object} params - Parámetros de la petición
 * @returns {Promise<Object>} Respuesta de la API
 */
async function fetchFromAPI(endpoint, params = {}) {
  // ... código existente ...
}

const MarvelAPI = {
  BASE_URL: Config.MARVEL_API_BASE_URL,
  PUBLIC_KEY: Config.MARVEL_PUBLIC_KEY,
  PRIVATE_KEY: Config.MARVEL_PRIVATE_KEY,

  generateHash(timestamp) {
    return Utils.generateMarvelHash(
      timestamp,
      this.PRIVATE_KEY,
      this.PUBLIC_KEY
    );
  },

  transformComicData(apiComic) {
    return {
      id: apiComic.id,
      title: apiComic.title,
      issueNumber: apiComic.issueNumber,
      description: apiComic.description || "No description available",
      pageCount: apiComic.pageCount || 0,
      thumbnail: {
        path:
          apiComic.thumbnail?.path ||
          "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available",
        extension: apiComic.thumbnail?.extension || "jpg",
      },
      price: apiComic.prices?.[0]?.price || 0,
      creators: apiComic.creators?.items?.map((creator) => creator.name) || [],
      characters:
        apiComic.characters?.items?.map((character) => character.name) || [],
    };
  },

  async getComics(params = {}) {
    if (Config.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        const filteredComics = mockComics.comics.filter(
          (comic) =>
            !params.titleStartsWith ||
            comic.title
              .toLowerCase()
              .includes(params.titleStartsWith.toLowerCase())
        );
        resolve({
          data: {
            results: filteredComics,
            total: filteredComics.length,
          },
        });
      });
    }

    const timestamp = new Date().getTime().toString();
    const hash = this.generateHash(timestamp);
    const queryParams = new URLSearchParams({
      ts: timestamp,
      apikey: this.PUBLIC_KEY,
      hash: hash,
      limit: params.limit || Config.LIMIT,
      offset: params.offset || 0,
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

      return {
        data: {
          results: data.data.results.map((comic) =>
            this.transformComicData(comic)
          ),
          total: data.data.total,
        },
      };
    } catch (error) {
      console.error("Error fetching comics:", error);
      throw error;
    }
  },

  async getComicById(comicId) {
    if (Config.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        const comic = mockComics.comics.find((c) => c.id === comicId);
        resolve(comic);
      });
    }

    try {
      const timestamp = new Date().getTime().toString();
      const hash = this.generateHash(timestamp);

      const queryParams = new URLSearchParams({
        ts: timestamp,
        apikey: this.PUBLIC_KEY,
        hash: hash,
      });

      const response = await fetch(
        `${this.BASE_URL}/comics/${comicId}?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.data?.results?.[0]) {
        return this.transformComicData(data.data.results[0]);
      }
      return null;
    } catch (error) {
      console.error("Error fetching comic by ID:", error);
      throw error;
    }
  },

  async getHeroes(params = {}) {
    if (Config.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        const mockData = require("./data/heroes.json");
        const start = params.offset || 0;
        const limit = params.limit || Config.LIMIT;
        const filteredHeroes = mockData.heroes.filter(
          (hero) =>
            !params.nameStartsWith ||
            hero.name
              .toLowerCase()
              .includes(params.nameStartsWith.toLowerCase())
        );
        const paginatedHeroes = filteredHeroes.slice(start, start + limit);

        resolve({
          data: {
            results: paginatedHeroes,
            total: filteredHeroes.length,
            limit: limit,
            offset: start,
            count: paginatedHeroes.length,
          },
        });
      });
    }

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
      const data = await response.json();
      return {
        data: {
          results: data.data.results.map((hero) => ({
            id: hero.id,
            name: hero.name,
            description: hero.description || "No description available",
            modified: hero.modified,
            thumbnail: hero.thumbnail,
            resourceURI: hero.resourceURI,
            comics: hero.comics?.items?.map((comic) => comic.name) || [],
          })),
          total: data.data.total,
          limit: data.data.limit,
          offset: data.data.offset,
          count: data.data.count,
        },
      };
    } catch (error) {
      console.error("Error fetching heroes:", error);
      throw error;
    }
  },

  async getHero(heroId) {
    if (Config.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        const mockData = require("./data/heroes.json");
        const hero = mockData.heroes.find((h) => h.id === parseInt(heroId));
        resolve({
          data: {
            results: hero ? [hero] : [],
          },
        });
      });
    }

    const timestamp = new Date().getTime().toString();
    const hash = this.generateHash(timestamp);
    const queryParams = new URLSearchParams({
      ts: timestamp,
      apikey: this.PUBLIC_KEY,
      hash: hash,
    });

    try {
      const response = await fetch(
        `${this.BASE_URL}/characters/${heroId}?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching hero:", error);
      throw error;
    }
  },

  async getHeroComics(heroId, params = {}) {
    if (Config.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        const mockData = require("./data/comics.json");
        const start = params.offset || 0;
        const limit = params.limit || Config.LIMIT;
        const heroComics = mockData.comics.filter((comic) =>
          comic.characters?.includes(parseInt(heroId))
        );
        const paginatedComics = heroComics.slice(start, start + limit);

        resolve({
          data: {
            results: paginatedComics.map((comic) =>
              this.transformComicData(comic)
            ),
            total: heroComics.length,
            limit: limit,
            offset: start,
            count: paginatedComics.length,
          },
        });
      });
    }

    const timestamp = new Date().getTime().toString();
    const hash = this.generateHash(timestamp);
    const queryParams = new URLSearchParams({
      ts: timestamp,
      apikey: this.PUBLIC_KEY,
      hash: hash,
      limit: params.limit || Config.LIMIT,
      offset: params.offset || 0,
    });

    try {
      const response = await fetch(
        `${this.BASE_URL}/characters/${heroId}/comics?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return {
        data: {
          results: data.data.results.map((comic) =>
            this.transformComicData(comic)
          ),
          total: data.data.total,
          limit: data.data.limit,
          offset: data.data.offset,
          count: data.data.count,
        },
      };
    } catch (error) {
      console.error("Error fetching hero comics:", error);
      throw error;
    }
  },
};
