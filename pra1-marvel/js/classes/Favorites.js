/**
 * Clase Favorites: Gestiona una colección de cómics favoritos
 */
class Favorites {
    // Propiedad privada para almacenar los cómics
    #favoriteComics;

    constructor() {
        this.#favoriteComics = [];
    }

    /**
     * Requisito 3: Agrega un cómic a la lista de favoritos
     * @param {Comic} comic - Cómic a agregar
     * @throws {Error} Si el parámetro no es una instancia de Comic
     */
    addFavoriteComic(comic) {
        if (!(comic instanceof Comic)) {
            throw new Error("Solo se pueden agregar instancias de Comic");
        }
        if (!this.#favoriteComics.some(c => c.id === comic.id)) {
            this.#favoriteComics.push(comic);
        }
    }

    /**
     * Requisito 3: Elimina un cómic de favoritos por su ID
     * @param {number} comicId - ID del cómic a eliminar
     */
    removeFavoriteComic(comicId) {
        if (typeof comicId !== 'number') {
            throw new Error("El ID debe ser un número");
        }
        this.#favoriteComics = this.#favoriteComics.filter(comic => comic.id !== comicId);
    }

    /**
     * Requisito 3: Muestra todos los cómics en favoritos
     * @returns {Array<{title: string, price: number}>} Array con información básica de los cómics
     */
    showFavorites() {
        return this.#favoriteComics.map(comic => ({
            title: comic.title,
            price: comic.price
        }));
    }

    /**
     * Requisito 4: Busca un cómic por ID de forma recursiva
     * @param {number} comicId - ID del cómic a buscar
     * @param {Array<Comic>} comics - Array donde buscar (opcional)
     * @returns {Comic|null} Cómic encontrado o null
     */
    findComicById(comicId, comics = this.#favoriteComics) {
        if (typeof comicId !== 'number') {
            throw new Error("El ID debe ser un número");
        }
        if (comics.length === 0) return null;
        if (comics[0].id === comicId) return comics[0];
        return this.findComicById(comicId, comics.slice(1));
    }

    /**
     * Requisito 5: Calcula el precio promedio usando reduce
     * @returns {number} Precio promedio de los cómics
     */
    calculateAveragePrice() {
        if (this.#favoriteComics.length === 0) return 0;
        const total = this.#favoriteComics.reduce((sum, comic) => sum + comic.price, 0);
        return total / this.#favoriteComics.length;
    }

    /**
     * Requisito 6: Agrega múltiples cómics usando el operador rest
     * @param {...Comic} comics - Lista de cómics a agregar
     * @throws {Error} Si algún parámetro no es una instancia de Comic
     */
    addMultipleFavorites(...comics) {
        if (!comics.every(comic => comic instanceof Comic)) {
            throw new Error("Todos los elementos deben ser instancias de Comic");
        }
        comics.forEach(comic => this.addFavoriteComic(comic));
    }

    /**
     * Requisito 7: Crea una copia usando el operador spread
     * @returns {Array<Comic>} Copia de la colección de favoritos
     */
    copyFavorites() {
        return [...this.#favoriteComics];
    }

    /**
     * Requisito 8: Obtiene títulos de cómics asequibles usando map y filter
     * @param {number} maxPrice - Precio máximo a considerar
     * @returns {Array<string>} Títulos de los cómics que cumplen el criterio
     */
    getAffordableComicTitles(maxPrice) {
        if (typeof maxPrice !== 'number' || maxPrice < 0) {
            throw new Error("El precio máximo debe ser un número positivo");
        }
        return this.#favoriteComics
            .filter(comic => comic.price <= maxPrice)
            .map(comic => comic.title);
    }
} 