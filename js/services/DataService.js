/**
 * Servicio que maneja la persistencia y recuperación de datos.
 * Actúa como capa intermedia entre la API/datos mock y los componentes.
 * Proporciona métodos para obtener y gestionar datos de cómics y héroes.
 */
class DataService {
  /**
   * Obtiene una lista de elementos (cómics o héroes) con paginación y filtros.
   * @param {string} type - Tipo de elementos a obtener ('comics' o 'heroes')
   * @param {Object} params - Parámetros de la petición
   * @param {number} [params.limit=Config.LIMIT] - Límite de resultados por página
   * @param {number} [params.offset=0] - Número de resultados a saltar
   * @param {string} [params.titleStartsWith] - Filtro por título (solo para cómics)
   * @param {string} [params.nameStartsWith] - Filtro por nombre (solo para héroes)
   * @returns {Promise<Object>} Objeto con resultados y metadata de paginación
   * @throws {Error} Si hay un error en la petición o el tipo es inválido
   */
  static async fetchItems(type, params = {}) {
    try {
      let response;
      console.log(`Fetching ${type} with params:`, params);
      switch (type) {
        case "comics":
          if (Config.USE_MOCK_DATA) {
            const filteredComics = mockComics.comics.filter(
              (comic) =>
                !params.titleStartsWith ||
                comic.title
                  .toLowerCase()
                  .includes(params.titleStartsWith.toLowerCase())
            );
            console.log("Filtered Comics:", filteredComics);

            // Aplicar paginación a los datos mock
            const start = params.offset || 0;
            const end = start + (params.limit || Config.LIMIT);
            const paginatedComics = filteredComics.slice(start, end);

            return {
              results: paginatedComics,
              total: filteredComics.length,
            };
          } else {
            response = await MarvelAPI.getComics(params);
            console.log("API Response for Comics:", response);
            return {
              results: response.data.results,
              total: response.data.total,
            };
          }
        case "heroes":
          if (Config.USE_MOCK_DATA) {
            const allHeroes = mockComics.heroes;

            // Aplicar paginación a los datos mock
            const start = params.offset || 0;
            const limit = params.limit || Config.LIMIT;
            const paginatedHeroes = allHeroes.slice(start, start + limit);

            return {
              results: paginatedHeroes,
              total: allHeroes.length,
              limit: limit,
              offset: start,
              count: paginatedHeroes.length,
            };
          } else {
            const response = await MarvelAPI.getHeroes(params);
            return {
              results: response.data.results,
              total: response.data.total,
              limit: response.data.limit,
              offset: response.data.offset,
              count: response.data.count,
            };
          }
        default:
          throw new Error("Invalid item type");
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene un elemento específico por su ID.
   * @param {string} type - Tipo de elemento ('comics' o 'heroes')
   * @param {number} id - ID del elemento a buscar
   * @returns {Promise<Object>} Datos del elemento
   * @throws {Error} Si hay un error en la petición o el tipo es inválido
   */
  static async fetchItemById(type, id) {
    try {
      switch (type) {
        case "comics":
          return await MarvelAPI.getComicById(id);
        case "heroes":
          return await MarvelAPI.getHeroById(id);
        default:
          throw new Error("Invalid item type");
      }
    } catch (error) {
      console.error(`Error fetching ${type} by ID:`, error);
      throw error;
    }
  }

  /**
   * Carga los elementos de todas las colecciones.
   * @param {Collections} collectionsManager - Instancia del gestor de colecciones
   * @returns {Promise<Array>} Array de colecciones con sus elementos
   */
  static async loadCollectionItems(collectionsManager) {
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
    const collections = collectionsManager.getAllCollections(dataSource);
    const results = [];

    for (const [collectionName, collectionIds] of Object.entries(collections)) {
      if (collectionIds.length > 0) {
        const items = await this.getCollectionItems(dataSource, collectionIds);
        if (items.length > 0) {
          results.push({
            name: collectionsManager.getCollectionDisplayName(collectionName),
            items,
          });
        }
      }
    }

    return results;
  }

  /**
   * Obtiene los elementos de una colección por sus IDs.
   * @param {string} dataSource - Fuente de datos ('mock' o 'api')
   * @param {Array<number>} ids - Array de IDs de los elementos
   * @returns {Promise<Array>} Array de elementos encontrados
   */
  static async getCollectionItems(dataSource, ids) {
    if (!ids || ids.length === 0) return [];

    if (dataSource === "mock") {
      return mockComics.comics.filter((comic) => ids.includes(comic.id));
    } else {
      const items = [];
      for (const id of ids) {
        try {
          const item = await MarvelAPI.getComicById(id);
          if (item) items.push(item);
        } catch (error) {
          console.error(`Error loading item ${id}:`, error);
        }
      }
      return items;
    }
  }
}
