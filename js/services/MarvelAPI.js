class MarvelAPI {
  static BASE_URL = Config.MARVEL_API_BASE_URL;
  static PUBLIC_KEY = Config.MARVEL_PUBLIC_KEY;
  static PRIVATE_KEY = Config.MARVEL_PRIVATE_KEY;
  static generateHash(timestamp) {
    return CryptoJS.MD5(
      timestamp + this.PRIVATE_KEY + this.PUBLIC_KEY
    ).toString();
  }
  static async getComics(params = {}) {
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
      return await response.json();
    } catch (error) {
      console.error("Error fetching comics:", error);
      throw error;
    }
  }
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