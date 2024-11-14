/**
 * Funciones de utilidad para la aplicación
 */
const Utils = {
    /**
     * Genera un hash MD5 para la autenticación de la API de Marvel
     * @param {string} timestamp - Marca de tiempo actual
     * @param {string} privateKey - Clave privada de la API
     * @param {string} publicKey - Clave pública de la API
     * @returns {string} Hash MD5 generado
     */
    generateMarvelHash(timestamp, privateKey, publicKey) {
        return CryptoJS.MD5(timestamp + privateKey + publicKey).toString();
    },

    /**
     * Trunca un texto a una longitud máxima
     * @param {string} text - Texto a truncar
     * @param {number} maxLength - Longitud máxima
     * @returns {string} Texto truncado
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? 
            text.substring(0, maxLength) + '...' : 
            text;
    },

    /**
     * Debounce para limitar la frecuencia de llamadas a una función
     * @param {function} func - Función a llamar
     * @param {number} wait - Tiempo de espera en milisegundos
     * @returns {function} Función debounceada
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Clona un objeto de manera profunda
     * @param {object} obj - Objeto a clonar
     * @returns {object} Objeto clonado
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Formatea una fecha a formato legible
     * @param {string} dateString - Fecha en formato ISO
     * @returns {string} Fecha formateada
     */
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    },

    /**
     * Genera un ID único
     * @returns {string} ID único generado
     */
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}; 