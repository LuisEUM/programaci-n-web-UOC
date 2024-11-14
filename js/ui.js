/**
 * Objeto UI que gestiona la interfaz de usuario y la interacción con los cómics
 * @namespace
 */
const UI = {
    offset: 0,
    currentSearchTerm: '',
    currentSort: 'default',
    totalPages: 0,
    currentPage: 1,
    favoritesManager: new Favorites(), // Crear una instancia de Favorites

    /**
     * Inicializa la interfaz de usuario
     * @memberof UI
     */
    init() {
        this.bindEvents();
        this.loadInitialComics();
    },

    /**
     * Vincula los eventos de la interfaz de usuario
     * @memberof UI
     */
    bindEvents() {
        document.getElementById('searchInput').addEventListener('input', () => this.handleSearch());
        document.getElementById('sortSelect').addEventListener('change', (e) => this.handleSort(e));
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabChange(e));
        });
        document.getElementById('prevPage').addEventListener('click', () => this.handlePrevPage());
        document.getElementById('nextPage').addEventListener('click', () => this.handleNextPage());
    },

    /**
     * Maneja el evento de búsqueda
     * @memberof UI
     */
    handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.trim();
        this.currentSearchTerm = searchTerm;
        this.offset = 0;
        this.currentPage = 1;
        this.loadComics();
    },

    /**
     * Maneja el evento de ordenamiento
     * @param {Event} e - Evento de cambio
     * @memberof UI
     */
    handleSort(e) {
        this.currentSort = e.target.value;
        this.loadComics(true);
    },

    /**
     * Maneja el cambio de pestañas
     * @param {Event} e - Evento de clic
     * @memberof UI
     */
    handleTabChange(e) {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        
        const tab = e.target.dataset.tab;
        switch(tab) {
            case 'random':
                this.loadRandomComics();
                break;
            case 'favorites':
                this.loadFavorites();
                break;
            default:
                this.loadComics();
        }
    },

    /**
     * Maneja el evento de página anterior
     * @memberof UI
     */
    handlePrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.offset = (this.currentPage - 1) * Config.LIMIT;
            this.loadComics();
        }
    },

    /**
     * Maneja el evento de página siguiente
     * @memberof UI
     */
    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.offset = (this.currentPage - 1) * Config.LIMIT;
            this.loadComics();
        }
    },

    /**
     * Actualiza la paginación
     * @param {number} total - Total de cómics
     * @memberof UI
     */
    updatePagination(total) {
        this.totalPages = Math.ceil(total / Config.LIMIT);
        document.getElementById('pageInfo').textContent = `${this.currentPage} of ${this.totalPages}`;
        
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.totalPages;
    },

    /**
     * Ordena los cómics según el criterio actual
     * @param {Array} comics - Lista de cómics
     * @returns {Array} Lista de cómics ordenada
     * @memberof UI
     */
    sortComics(comics) {
        switch(this.currentSort) {
            case 'titleAsc':
                return comics.sort((a, b) => a.title.localeCompare(b.title));
            case 'titleDesc':
                return comics.sort((a, b) => b.title.localeCompare(a.title));
            case 'priceAsc':
                return comics.sort((a, b) => a.price - b.price);
            case 'priceDesc':
                return comics.sort((a, b) => b.price - a.price);
            default:
                return comics;
        }
    },

    /**
     * Carga los cómics iniciales
     * @memberof UI
     */
    async loadInitialComics() {
        this.loadComics();
    },

    /**
     * Carga cómics aleatorios
     * @memberof UI
     */
    async loadRandomComics() {
        try {
            const comics = await MarvelAPI.getComics({ offset: Math.floor(Math.random() * 1000) });
            this.renderComics(comics);
        } catch (error) {
            console.error('Error loading random comics:', error);
            this.showError('Error al cargar cómics aleatorios');
        }
    },

    /**
     * Carga los cómics según los parámetros actuales
     * @param {boolean} [reset=true] - Indica si se debe reiniciar la lista de cómics
     * @memberof UI
     */
    async loadComics(reset = true) {
        try {
            const response = await MarvelAPI.getComics({
                offset: this.offset,
                titleStartsWith: this.currentSearchTerm,
                limit: Config.LIMIT
            });
            
            const sortedComics = this.sortComics(response.results);
            this.updatePagination(response.total);
            this.renderComics(sortedComics);
        } catch (error) {
            console.error('Error loading comics:', error);
            this.showError('Error al cargar los cómics');
        }
    },

    /**
     * Renderiza los cómics en el contenedor
     * @param {Array} comics - Lista de cómics
     * @memberof UI
     */
    renderComics(comics) {
        const container = document.getElementById('comicsContainer');
        container.innerHTML = '';
        
        if (comics.length === 0) {
            container.innerHTML = '<div class="no-results">No se encontraron comics.</div>';
            return;
        }

        comics.forEach(comic => {
            const comicElement = this.createComicElement(comic);
            container.appendChild(comicElement);
        });
    },

    /**
     * Crea un elemento HTML para un cómic
     * @param {Object} comic - Datos del cómic
     * @returns {HTMLElement} Elemento HTML del cómic
     * @memberof UI
     */
    createComicElement(comic) {
        const div = document.createElement('div');
        div.className = 'comic-card';
        div.innerHTML = `
            <img class="comic-image" 
                src="${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}" 
                alt="${comic.title}"
                loading="lazy">
            <div class="comic-info">
                <h3 class="comic-title">${comic.title}</h3>
                <p class="comic-description">${Utils.truncateText(comic.description || 'No hay descripción disponible.', 100)}</p>
                <p class="comic-price">${Utils.formatPrice(comic.price)}</p>
                <button class="add-favorite-btn">
                    <i class="far fa-heart"></i>
                    Add to Favorites
                </button>
            </div>
        `;
        return div;
    },

    /**
     * Muestra un mensaje de error en el contenedor de cómics
     * @param {string} message - Mensaje de error
     * @memberof UI
     */
    showError(message) {
        const container = document.getElementById('comicsContainer');
        container.innerHTML = `
            <div class="error-message">
                ${message}<br>Por favor, intenta de nuevo.
            </div>`;
    },

    /**
     * Carga y renderiza los cómics favoritos
     * @memberof UI
     */
    loadFavorites() {
        const favorites = this.favoritesManager.showFavorites();
        this.renderComics(favorites);
    }
};

// Inicializa la interfaz de usuario cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => UI.init());