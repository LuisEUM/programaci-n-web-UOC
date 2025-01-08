class CollectionModal {
  constructor() {
    this.modal = document.getElementById("collectionModal");
    this.closeModalBtn = document.getElementById("closeModal");
    this.collectionButtons = document.querySelectorAll(".collection-btn");
    this.currentAction = null;
    this.currentComicId = null;
    this.currentCollection = null;
    this.init();
  }

  init() {
    this.closeModalBtn.addEventListener("click", () => this.close());
    this.collectionButtons.forEach((button) => {
      button.addEventListener("click", (e) =>
        this.handleCollectionSelection(e)
      );
    });

    // Cerrar el modal cuando se hace clic fuera de él
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  open(action, comicId, currentCollection) {
    this.currentAction = action;
    this.currentComicId = comicId;
    this.currentCollection = currentCollection;

    // Actualizar el título del modal según la acción
    const modalTitle = this.modal.querySelector("h2");
    modalTitle.textContent =
      action === "move" ? "Mover a otra colección" : "Clonar a otra colección";

    // Actualizar estado de los botones
    this.updateButtonStates();

    // Mostrar el modal
    this.modal.style.display = "flex";
    this.modal.classList.add("show");
  }

  close() {
    this.modal.classList.remove("show");
    setTimeout(() => {
      this.modal.style.display = "none";
      this.resetState();
    }, 300);
  }

  resetState() {
    this.currentAction = null;
    this.currentComicId = null;
    this.currentCollection = null;
    this.enableAllButtons();
  }

  updateButtonStates() {
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

    this.collectionButtons.forEach((button) => {
      const collection = button.dataset.collection;

      if (this.currentAction === "move") {
        // Para mover: deshabilitar la colección actual
        button.disabled = collection === this.currentCollection;
        button.innerHTML =
          collection === this.currentCollection
            ? `${Favorites.COLLECTION_NAMES[collection]} (Colección actual)`
            : Favorites.COLLECTION_NAMES[collection];
      } else if (this.currentAction === "clone") {
        // Para clonar: deshabilitar las colecciones donde ya existe el cómic
        const isInCollection = UI.favoritesManager.isFavorite(
          dataSource,
          collection,
          this.currentComicId
        );
        button.disabled = isInCollection;
        button.innerHTML = isInCollection
          ? `${Favorites.COLLECTION_NAMES[collection]} (Ya existe)`
          : Favorites.COLLECTION_NAMES[collection];
      }
    });
  }

  enableAllButtons() {
    this.collectionButtons.forEach((button) => {
      button.disabled = false;
      const collection = button.dataset.collection;
      button.innerHTML = Favorites.COLLECTION_NAMES[collection];
    });
  }

  handleCollectionSelection(e) {
    const targetCollection = e.target.dataset.collection;
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

    if (this.currentAction === "move") {
      // Remover de la colección actual
      UI.favoritesManager.removeFavorite(
        dataSource,
        this.currentCollection,
        this.currentComicId
      );
      // Añadir a la nueva colección
      UI.favoritesManager.addFavorite(
        dataSource,
        targetCollection,
        this.currentComicId
      );
      showToast("Cómic movido exitosamente", "success");
    } else if (this.currentAction === "clone") {
      // Solo añadir a la nueva colección
      UI.favoritesManager.addFavorite(
        dataSource,
        targetCollection,
        this.currentComicId
      );
      showToast("Cómic clonado exitosamente", "success");
    }

    // Cerrar el modal
    this.close();

    // Recargar la vista actual
    loadFavorites(this.currentCollection, UI.favoritesManager);
  }
}
