class CollectionsTabs {
    constructor(container, favoritesManager) {
        this.container = container;
        this.favoritesManager = favoritesManager;
        this.collections = Favorites.DEFAULT_COLLECTIONS;
        this.activeCollection = this.collections[0];
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.showCollection(this.activeCollection);
    }

    render() {
        // Crear los tabs
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'collections-tabs';
        
        this.collections.forEach(collection => {
            const tab = document.createElement('button');
            tab.className = `tab-btn ${collection === this.activeCollection ? 'active' : ''}`;
            tab.dataset.collection = collection;
            tab.textContent = this.favoritesManager.getCollectionDisplayName(collection);
            tabsContainer.appendChild(tab);
        });

        // Crear el contenedor para las cartas
        const contentContainer = document.createElement('div');
        contentContainer.className = 'collections-content';
        contentContainer.id = 'collectionsContent';

        // Limpiar y agregar los nuevos elementos
        this.container.innerHTML = '';
        this.container.appendChild(tabsContainer);
        this.container.appendChild(contentContainer);
    }

    bindEvents() {
        const tabs = this.container.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Actualizar clases activas
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');

                // Mostrar la colección seleccionada
                const collection = e.target.dataset.collection;
                this.showCollection(collection);
            });
        });
    }

    async showCollection(collection) {
        const contentContainer = document.getElementById('collectionsContent');
        contentContainer.innerHTML = '';

        const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';
        const favorites = this.favoritesManager.getAllFavorites(dataSource)[collection] || [];

        if (favorites.length === 0) {
            contentContainer.innerHTML = `
                <div class="no-results">
                    No hay cómics en la colección "${this.favoritesManager.getCollectionDisplayName(collection)}"
                </div>
            `;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'comics-grid';

        // Cargar y mostrar cada cómic
        for (const comicId of favorites) {
            try {
                const comic = await DataService.fetchItemById('comics', comicId);
                if (comic) {
                    const cardElement = Card.createBasicCard(
                        comic,
                        {
                            showId: true,
                            showMetadata: true,
                            actions: [{
                                className: 'remove-favorite-btn',
                                icon: 'fas fa-trash-alt',
                                text: 'Remover de Colección',
                                onClick: () => this.removeFromCollection(collection, comicId)
                            }]
                        }
                    );
                    grid.appendChild(cardElement);
                }
            } catch (error) {
                console.error(`Error loading comic ${comicId}:`, error);
            }
        }

        contentContainer.appendChild(grid);
    }

    removeFromCollection(collection, comicId) {
        const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';
        this.favoritesManager.removeFavorite(dataSource, collection, comicId);
        this.showCollection(collection); // Actualizar la vista
    }
} 