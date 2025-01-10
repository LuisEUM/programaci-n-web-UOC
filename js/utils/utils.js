/**
 * Utilidades generales para la aplicación.
 * Proporciona funciones auxiliares reutilizables para operaciones comunes.
 * @class
 * @static
 */
class Utils {
  /**
   * Genera un hash MD5 para autenticación con la API de Marvel.
   * La API requiere un hash específico para validar las peticiones.
   * @static
   * @param {string} timestamp - Marca de tiempo actual
   * @param {string} privateKey - Clave privada de la API
   * @param {string} publicKey - Clave pública de la API
   * @returns {string} Hash MD5 generado
   * @example
   * const hash = Utils.generateMarvelHash(timestamp, privateKey, publicKey);
   */
  static generateMarvelHash(timestamp, privateKey, publicKey) {
    return CryptoJS.MD5(timestamp + privateKey + publicKey).toString();
  }

  /**
   * Obtiene el conteo de cómics por colección y fuente de datos.
   * @static
   * @param {Object} [collections] - Objeto de colecciones. Si no se proporciona, se obtiene de localStorage
   * @returns {Object} Objeto con conteos por fuente de datos y colección
   * @example
   * const counts = Utils.getCollectionCounts();
   */
  static getCollectionCounts(collections) {
    const userName = localStorage.getItem("userName");
    if (!collections) {
      const userCollections = localStorage.getItem(`collections_${userName}`);
      if (userCollections) {
        collections = JSON.parse(userCollections);
      } else {
        return { mock: {}, api: {} };
      }
    }

    return {
      mock: Utils.getSourceCounts(collections.mock || {}),
      api: Utils.getSourceCounts(collections.api || {}),
    };
  }

  /**
   * Calcula el conteo de cómics para una fuente de datos específica.
   * @static
   * @private
   * @param {Object} sourceCollections - Colecciones de una fuente específica
   * @returns {Object} Objeto con conteos por colección
   */
  static getSourceCounts(sourceCollections) {
    const counts = {};
    Object.keys(sourceCollections).forEach((collection) => {
      counts[collection] = Array.isArray(sourceCollections[collection])
        ? sourceCollections[collection].length
        : 0;
    });
    return counts;
  }

  /**
   * Obtiene el total de cómics únicos en todas las colecciones.
   * @static
   * @param {Object} [collections] - Objeto de colecciones. Si no se proporciona, se obtiene de localStorage
   * @returns {number} Total de cómics únicos
   * @example
   * const totalComics = Utils.getUniqueComicsCount();
   */
  static getUniqueComicsCount(collections) {
    const userName = localStorage.getItem("userName");
    if (!collections) {
      const userCollections = localStorage.getItem(`collections_${userName}`);
      if (userCollections) {
        collections = JSON.parse(userCollections);
      } else {
        return 0;
      }
    }

    const source = localStorage.getItem("dataSourcePreference") || "mock";
    if (!collections[source]) return 0;

    const uniqueComics = new Set();

    Object.values(collections[source]).forEach((collectionArray) => {
      if (Array.isArray(collectionArray)) {
        collectionArray.forEach((comicId) => uniqueComics.add(comicId));
      }
    });

    return uniqueComics.size;
  }
}

// Exportar la clase Utils para uso global
window.Utils = Utils;
