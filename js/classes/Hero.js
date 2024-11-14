class Hero {
    #id;
    #name;
    #description;
    #modified;
    #thumbnail;
    #resourceURI;
    #comics;

    constructor(id, name, description, modified, thumbnail, resourceURI, comics) {
        // Validaciones
        if (!id || typeof id !== 'number') throw new Error('ID de héroe inválido');
        if (!name || typeof name !== 'string') throw new Error('Nombre de héroe inválido');
        if (!description || typeof description !== 'string') throw new Error('Descripción de héroe inválida');
        if (!modified || typeof modified !== 'string') throw new Error('Fecha de modificación inválida');
        if (!thumbnail || !thumbnail.path || !thumbnail.extension) throw new Error('Thumbnail de héroe inválido');
        if (!resourceURI || typeof resourceURI !== 'string') throw new Error('ResourceURI inválido');
        if (!Array.isArray(comics)) throw new Error('Comics debe ser un array');

        // Asignación de propiedades privadas
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
    get thumbnail() { return this.#thumbnail; }
    get resourceURI() { return this.#resourceURI; }
    get comics() { return [...this.#comics]; }

    // Métodos
    getThumbnailURL() {
        return `${this.#thumbnail.path}.${this.#thumbnail.extension}`;
    }

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