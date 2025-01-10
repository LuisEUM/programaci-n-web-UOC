class CollectionModal {
  constructor() {
    this.modal = document.getElementById("collectionModal");
    this.closeModalBtn = document.getElementById("closeModal");
    this.collectionButtons = this.modal.querySelectorAll(".collection-btn");
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

    // Cerrar con la tecla Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("show")) {
        this.close();
      }
    });
  }

  open(action, comicId, currentCollection) {
    this.currentAction = action;
    this.currentComicId = comicId;
    this.currentCollection = currentCollection;

    // Actualizar el título del modal según la acción
    const modalTitle = this.modal.querySelector(".collection-modal-title");
    modalTitle.textContent =
      action === "move" ? "Mover a otra colección" : "Clonar en colección";

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
      const isCurrentCollection = collection === this.currentCollection;
      const isInCollection = collectionsManager.isCollection(
        dataSource,
        collection,
        this.currentComicId
      );

      // Deshabilitar el botón si:
      // 1. Es la colección actual
      // 2. El cómic ya existe en esa colección (tanto para mover como para clonar)
      button.disabled = isCurrentCollection || isInCollection;

      // Actualizar el texto del botón
      if (isCurrentCollection) {
        button.innerHTML = `
          <i class="${this.getCollectionIcon(collection)}"></i>
          ${Collections.COLLECTION_NAMES[collection]}
          <span class="collection-status">(Colección actual)</span>
        `;
      } else if (isInCollection) {
        button.innerHTML = `
          <i class="${this.getCollectionIcon(collection)}"></i>
          ${Collections.COLLECTION_NAMES[collection]}
          <span class="collection-status">(Ya existe en esta colección)</span>
        `;
      } else {
        button.innerHTML = `
          <i class="${this.getCollectionIcon(collection)}"></i>
          ${Collections.COLLECTION_NAMES[collection]}
        `;
      }
    });
  }

  enableAllButtons() {
    this.collectionButtons.forEach((button) => {
      button.disabled = false;
      const collection = button.dataset.collection;
      button.innerHTML = `
        <i class="${this.getCollectionIcon(collection)}"></i>
        ${Collections.COLLECTION_NAMES[collection]}
      `;
    });
  }

  handleCollectionSelection(e) {
    const targetCollection =
      e.target.closest(".collection-btn").dataset.collection;
    if (!targetCollection || e.target.closest(".collection-btn").disabled)
      return;

    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

    try {
      // Convertir comicId a número si es string
      const comicId = parseInt(this.currentComicId);

      if (this.currentAction === "move") {
        // Remover de la colección actual
        collectionsManager.removeCollection(
          dataSource,
          this.currentCollection,
          comicId
        );
        // Añadir a la nueva colección
        collectionsManager.addCollection(dataSource, targetCollection, comicId);
        // Guardar cambios
        collectionsManager.saveCollections();
        showToast("Cómic movido exitosamente", "success");
      } else if (this.currentAction === "clone") {
        // Verificar que no esté en la colección destino
        if (
          collectionsManager.isCollection(dataSource, targetCollection, comicId)
        ) {
          showToast("El cómic ya existe en la colección destino", "error");
          return;
        }
        // Solo añadir a la nueva colección
        collectionsManager.addCollection(dataSource, targetCollection, comicId);
        // Guardar cambios
        collectionsManager.saveCollections();
        showToast("Cómic clonado exitosamente", "success");
      }

      // Cerrar el modal
      this.close();

      // Recargar la vista actual
      loadCollections(this.currentCollection, collectionsManager);
    } catch (error) {
      console.error("Error handling collection selection:", error);
      showToast("Error al procesar la operación", "error");
    }
  }

  getCollectionIcon(collection) {
    const icons = {
      wishlist: "fas fa-star",
      toread: "fas fa-bookmark",
      reading: "fas fa-book-open",
      read: "fas fa-check-circle",
      collections: "fas fa-heart",
    };
    return icons[collection] || "fas fa-list";
  }
}
