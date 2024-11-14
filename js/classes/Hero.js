/**
 * Representa un héroe de Marvel con encapsulación completa de sus propiedades
 * Implementa validación de datos y protección contra modificaciones accidentales
 */
class Hero {
    // Propiedades privadas usando # para encapsulación
    #id;
    #name;
    #description;
    #modified;
    #thumbnail;
    #resourceURI;
    #comics;

    /**
     * @throws {Error} Si algún parámetro requerido es inválido o está ausente
     */
    constructor(id, name, description, modified, thumbnail, resourceURI, comics) {
        // Validaciones estrictas para garantizar la integridad de los datos
        if (!id || typeof id !== 'number') throw new Error('ID de héroe inválido');
        if (!name || typeof name !== 'string') throw new Error('Nombre de héroe inválido');
        if (!description || typeof description !== 'string') throw new Error('Descripción de héroe inválida');
        if (!modified || typeof modified !== 'string') throw new Error('Fecha de modificación inválida');
        if (!thumbnail || !thumbnail.path || !thumbnail.extension) throw new Error('Thumbnail de héroe inválido');
        if (!resourceURI || typeof resourceURI !== 'string') throw new Error('ResourceURI inválido');
        if (!Array.isArray(comics)) throw new Error('Comics debe ser un array');

        // Inicialización de propiedades privadas
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#modified = modified;
        this.#thumbnail = thumbnail;
        this.#resourceURI = resourceURI;
        this.#comics = comics;
    }

    // Getters para acceso controlado a las propiedades privadas
    get id() { return this.#id; }
    get name() { return this.#name; }
    get description() { return this.#description; }
    get modified() { return this.#modified; }
    get thumbnail() { return this.#thumbnail; }
    get resourceURI() { return this.#resourceURI; }
    // Retorna una copia del array para prevenir modificaciones externas
    get comics() { return [...this.#comics]; }

    /**
     * Genera la URL completa de la imagen del héroe
     * Combina path y extension del thumbnail según el formato de la API
     */
    getThumbnailURL() {
        return `${this.#thumbnail.path}.${this.#thumbnail.extension}`;
    }

    /**
     * Crea una instancia de Hero a partir de datos de la API
     * Maneja valores faltantes o nulos con valores por defecto
     */
    static fromAPI(apiHero) {
        return new Hero(
            apiHero.id,
            apiHero.name,
            apiHero.description || "No description available",
            apiHero.modified,
            apiHero.thumbnail,
            apiHero.resourceURI,
            apiHero.comics?.items?.map(comic => comic.name) || []
        );
    }
} 