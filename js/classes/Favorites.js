/**
 * Clase Favorites que gestiona una colección de cómics favoritos
 * Implementa las operaciones básicas de gestión de una lista de favoritos
 * @class
 */
class Favorites {
    // Campos privados
    #favorites;
    #favoriteComics;

    // Propiedades estáticas
    static DEFAULT_COLLECTIONS = ["wishlist", "toread", "reading", "read", "favorites"];
    static COLLECTION_NAMES = {
        wishlist: "Lista de Deseos",
        toread: "Por Leer",
        reading: "Leyendo",
        read: "Leídos",
        favorites: "Mis Favoritos"
    };
    static COPY_SUFFIX = " copia";

    constructor() {
        // Inicializar las estructuras de datos
        this.#favoriteComics = [];
        this.#favorites = {
            mock: {},
            api: {}
        };
        
        // Inicializar las colecciones por defecto
        this.#initializeDefaultCollections();
        
        // Cargar favoritos guardados
        const savedFavorites = this.loadFavorites();
        if (savedFavorites) {
            this.#favorites = savedFavorites;
        }
    }

    #initializeDefaultCollections() {
        ['mock', 'api'].forEach(dataSource => {
            Favorites.DEFAULT_COLLECTIONS.forEach(collection => {
                if (!this.#favorites[dataSource][collection]) {
                    this.#favorites[dataSource][collection] = [];
                }
            });
        });
        this.saveFavorites();
    }

    #validateDataSource(dataSource) {
        if (!["mock", "api"].includes(dataSource)) {
            throw new Error('Invalid data source');
        }
    }

    #validateCollection(collection) {
        if (!Favorites.DEFAULT_COLLECTIONS.includes(collection)) {
            throw new Error('Invalid collection');
        }
    }

    // Métodos públicos
    addFavorite(dataSource, collection, comicId) {
        this.#validateDataSource(dataSource);
        this.#validateCollection(collection);

        if (!this.#favorites[dataSource][collection].includes(comicId)) {
            this.#favorites[dataSource][collection].push(comicId);
            this.saveFavorites();
        }
    }

    removeFavorite(dataSource, collection, comicId) {
        this.#validateDataSource(dataSource);
        this.#validateCollection(collection);

        this.#favorites[dataSource][collection] = 
            this.#favorites[dataSource][collection].filter(id => id !== comicId);
        this.saveFavorites();
    }

    isFavorite(dataSource, collection, comicId) {
        this.#validateDataSource(dataSource);

        if (!collection) {
            return Object.values(this.#favorites[dataSource]).some(
                collectionIds => collectionIds.includes(comicId)
            );
        }

        this.#validateCollection(collection);
        return this.#favorites[dataSource][collection].includes(comicId);
    }

    getAllFavorites(dataSource) {
        this.#validateDataSource(dataSource);
        return this.#favorites[dataSource];
    }

    getCollectionDisplayName(collection) {
        return Favorites.COLLECTION_NAMES[collection] || collection;
    }

    saveFavorites() {
        localStorage.setItem("favorites", JSON.stringify(this.#favorites));
    }

    loadFavorites() {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
            try {
                const parsed = JSON.parse(savedFavorites);
                if (parsed.mock && parsed.api) {
                    return parsed;
                }
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        }
        return null;
    }

    // Métodos requeridos por la práctica
    addFavoriteComic(comic) {
        if (!(comic instanceof Comic)) {
            throw new Error('Solo se pueden agregar instancias de Comic');
        }
        if (!this.#favorites.some(c => c.id === comic.id)) {
            this.#favorites.push(comic);
        }
    }

    addMultipleFavorites(...comics) {
        comics.forEach(comic => this.addFavoriteComic(comic));
    }

    copyFavorites() {
        return [...this.#favorites];
    }

    findComicById(comicId, comics = this.#favorites) {
        if (comics.length === 0) return null;
        if (comics[0].id === comicId) return comics[0];
        return this.findComicById(comicId, comics.slice(1));
    }

    calculateAveragePrice() {
        if (this.#favorites.length === 0) return 0;
        const total = this.#favorites.reduce((sum, comic) => sum + comic.price, 0);
        return total / this.#favorites.length;
    }

    getAffordableComicTitles(maxPrice) {
        return this.#favorites
            .filter(comic => comic.price <= maxPrice)
            .map(comic => comic.title);
    }

    // Método requerido por la práctica
    showFavorites() {
        return this.#favorites.map(comic => ({
            title: comic.title,
            price: comic.price
        }));
    }
}
