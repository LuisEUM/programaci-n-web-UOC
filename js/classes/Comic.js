class Comic {
    #id;
    #title;
    #issueNumber;
    #description;
    #pageCount;
    #thumbnail;
    #price;
    #creators;
    #characters;

    constructor(id, title, issueNumber, description, pageCount, thumbnail, price, creators, characters) {
        // Validaciones
        if (!id || typeof id !== 'number') throw new Error('ID inválido');
        if (!title || typeof title !== 'string') throw new Error('Título inválido');
        if (typeof issueNumber !== 'number') throw new Error('Número de edición inválido');
        if (!description || typeof description !== 'string') throw new Error('Descripción inválida');
        if (typeof pageCount !== 'number' || pageCount < 0) throw new Error('Número de páginas inválido');
        if (!thumbnail || !thumbnail.path || !thumbnail.extension) throw new Error('Thumbnail inválido');
        if (typeof price !== 'number' || price < 0) throw new Error('Precio inválido');
        if (!Array.isArray(creators)) throw new Error('Creadores debe ser un array');
        if (!Array.isArray(characters)) throw new Error('Personajes debe ser un array');

        // Asignación de propiedades privadas
        this.#id = id;
        this.#title = title;
        this.#issueNumber = issueNumber;
        this.#description = description;
        this.#pageCount = pageCount;
        this.#thumbnail = thumbnail;
        this.#price = price;
        this.#creators = creators;
        this.#characters = characters;
    }

    // Getters
    get id() { return this.#id; }
    get title() { return this.#title; }
    get issueNumber() { return this.#issueNumber; }
    get description() { return this.#description; }
    get pageCount() { return this.#pageCount; }
    get thumbnail() { return this.#thumbnail; }
    get price() { return this.#price; }
    get creators() { return [...this.#creators]; }
    get characters() { return [...this.#characters]; }

    // Setters
    set price(newPrice) {
        if (typeof newPrice !== 'number' || newPrice < 0) throw new Error('Precio inválido');
        this.#price = newPrice;
    }

    // Métodos
    getThumbnailURL() {
        return `${this.#thumbnail.path}.${this.#thumbnail.extension}`;
    }

    static fromAPI(apiComic) {
        console.log('Raw API Comic:', apiComic); // Debug log

        // Si estamos en modo mock, los datos ya vienen en el formato correcto
        if (Config.USE_MOCK_DATA) {
            return new Comic(
                apiComic.id,
                apiComic.title,
                apiComic.issueNumber,
                apiComic.description || "No description available",
                apiComic.pageCount,
                apiComic.thumbnail,
                apiComic.price || 0,
                apiComic.creators || [],
                apiComic.characters || []
            );
        }

        // Si son datos de la API, necesitamos transformarlos
        return new Comic(
            apiComic.id,
            apiComic.title,
            apiComic.issueNumber,
            apiComic.description || "No description available",
            apiComic.pageCount,
            apiComic.thumbnail,
            apiComic.prices?.[0]?.price || 0,
            apiComic.creators?.items?.map(creator => creator.name) || [],
            apiComic.characters?.items?.map(char => char.name) || []
        );
    }
} 