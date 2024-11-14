/**
 * Clase Thumbnail que representa la imagen de un cómic o héroe
 * @class
 */
class Thumbnail {
    /**
     * Crea una instancia de Thumbnail
     * @param {string} path - Ruta base de la imagen
     * @param {string} extension - Extensión del archivo de imagen
     */
    constructor(path, extension) {
        this.path = path;
        this.extension = extension;
    }
}

/**
 * Clase Comic que representa un cómic de Marvel
 * @class
 */
class Comic {
    /**
     * Crea una instancia de Comic
     * @param {number} id - Identificador único del cómic
     * @param {string} title - Título del cómic
     * @param {number} issueNumber - Número de la edición del cómic
     * @param {string} description - Descripción del cómic
     * @param {number} pageCount - Número de páginas del cómic
     * @param {Object} thumbnail - Objeto con información de la imagen
     * @param {number} price - Precio del cómic
     * @param {Array<string>} creators - Lista de creadores del cómic
     * @param {Array<string>} characters - Lista de personajes que aparecen
     */
    constructor(id, title, issueNumber, description, pageCount, thumbnail, price, creators, characters) {
        // Validaciones básicas de los parámetros
        if (!id || typeof id !== 'number') throw new Error('ID inválido');
        if (!title || typeof title !== 'string') throw new Error('Título inválido');
        if (typeof issueNumber !== 'number') throw new Error('Número de edición inválido');
        if (!description || typeof description !== 'string') throw new Error('Descripción inválida');
        if (typeof pageCount !== 'number' || pageCount <= 0) throw new Error('Número de páginas inválido');
        if (!thumbnail || !thumbnail.path || !thumbnail.extension) throw new Error('Thumbnail inválido');
        if (typeof price !== 'number' || price < 0) throw new Error('Precio inválido');
        if (!Array.isArray(creators)) throw new Error('Creadores debe ser un array');
        if (!Array.isArray(characters)) throw new Error('Personajes debe ser un array');

        // Asignación de propiedades
        this.id = id;
        this.title = title;
        this.issueNumber = issueNumber;
        this.description = description;
        this.pageCount = pageCount;
        this.thumbnail = new Thumbnail(thumbnail.path, thumbnail.extension);
        this.price = price;
        this.creators = creators;
        this.characters = characters;
    }

    /**
     * Obtiene la URL completa de la imagen del cómic
     * @returns {string} URL completa de la imagen
     */
    getThumbnailURL() {
        return `${this.thumbnail.path}.${this.thumbnail.extension}`;
    }
}

/**
 * Clase Heroe que representa a un héroe de Marvel
 * @class
 */
class Heroe {
    /**
     * Crea una instancia de Heroe
     * @param {number} id - Identificador único del héroe
     * @param {string} name - Nombre del héroe
     * @param {string} description - Descripción del héroe
     * @param {string} modified - Fecha de última modificación
     * @param {Object} thumbnail - Objeto con información de la imagen
     * @param {string} resourceURI - URI del héroe en la API de Marvel
     * @param {Array<string>} comics - Lista de cómics donde aparece el héroe
     */
    constructor(id, name, description, modified, thumbnail, resourceURI, comics) {
        // Validaciones básicas de los parámetros
        if (!id || typeof id !== 'number') throw new Error('ID de héroe inválido');
        if (!name || typeof name !== 'string') throw new Error('Nombre de héroe inválido');
        if (!description || typeof description !== 'string') throw new Error('Descripción de héroe inválida');
        if (!modified || typeof modified !== 'string') throw new Error('Fecha de modificación inválida');
        if (!thumbnail || !thumbnail.path || !thumbnail.extension) throw new Error('Thumbnail de héroe inválido');
        if (!resourceURI || typeof resourceURI !== 'string') throw new Error('ResourceURI inválido');
        if (!Array.isArray(comics)) throw new Error('Comics debe ser un array');

        // Asignación de propiedades
        this.id = id;
        this.name = name;
        this.description = description;
        this.modified = modified;
        this.thumbnail = new Thumbnail(thumbnail.path, thumbnail.extension);
        this.resourceURI = resourceURI;
        this.comics = comics;
    }

    /**
     * Obtiene la URL completa de la imagen del héroe
     * @returns {string} URL completa de la imagen del héroe
     */
    getThumbnailURL() {
        return `${this.thumbnail.path}.${this.thumbnail.extension}`;
    }
}

/**
 * Clase Favorites que gestiona una colección de cómics favoritos
 * Implementa las operaciones básicas de gestión de una lista de favoritos
 * @class
 */
class Favorites {
    constructor() {
        this.favorites = this.loadFavorites();
    }

    loadFavorites() {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            try {
                return JSON.parse(savedFavorites);
            } catch (e) {
                console.error('Error parsing favorites:', e);
                return this.getInitialFavoritesStructure();
            }
        }
        return this.getInitialFavoritesStructure();
    }

    getInitialFavoritesStructure() {
        return {
            mock: {
                general: [],
                reading: [],
                wishlist: []
            },
            api: {
                general: [],
                reading: [],
                wishlist: []
            }
        };
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    addFavorite(dataSource, collection, comicId) {
        if (!this.favorites[dataSource]) {
            this.favorites[dataSource] = {};
        }
        if (!this.favorites[dataSource][collection]) {
            this.favorites[dataSource][collection] = [];
        }
        if (!this.favorites[dataSource][collection].includes(comicId)) {
            this.favorites[dataSource][collection].push(comicId);
            this.saveFavorites();
        }
    }

    removeFavorite(dataSource, collection, comicId) {
        if (this.favorites[dataSource]?.[collection]) {
            this.favorites[dataSource][collection] = this.favorites[dataSource][collection].filter(id => id !== comicId);
            this.saveFavorites();
        }
    }

    getAllFavorites(dataSource) {
        return this.favorites[dataSource] || {};
    }

    isFavorite(dataSource, collection, comicId) {
        // Si no se especifica una colección, buscar en todas las colecciones
        if (!collection) {
            return Object.values(this.favorites[dataSource] || {}).some(
                collectionIds => collectionIds.includes(comicId)
            );
        }
        
        // Si se especifica una colección, buscar solo en esa colección
        return this.favorites[dataSource]?.[collection]?.includes(comicId) || false;
    }
}