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
        this.updateToggleButton();
        this.loadInitialComics();
        this.isIndividualRemove = false;
        this.isRemoveAction = false;
        this.selectedComics = new Set();

        // Inicializar elementos del modal
        this.collectionModal = document.getElementById('collectionModal');
        this.closeModalBtn = document.getElementById('closeModal');
        this.collectionButtons = document.querySelectorAll('.collection-btn');

        // Event listeners para el modal
        this.closeModalBtn.addEventListener('click', () => this.closeCollectionModal());
        this.collectionButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleCollectionSelection(e));
        });
    },

    updateToggleButton() {
        const toggleBtn = document.getElementById('toggleDataBtn');
        if (Config.USE_MOCK_DATA) {
            toggleBtn.textContent = 'Usando Data Mockeada';
            toggleBtn.classList.add('mock');
        } else {
            toggleBtn.textContent = 'Usando Data de la API';
            toggleBtn.classList.remove('mock');
        }
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
        
        // Mostrar u ocultar paginación según la pestaña
        const pagination = document.querySelector('.pagination');
        pagination.style.display = tab === 'comics' ? 'flex' : 'none';
        
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
        const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';
        const isFavorite = this.favoritesManager.isFavorite(dataSource, null, comic.id);
    const isSelected = this.selectedComics.has(comic.id); // Agregar esta línea

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
        favoriteBtn.innerHTML = `<i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i> Añadir a Favoritos`;
        favoriteBtn.addEventListener('click', () => this.toggleIndividualFavorite(comic.id));
        cardInfo.appendChild(favoriteBtn);

        // **Nuevo: Botón de remover de favoritos**
        const removeFavoriteBtn = document.createElement('button');
        removeFavoriteBtn.className = `remove-favorite-btn`;
        removeFavoriteBtn.innerHTML = `<i class="fas fa-trash-alt"></i> Remover de Favoritos`;
        removeFavoriteBtn.addEventListener('click', () => this.removeIndividualFavorite(comic.id));
        cardInfo.appendChild(removeFavoriteBtn);

        card.appendChild(cardInfo);

        return card;
    },

    toggleIndividualFavorite(comicId) {
        this.tempComicId = comicId; // Almacenar temporalmente el ID del cómic
        this.openCollectionModal(true); // Indicar que es un favorito individual
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
        const selectedCount = actionsBar.querySelector('.selected-count');
    
        if (this.selectedComics.size > 0) {
            actionsBar.classList.add('visible');
            selectedCount.textContent = `${this.selectedComics.size} cómics seleccionados`;
        } else {
            actionsBar.classList.remove('visible');
            selectedCount.textContent = '0 cómics seleccionados';
        }
    },

    saveFavorites() {
        if (this.selectedComics.size > 0) {
            this.openCollectionModal();
        }
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
    
    async loadFavorites() {
        try {
            const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';
            const collections = this.favoritesManager.getAllFavorites(dataSource);
            let comicsData;
    
            if (dataSource === 'mock') {
                comicsData = mockComics.comics;
            } else {
                comicsData = await MarvelAPI.getAllComics();
            }
    
            const container = document.getElementById('comicsContainer');
            container.innerHTML = '';
    
            for (const [collectionName, favoriteIds] of Object.entries(collections)) {
                if (favoriteIds.length > 0) {
                    // Agregar encabezado de la colección
                    const header = document.createElement('h2');
                    header.textContent = `Favoritos de ${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}`;
                    header.className = 'collection-header';
                    container.appendChild(header);
    
                    // Filtrar cómics de la colección
                    const favorites = comicsData.filter(comic => favoriteIds.includes(comic.id));
    
                    // Renderizar cómics
                    favorites.forEach(comic => {
                        const comicElement = this.createComicElement(comic);
                        container.appendChild(comicElement);
                    });
                }
            }
    
            // Ocultar paginación en la pestaña de favoritos
            document.querySelector('.pagination').style.display = 'none';
        } catch (error) {
            console.error('Error loading favorites:', error);
            alert('Hubo un error al cargar los favoritos.');
        }
    },

    toggleDataSource() {
        Config.USE_MOCK_DATA = !Config.USE_MOCK_DATA;
        console.log(`USE_MOCK_DATA is now: ${Config.USE_MOCK_DATA}`);
        this.loadComics();
    
        const toggleBtn = document.getElementById('toggleDataBtn');
        if (Config.USE_MOCK_DATA) {
            toggleBtn.textContent = 'Usando Data Mockeada';
            toggleBtn.classList.add('mock');
        } else {
            toggleBtn.textContent = 'Usando Data de la API';
            toggleBtn.classList.remove('mock');
        }
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
    },

    openCollectionModal(isIndividual = false) {
        this.isIndividualFavorite = isIndividual;

        const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';

        if (isIndividual && this.tempComicId !== null) {
            // Deshabilitar colecciones en las que ya está el cómic
            this.collectionButtons.forEach(button => {
                const collection = button.dataset.collection;
                const isAlreadyFavorite = this.favoritesManager.isFavorite(dataSource, collection, this.tempComicId);
                button.disabled = isAlreadyFavorite;
            });
        } else {
            // Habilitar todas las colecciones
            this.collectionButtons.forEach(button => {
                button.disabled = false;
            });
        }

        this.collectionModal.style.display = 'block';
    },

    closeCollectionModal() {
        // Restablecer variables temporales
        this.tempComicId = null;
        this.isIndividualFavorite = false;
        this.isIndividualRemove = false;
        this.isRemoveAction = false;

        // Habilitar todos los botones de colección
        this.collectionButtons.forEach(button => {
            button.disabled = false;
        });

        // Restablecer el título del modal
        this.collectionModal.querySelector('h2').textContent = 'Selecciona una colección';

        this.collectionModal.style.display = 'none';
    },

    handleCollectionSelection(e) {
        const collection = e.target.dataset.collection;
        const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';

        if (this.isIndividualFavorite && this.tempComicId !== null) {
            // Agregar favorito individual
            this.favoritesManager.addFavorite(dataSource, collection, this.tempComicId);

            // Actualizar interfaz
            this.updateFavoriteButtons(this.tempComicId);

            // Resetear variables temporales
            this.tempComicId = null;
            this.isIndividualFavorite = false;

        } else if (this.isIndividualRemove && this.tempComicId !== null) {
            // Remover favorito individual
            this.favoritesManager.removeFavorite(dataSource, collection, this.tempComicId);

            // Actualizar interfaz
            this.updateFavoriteButtons(this.tempComicId);

            // Resetear variables temporales
            this.tempComicId = null;
            this.isIndividualRemove = false;

        } else if (this.selectedComics.size > 0) {
            // Agregar o remover favoritos múltiples
            const selectedComicsList = this.getSelectedComics();

            selectedComicsList.forEach(comic => {
                if (this.isRemoveAction) {
                    this.favoritesManager.removeFavorite(dataSource, collection, comic.id);
                } else {
                    this.favoritesManager.addFavorite(dataSource, collection, comic.id);
                }

                // Actualizar estado de la tarjeta
                const card = document.querySelector(`.card[data-id="${comic.id}"]`);
                const checkbox = card.querySelector('.card-checkbox');
                checkbox.checked = false;
                card.classList.remove('selected');

                // Actualizar botones
                this.updateFavoriteButtons(comic.id);
            });

            this.selectedComics.clear();
            this.updateActionsBar();
            this.isRemoveAction = false; // Resetear indicador
        }

        this.closeCollectionModal();
    },

    removeIndividualFavorite(comicId) {
        this.tempComicId = comicId; // Almacenar temporalmente el ID del cómic
        this.openRemoveCollectionModal(true); // Indicar que es una acción individual
    },

    openRemoveCollectionModal(isIndividual = false) {
        this.isIndividualRemove = isIndividual;
        const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';
    
        if (isIndividual && this.tempComicId !== null) {
            // Deshabilitar colecciones en las que no está el cómic
            this.collectionButtons.forEach(button => {
                const collection = button.dataset.collection;
                const isInCollection = this.favoritesManager.isFavorite(dataSource, collection, this.tempComicId);
                button.disabled = !isInCollection;
            });
        } else {
            // Habilitar todas las colecciones
            this.collectionButtons.forEach(button => {
                button.disabled = false;
            });
        }
    
        // Cambiar el texto del modal para indicar que es una acción de remover
        this.collectionModal.querySelector('h2').textContent = 'Selecciona una colección para remover';
        this.collectionModal.style.display = 'block';
    },

    updateFavoriteButtons(comicId) {
        const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';
        const isFavorite = this.favoritesManager.isFavorite(dataSource, null, comicId);
    
        const card = document.querySelector(`.card[data-id="${comicId}"]`);
    
        if (card) {
            const favoriteBtn = card.querySelector('.add-favorite-btn');
            const removeFavoriteBtn = card.querySelector('.remove-favorite-btn');
    
            if (isFavorite) {
                favoriteBtn.classList.add('added');
                favoriteBtn.innerHTML = `<i class="fas fa-heart"></i> Añadido a Favoritos`;
            } else {
                favoriteBtn.classList.remove('added');
                favoriteBtn.innerHTML = `<i class="far fa-heart"></i> Añadir a Favoritos`;
            }
        } else {
            console.warn(`No se encontró la tarjeta con data-id="${comicId}".`);
        }
    },

    removeFavorites() {
        if (this.selectedComics.size > 0) {
            this.isRemoveAction = true;
            this.openRemoveCollectionModal(false); // Acción múltiple
        }
    }
};

document.addEventListener('DOMContentLoaded', () => UI.init());

