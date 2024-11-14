/**
 * Objeto UI que gestiona la interfaz de usuario y la interacción con los cómics
 * @namespace
 */
const UI = {
    offset: 0,
    currentSearchTerm: '',
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
        document.getElementById('searchInput').addEventListener('keydown', (e) => this.handleSearch(e));
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabChange(e));
        });
        document.getElementById('prevPage').addEventListener('click', () => this.handlePrevPage());
        document.getElementById('nextPage').addEventListener('click', () => this.handleNextPage());
        document.getElementById('toggleDataBtn').addEventListener('click', () => this.toggleDataSource()); // Nuevo event listener
    },

    /**
     * Maneja el evento de búsqueda
     * @memberof UI
     */
    handleSearch(e) {
        if (e.key === 'Enter') {
            const searchTerm = document.getElementById('searchInput').value.trim();
            this.currentSearchTerm = searchTerm;
            this.offset = 0;
            this.currentPage = 1;
            this.loadComics();
        }
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
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
        searchSection.style.display = tab === 'comics' ? 'flex' : 'none';
    }
    
    switch(tab) {
        case 'random':
            this.loadRandomComics();
            break;
        case 'favorites':
            this.loadFavorites();
            break;
        case 'heroes':
            this.loadHeroes();
            break;
        case 'comics':
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
            
            console.log(response); // Agregar console.log para ver el objeto que viene de la API
            this.updatePagination(response.total);
            this.renderComics(response.results);
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
        
        // Crear la URL de la imagen con el modificador de portrait_xlarge
        const imageUrl = `${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}`;
        
        div.innerHTML = `
            <img class="comic-image" 
                src="${imageUrl}" 
                alt="${comic.title}"
                loading="lazy"
                onerror="this.src='https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_xlarge.jpg'">
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
    },

    /**
     * Alterna la fuente de datos entre mockeada y API
     * @memberof UI
     */
    toggleDataSource() {
        Config.USE_MOCK_DATA = !Config.USE_MOCK_DATA;
        console.log(`USE_MOCK_DATA is now: ${Config.USE_MOCK_DATA}`); // Añadir un log para verificar el cambio
        this.loadComics();
    },

    /**
     * Carga y renderiza los héroes
     * @memberof UI
     */
    async loadHeroes() {
        try {
            const heroes = await MarvelAPI.getHeroes(); // Asegúrate de tener esta función en MarvelAPI
            this.renderHeroes(heroes);
        } catch (error) {
            console.error('Error loading heroes:', error);
            this.showError('Error al cargar héroes');
        }
    },

    /**
     * Renderiza los héroes en el contenedor
     * @param {Array} heroes - Lista de héroes
     * @memberof UI
     */
    renderHeroes(heroes) {
        const container = document.getElementById('comicsContainer');
        container.innerHTML = '';
        
        if (heroes.length === 0) {
            container.innerHTML = '<div class="no-results">No se encontraron héroes.</div>';
            return;
        }

        heroes.forEach(hero => {
            const heroElement = this.createHeroElement(hero);
            container.appendChild(heroElement);
        });
    },

    /**
     * Crea un elemento HTML para un héroe
     * @param {Object} hero - Datos del héroe
     * @returns {HTMLElement} Elemento HTML del héroe
     * @memberof UI
     */
    createHeroElement(hero) {
        const div = document.createElement('div');
        div.className = 'hero-card';
        
        const imageUrl = `${hero.thumbnail.path}/portrait_xlarge.${hero.thumbnail.extension}`;
        
        div.innerHTML = `
            <img class="hero-image" 
                src="${imageUrl}" 
                alt="${hero.name}"
                loading="lazy"
                onerror="this.src='https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_xlarge.jpg'">
            <div class="hero-info">
                <h3 class="hero-name">${hero.name}</h3>
                <p class="hero-description">${Utils.truncateText(hero.description || 'No description available.', 150)}</p>
            </div>
        `;
        return div;
    },
};

// Inicializa la interfaz de usuario cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => UI.init());