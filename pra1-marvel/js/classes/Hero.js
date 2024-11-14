/**
 * Clase Hero: Representa un héroe de Marvel
 */
class Hero {
    // Propiedades privadas
    #id;
    #name;
    #description;
    #modified;
    #thumbnail;
    #resourceURI;
    #comics;

    /**
     * Constructor de la clase Hero
     * @param {number} id - ID único del héroe
     * @param {string} name - Nombre del héroe
     * @param {string} description - Descripción del héroe
     * @param {string} modified - Fecha de última modificación
     * @param {Object} thumbnail - Objeto con path y extension de la imagen
     * @param {string} resourceURI - URI del recurso en la API
     * @param {Array} comics - Lista de cómics relacionados
     */
    constructor(id, name, description, modified, thumbnail, resourceURI, comics) {
        // Validaciones básicas
        if (!id || typeof id !== 'number') throw new Error('ID inválido');
        if (!name || typeof name !== 'string') throw new Error('Nombre inválido');
        if (!description || typeof description !== 'string') throw new Error('Descripción inválida');
        if (!modified || typeof modified !== 'string') throw new Error('Fecha inválida');
        if (!thumbnail || !thumbnail.path || !thumbnail.extension) throw new Error('Thumbnail inválido');
        if (!resourceURI || typeof resourceURI !== 'string') throw new Error('URI inválido');
        if (!Array.isArray(comics)) throw new Error('Comics debe ser un array');

        // Asignación de propiedades
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#modified = modified;
        this.#thumbnail = thumbnail;
        this.#resourceURI = resourceURI;
        this.#comics = comics;
    }

    // Getters
    get id() { return this.#id; }
    get name() { return this.#name; }
    get description() { return this.#description; }
    get modified() { return this.#modified; }
    get resourceURI() { return this.#resourceURI; }
    get comics() { return [...this.#comics]; } // Retorna una copia para evitar modificaciones

    /**
     * Obtiene la URL completa del thumbnail
     * @returns {string} URL de la imagen
     */
    getThumbnailURL() {
        return `${this.#thumbnail.path}.${this.#thumbnail.extension}`;
    }
} 