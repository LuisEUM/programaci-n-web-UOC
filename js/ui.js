const UI = {
    offset: 0,
    currentSearchTerm: '',
    totalPages: 0,
    currentPage: 1,
    favoritesManager: new Favorites(),
    selectedComics: new Set(),
    currentComics: [],

    init() {
        this.bindEvents();
        this.loadInitialComics();
    },

    bindEvents() {
        document.getElementById('searchInput').addEventListener('keydown', (e) => this.handleSearch(e));
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabChange(e));
        });
        document.getElementById('prevPage').addEventListener('click', () => this.handlePrevPage());
        document.getElementById('nextPage').addEventListener('click', () => this.handleNextPage());
        document.getElementById('toggleDataBtn').addEventListener('click', () => this.toggleDataSource());
        document.querySelector('.save-favorites-btn').addEventListener('click', () => this.saveFavorites());
    },

    handleSearch(e) {
        if (e.key === 'Enter') {
            const searchTerm = document.getElementById('searchInput').value.trim();
            this.currentSearchTerm = searchTerm;
            this.offset = 0;
            this.currentPage = 1;
            this.loadComics();
        }
    },

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

    handlePrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.offset = (this.currentPage - 1) * Config.LIMIT;
            this.loadComics();
        }
    },

    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.offset = (this.currentPage - 1) * Config.LIMIT;
            this.loadComics();
        }
    },

    updatePagination(total) {
        this.totalPages = Math.ceil(total / Config.LIMIT);
        document.getElementById('pageInfo').textContent = `${this.currentPage} of ${this.totalPages}`;
        
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.totalPages;
    },

    async loadInitialComics() {
        this.loadComics();
    },

    async loadRandomComics() {
        try {
            const comics = await MarvelAPI.getComics({ offset: Math.floor(Math.random() * 1000) });
            this.renderComics(comics);
        } catch (error) {
            console.error('Error loading random comics:', error);
            this.showError('Error al cargar cómics aleatorios');
        }
    },

    async loadComics(reset = true) {
        try {
            const response = await MarvelAPI.getComics({
                offset: this.offset,
                titleStartsWith: this.currentSearchTerm,
                limit: Config.LIMIT
            });
            
            console.log(response); // Agregar console.log para ver el objeto que viene de la API
            this.currentComics = response.results;
            this.updatePagination(response.total);
            this.renderComics(response.results);
        } catch (error) {
            console.error('Error loading comics:', error);
            this.showError('Error al cargar los cómics');
        }
    },

    renderComics(comics) {
        this.currentComics = comics; // Almacenar los cómics actuales
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

    createComicElement(comic) {
        const isFavorite = this.favoritesManager.isFavorite(comic.id);
        const isSelected = this.selectedComics.has(comic.id);

        // Crear el contenedor principal
        const card = document.createElement('div');
        card.className = `card ${isSelected ? 'selected' : ''}`;
        card.setAttribute('data-id', comic.id);

        // ID del cómic
        const cardId = document.createElement('div');
        cardId.className = 'card-id';
        cardId.textContent = `ID: ${comic.id}`;
        card.appendChild(cardId);

        // Checkbox de selección
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'card-checkbox';
        checkbox.checked = isSelected;
        checkbox.addEventListener('change', () => this.toggleSelect(comic.id));
        card.appendChild(checkbox);

        const checkboxIndicator = document.createElement('div');
        checkboxIndicator.className = 'checkbox-indicator';
        card.appendChild(checkboxIndicator);

        // Imagen del cómic
        const img = document.createElement('img');
        img.src = `${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}`;
        img.alt = comic.title;
        img.className = 'card-image';
        img.loading = 'lazy';
        card.appendChild(img);

        // Información del cómic
        const cardInfo = document.createElement('div');
        cardInfo.className = 'card-info';

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = comic.title;
        cardInfo.appendChild(title);

        const metadata = document.createElement('div');
        metadata.className = 'card-metadata';
        metadata.innerHTML = `<span>Issue #${comic.issueNumber}</span><span>$${comic.price.toFixed(2)}</span>`;
        cardInfo.appendChild(metadata);

        const creators = document.createElement('div');
        creators.className = 'card-creators';
        creators.textContent = `Creadores: ${comic.creators.slice(0, 2).join(', ')}${comic.creators.length > 2 ? '...' : ''}`;
        cardInfo.appendChild(creators);

        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `add-favorite-btn ${isFavorite ? 'added' : ''}`;
        favoriteBtn.innerHTML = `<i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i> ${isFavorite ? 'Añadido a Favoritos' : 'Añadir a Favoritos'}`;
        favoriteBtn.addEventListener('click', () => this.toggleIndividualFavorite(comic.id, favoriteBtn));
        cardInfo.appendChild(favoriteBtn);

        card.appendChild(cardInfo);

        return card;
    },

    toggleIndividualFavorite(comicId, buttonElement) {
        if (this.favoritesManager.isFavorite(comicId)) {
            this.favoritesManager.removeFavorite(comicId);
            buttonElement.classList.remove('added');
            buttonElement.innerHTML = `<i class="far fa-heart"></i> Añadir a Favoritos`;
        } else {
            this.favoritesManager.addFavorite(comicId);
            buttonElement.classList.add('added');
            buttonElement.innerHTML = `<i class="fas fa-heart"></i> Añadido a Favoritos`;
        }
    },

    toggleFavorite(comicId) {
        this.favoritesManager.toggleFavorite(comicId);
        const card = document.querySelector(`.card[data-id="${comicId}"]`);
        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
        } else {
            card.classList.add('selected');
        }
    },

    getSelectedComics() {
        return this.currentComics.filter(comic => this.selectedComics.has(comic.id));
    },

    updateActionsBar() {
        const actionsBar = document.getElementById('actionsBar');
        const countDisplay = actionsBar.querySelector('.selected-count');
        const count = this.selectedComics.size;
        
        countDisplay.textContent = `${count} cómic${count !== 1 ? 's' : ''} seleccionado${count !== 1 ? 's' : ''}`;
        actionsBar.classList.toggle('visible', count > 0);
    },

    saveFavorites() {
        const selectedComicsList = this.getSelectedComics();
        this.favoritesManager.addMultipleFavorites(...selectedComicsList.map(comic => comic.id));

        // Actualizar botones en las tarjetas agregadas a favoritos
        selectedComicsList.forEach(comic => {
            const card = document.querySelector(`.card[data-id="${comic.id}"]`);
            const favoriteBtn = card.querySelector('.add-favorite-btn');
            favoriteBtn.classList.add('added');
            favoriteBtn.innerHTML = `<i class="fas fa-heart"></i> Añadido a Favoritos`;
        });

        this.selectedComics.clear();
        this.updateActionsBar();
    },

    toggleSelect(comicId) {
        const card = document.querySelector(`.card[data-id="${comicId}"]`);
        if (this.selectedComics.has(comicId)) {
            this.selectedComics.delete(comicId);
            card.classList.remove('selected');
        } else {
            this.selectedComics.add(comicId);
            card.classList.add('selected');
        }
        this.updateActionsBar();
    },

    showError(message) {
        const container = document.getElementById('comicsContainer');
        container.innerHTML = `
            <div class="error-message">
                ${message}<br>Por favor, intenta de nuevo.
            </div>`;
    },

    loadFavorites() {
        const favorites = this.favoritesManager.showFavorites();
        this.renderComics(favorites);
    },

    toggleDataSource() {
        Config.USE_MOCK_DATA = !Config.USE_MOCK_DATA;
        console.log(`USE_MOCK_DATA is now: ${Config.USE_MOCK_DATA}`);
        this.loadComics();
    },

    async loadHeroes() {
        try {
            const heroes = await MarvelAPI.getHeroes();
            this.renderHeroes(heroes);
        } catch (error) {
            console.error('Error loading heroes:', error);
            this.showError('Error al cargar héroes');
        }
    },

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
    }
};

document.addEventListener('DOMContentLoaded', () => UI.init());