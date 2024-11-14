/**
 * Clase Comic: Representa un cómic de Marvel
 */
class Comic {
    // Propiedades privadas
    #id;
    #title;
    #issueNumber;
    #description;
    #pageCount;
    #thumbnail;
    #price;
    #creators;
    #characters;

    /**
     * @param {number} id - ID único del cómic
     * @param {string} title - Título del cómic
     * @param {number} issueNumber - Número de la edición
     * @param {string} description - Descripción del cómic
     * @param {number} pageCount - Número de páginas
     * @param {Object} thumbnail - Objeto con path y extension
     * @param {number} price - Precio del cómic
     * @param {Array} creators - Lista de creadores
     * @param {Array} characters - Lista de personajes
     */
    constructor(id, title, issueNumber, description, pageCount, thumbnail, price, creators, characters) {
        // Validaciones básicas
        if (!id || typeof id !== 'number') throw new Error('ID inválido');
        if (!title || typeof title !== 'string') throw new Error('Título inválido');
        if (typeof issueNumber !== 'number') throw new Error('Número de edición inválido');
        if (!description || typeof description !== 'string') throw new Error('Descripción inválida');
        if (typeof pageCount !== 'number' || pageCount < 0) throw new Error('Número de páginas inválido');
        if (!thumbnail || !thumbnail.path || !thumbnail.extension) throw new Error('Thumbnail inválido');
        if (typeof price !== 'number' || price < 0) throw new Error('Precio inválido');
        if (!Array.isArray(creators)) throw new Error('Creadores debe ser un array');
        if (!Array.isArray(characters)) throw new Error('Personajes debe ser un array');

        // Asignación de propiedades
        this.#id = id;
        this.#title = title;
        this.#issueNumber = issueNumber;
        this.#description = description;
        this.#pageCount = pageCount;
        this.#thumbnail = thumbnail;
        this.#price = price;
        this.#creators = [...creators]; // Copia defensiva
        this.#characters = [...characters]; // Copia defensiva
    }

    // Getters
    get id() { return this.#id; }
    get title() { return this.#title; }
    get issueNumber() { return this.#issueNumber; }
    get description() { return this.#description; }
    get pageCount() { return this.#pageCount; }
    get price() { return this.#price; }
    get creators() { return [...this.#creators]; }
    get characters() { return [...this.#characters]; }

    /**
     * Obtiene la URL completa del thumbnail
     * @returns {string} URL de la imagen
     */
    getThumbnailURL() {
        return `${this.#thumbnail.path}.${this.#thumbnail.extension}`;
    }
} 