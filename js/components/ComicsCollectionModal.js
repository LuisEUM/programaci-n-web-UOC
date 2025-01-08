class ComicsCollectionModal {
  constructor() {
    this.modal = document.getElementById("collectionModal");
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Event listeners para abrir el modal
    document.addEventListener("openCollectionModal", (e) => {
      this.open(e.detail.isIndividual, e.detail.comicId);
    });

    document.addEventListener("openRemoveCollectionModal", (e) => {
      this.openRemove(e.detail.isIndividual, e.detail.comicId);
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.close();
      }
    });

    // Cerrar modal con Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.close();
      }
    });

    // Botón de cerrar modal
    document.getElementById("closeModal").addEventListener("click", () => {
      this.close();
    });
  }

  open(isIndividual = false, comicId = null) {
    this.modal.style.display = "block";
    const buttons = this.modal.querySelectorAll(".collection-btn");

    buttons.forEach((button) => {
      const collection = button.dataset.collection;

      if (isIndividual && comicId) {
        const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
        const isInCollection = favoritesManager.isFavorite(
          dataSource,
          collection,
          comicId
        );
        button.disabled = isInCollection;

        if (isInCollection) {
          button.innerHTML = `<i class="${this.getCollectionIcon(
            collection
          )}"></i> ${Favorites.COLLECTION_NAMES[collection]} (Ya añadido)`;
        } else {
          button.innerHTML = `<i class="${this.getCollectionIcon(
            collection
          )}"></i> ${Favorites.COLLECTION_NAMES[collection]}`;
        }
      } else {
        button.disabled = false;
        button.innerHTML = `<i class="${this.getCollectionIcon(
          collection
        )}"></i> ${Favorites.COLLECTION_NAMES[collection]}`;
      }

      button.onclick = () =>
        this.handleCollectionSelection(
          collection,
          false,
          isIndividual ? comicId : null
        );
    });
  }

  openRemove(isIndividual = false, comicId = null) {
    this.modal.style.display = "block";
    const buttons = this.modal.querySelectorAll(".collection-btn");
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

    buttons.forEach((button) => {
      const collection = button.dataset.collection;

      if (isIndividual && comicId) {
        const isInCollection = favoritesManager.isFavorite(
          dataSource,
          collection,
          comicId
        );
        button.disabled = !isInCollection;

        if (isInCollection) {
          button.innerHTML = `<i class="${this.getCollectionIcon(
            collection
          )}"></i> Quitar de ${Favorites.COLLECTION_NAMES[collection]}`;
        } else {
          button.innerHTML = `<i class="${this.getCollectionIcon(
            collection
          )}"></i> ${Favorites.COLLECTION_NAMES[collection]}`;
        }
      } else {
        button.disabled = false;
        button.innerHTML = `<i class="${this.getCollectionIcon(
          collection
        )}"></i> Quitar de ${Favorites.COLLECTION_NAMES[collection]}`;
      }

      button.onclick = () =>
        this.handleCollectionSelection(
          collection,
          true,
          isIndividual ? comicId : null
        );
    });
  }

  close() {
    this.modal.style.display = "none";
  }

  handleCollectionSelection(collection, isRemove = false, comicId = null) {
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
    const selectedCards = document.querySelectorAll(".card.selected");
    let actionCount = 0;

    if (comicId) {
      // Manejo individual
      if (isRemove) {
        favoritesManager.removeFavorite(dataSource, collection, comicId);
        showToast(
          `Comic eliminado de ${favoritesManager.getCollectionDisplayName(
            collection
          )}`,
          "success"
        );
      } else {
        favoritesManager.addFavorite(dataSource, collection, comicId);
        showToast(
          `Comic añadido a ${favoritesManager.getCollectionDisplayName(
            collection
          )}`,
          "success"
        );
      }
      document.dispatchEvent(
        new CustomEvent("updateFavoriteButtons", { detail: { comicId } })
      );
    } else {
      // Manejo múltiple
      selectedCards.forEach((card) => {
        const id = parseInt(card.dataset.id);
        if (isRemove) {
          if (favoritesManager.isFavorite(dataSource, collection, id)) {
            favoritesManager.removeFavorite(dataSource, collection, id);
            actionCount++;
          }
        } else {
          if (!favoritesManager.isFavorite(dataSource, collection, id)) {
            favoritesManager.addFavorite(dataSource, collection, id);
            actionCount++;
          }
        }
        document.dispatchEvent(
          new CustomEvent("updateFavoriteButtons", { detail: { comicId: id } })
        );
        card.classList.remove("selected");
        const checkbox = card.querySelector(".card-checkbox");
        if (checkbox) checkbox.checked = false;
      });

      // Mostrar mensaje con el número de comics afectados
      const action = isRemove ? "eliminados de" : "añadidos a";
      const collectionName =
        favoritesManager.getCollectionDisplayName(collection);
      if (actionCount > 0) {
        showToast(
          `${actionCount} ${
            actionCount === 1 ? "comic" : "comics"
          } ${action} ${collectionName}`,
          "success"
        );
      } else {
        showToast(`No se realizaron cambios en ${collectionName}`, "info");
      }
    }

    // Actualizar el estado de los botones en el modal si es una selección individual
    if (comicId) {
      const buttons = document.querySelectorAll(".collection-btn");
      buttons.forEach((button) => {
        const buttonCollection = button.dataset.collection;
        const isInCollection = favoritesManager.isFavorite(
          dataSource,
          buttonCollection,
          comicId
        );
        button.disabled = isInCollection;

        if (isInCollection) {
          button.innerHTML = `${Favorites.COLLECTION_NAMES[buttonCollection]} (Ya añadido)`;
        } else {
          button.innerHTML = `<i class="${this.getCollectionIcon(
            buttonCollection
          )}"></i> ${Favorites.COLLECTION_NAMES[buttonCollection]}`;
        }
      });
    }

    this.close();
    document.dispatchEvent(new CustomEvent("updateActionsBar"));
  }

  getCollectionIcon(collection) {
    const icons = {
      wishlist: "fas fa-star",
      toread: "fas fa-bookmark",
      reading: "fas fa-book-open",
      read: "fas fa-check-circle",
      favorites: "fas fa-heart",
    };
    return icons[collection] || "fas fa-list";
  }
}
