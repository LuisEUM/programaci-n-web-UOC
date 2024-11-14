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
     * Formatea un precio a formato de moneda
     * @param {number} price - Precio a formatear
     * @returns {string} Precio formateado
     */
    formatPrice(price) {
        return `$${price.toFixed(2)}`;
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
     * Valida si un input está vacío
     * @param {string} input - Texto a validar
     * @returns {boolean} True si el input es válido
     */
    validateInput(input) {
        return input && input.trim().length > 0;
    },

    /**
     * Genera un ID único
     * @returns {string} ID único generado
     */
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}; 