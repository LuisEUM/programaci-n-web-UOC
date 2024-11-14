class CollectionModal {
    constructor() {
        this.modal = document.getElementById("collectionModal");
        this.closeModalBtn = document.getElementById("closeModal");
        this.collectionButtons = document.querySelectorAll(".collection-btn");
        this.init();
    }

    init() {
        this.closeModalBtn.addEventListener("click", () => this.close());
        this.collectionButtons.forEach((button) => {
            button.addEventListener("click", (e) => this.handleCollectionSelection(e));
        });
    }

    open(isIndividual = false, comicId = null) {
        this.modal.style.display = "block";
        
        // Solo verificar colecciones si es una selección individual
        if (isIndividual && comicId) {
            this.updateButtonStates(comicId);
        } else {
            // Para selección múltiple, habilitar todos los botones
            this.enableAllButtons();
        }
    }

    close() {
        this.modal.style.display = "none";
        // Resetear estado de los botones al cerrar
        this.enableAllButtons();
    }

    updateButtonStates(comicId) {
        const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
        
        this.collectionButtons.forEach(button => {
            const collection = button.dataset.collection;
            const isInCollection = UI.favoritesManager.isFavorite(dataSource, collection, comicId);
            button.disabled = isInCollection;
            
            // Actualizar el texto del botón para indicar si el cómic ya está en la colección
            if (isInCollection) {
                button.innerHTML = `${button.textContent} (Ya añadido)`;
            } else {
                button.innerHTML = Favorites.COLLECTION_NAMES[collection] || collection;
            }
        });
    }

    enableAllButtons() {
        this.collectionButtons.forEach(button => {
            button.disabled = false;
            const collection = button.dataset.collection;
            button.innerHTML = Favorites.COLLECTION_NAMES[collection] || collection;
        });
    }

    handleCollectionSelection(e) {
        const collection = e.target.dataset.collection;
        UI.handleCollectionSelection(collection);
        this.close();
    }
} 