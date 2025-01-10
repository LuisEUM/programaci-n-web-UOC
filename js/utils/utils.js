/**
 * Utilidades generales para la aplicación
 * Proporciona funciones auxiliares reutilizables
 */
class Utils {
  /**
   * Genera un hash MD5 para autenticación con la API de Marvel
   * La API requiere un hash específico para validar las peticiones
   *
   * @param {string} timestamp - Marca de tiempo actual
   * @param {string} privateKey - Clave privada de la API
   * @param {string} publicKey - Clave pública de la API
   * @returns {string} Hash MD5 generado
   */
  static generateMarvelHash(timestamp, privateKey, publicKey) {
    return CryptoJS.MD5(timestamp + privateKey + publicKey).toString();
  }

  /**
   * Trunca un texto a una longitud máxima añadiendo "..."
   * Útil para mostrar descripciones largas en espacios limitados
   *
   * @param {string} text - Texto a truncar
   * @param {number} maxLength - Longitud máxima deseada
   * @returns {string} Texto truncado con elipsis si es necesario
   */
  static truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  /**
   * Implementa el patrón debounce para limitar la frecuencia de llamadas
   * Útil para optimizar eventos que se disparan frecuentemente (ej: scroll, resize)
   *
   * @param {Function} func - Función a ejecutar
   * @param {number} wait - Tiempo de espera en milisegundos
   * @returns {Function} Función con debounce aplicado
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Realiza una copia profunda de un objeto
   * Evita referencias compartidas que podrían causar efectos secundarios
   *
   * @param {Object} obj - Objeto a clonar
   * @returns {Object} Copia profunda del objeto
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Formatea una fecha ISO a formato legible
   * Utiliza las configuraciones locales del navegador
   *
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada según la localización
   */
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  /**
   * Genera un ID único combinando timestamp y número aleatorio
   * Útil para crear identificadores únicos para elementos DOM o datos temporales
   *
   * @returns {string} ID único en base36
   */
  static generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

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

  static getSourceCounts(sourceCollections) {
    const counts = {};
    Object.keys(sourceCollections).forEach((collection) => {
      counts[collection] = Array.isArray(sourceCollections[collection])
        ? sourceCollections[collection].length
        : 0;
    });
    return counts;
  }

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