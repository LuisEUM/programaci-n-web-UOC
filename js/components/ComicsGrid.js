class ComicsGrid {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.allComics = [];
    this.filteredComics = [];
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.totalPages = 1;
  }

  async loadComics() {
    try {
      this.container.innerHTML =
        '<div class="loading">Cargando cómics...</div>';

      // Cargar cómics desde comics.json si aún no están cargados
      if (this.allComics.length === 0) {
        const response = await fetch("js/data/comics.json");
        if (!response.ok) {
          throw new Error("Error fetching comics from comics.json");
        }
        const data = await response.json();
        this.allComics = data.comics.map((comic) => Comic.fromAPI(comic));
      }

      // Usar los comics filtrados si hay algún filtro activo, si no usar todos
      const comicsToShow =
        this.filteredComics.length > 0 ? this.filteredComics : this.allComics;

      if (!comicsToShow || comicsToShow.length === 0) {
        this.container.innerHTML =
          '<div class="no-results">No se encontraron cómics</div>';
        this.updatePagination(0);
        return;
      }

      // Calcular paginación
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const paginatedComics = comicsToShow.slice(startIndex, endIndex);

      // Limpiar contenedor y mostrar cómics
      this.container.innerHTML = "";
      paginatedComics.forEach((comic) => {
        const card = this.createComicCard(comic);
        this.container.appendChild(card);
        // Actualizar estado del botón para este cómic
        this.updateFavoriteButtons(comic.id);
      });

      // Actualizar paginación
      this.updatePagination(comicsToShow.length);
    } catch (error) {
      console.error("Error loading comics:", error);
      showToast("Error al cargar los cómics", "error");
    }
  }

  createComicCard(comic) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = comic.id;

    const thumbnailUrl = comic.getThumbnailURL();
    const shortDescription = comic.description
      ? comic.description.length > 50
        ? comic.description.substring(0, 47) + "..."
        : comic.description
      : "No description available";

    card.innerHTML = `
      <input type="checkbox" class="card-checkbox" aria-label="Seleccionar cómic">
      <div class="checkbox-indicator"></div>
      <span class="card-id">ID: ${comic.id}</span>
      <img class="card-image" src="${thumbnailUrl}" alt="${
      comic.title
    }" onerror="this.src='assets/images/image-not-found.jpg'">
      <div class="card-info">
        <h3 class="card-title">${comic.title}</h3>
        <p class="card-description">${shortDescription}</p>
        <div class="card-metadata">
          <p class="comic-price">$${comic.price.toFixed(2)}</p>
        </div>
        <div class="card-actions">
          <button class="add-favorite-btn">
            <i class="far fa-heart"></i> Añadir a Favoritos
          </button>
          <button class="remove-favorite-btn">
            <i class="fas fa-trash"></i> Quitar de Favoritos
          </button>
        </div>
      </div>
    `;

    this.setupCardEvents(card, comic);
    return card;
  }

  setupCardEvents(card, comic) {
    // Evento de checkbox
    const checkbox = card.querySelector(".card-checkbox");
    checkbox.addEventListener("change", () => {
      card.classList.toggle("selected", checkbox.checked);
      document.dispatchEvent(new CustomEvent("updateActionsBar"));
    });

    // Eventos de botones de favoritos
    const addFavoriteBtn = card.querySelector(".add-favorite-btn");
    const removeFavoriteBtn = card.querySelector(".remove-favorite-btn");

    addFavoriteBtn.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("openCollectionModal", {
          detail: { isIndividual: true, comicId: comic.id },
        })
      );
    });

    removeFavoriteBtn.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("openRemoveCollectionModal", {
          detail: { isIndividual: true, comicId: comic.id },
        })
      );
    });
  }

  updateFavoriteButtons(comicId) {
    const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
    const card = document.querySelector(`.card[data-id="${comicId}"]`);

    if (card) {
      const favoriteBtn = card.querySelector(".add-favorite-btn");
      const removeBtn = card.querySelector(".remove-favorite-btn");
      const isInAnyCollection = favoritesManager.isFavorite(
        dataSource,
        null,
        comicId
      );

      if (favoriteBtn && removeBtn) {
        if (isInAnyCollection) {
          favoriteBtn.classList.add("added");
          favoriteBtn.innerHTML = `<i class="fas fa-heart"></i> Añadido`;
          removeBtn.style.display = "inline-flex";
          removeBtn.classList.add("removing");
        } else {
          favoriteBtn.classList.remove("added");
          favoriteBtn.innerHTML = `<i class="far fa-heart"></i> Añadir a Favoritos`;
          removeBtn.style.display = "none";
          removeBtn.classList.remove("removing");
        }
      }
    }
  }

  updatePagination(totalItems) {
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
    document.dispatchEvent(
      new CustomEvent("paginationUpdated", {
        detail: {
          currentPage: this.currentPage,
          totalPages: this.totalPages,
          itemsPerPage: this.itemsPerPage,
        },
      })
    );
  }

  setPage(page) {
    this.currentPage = page;
    this.loadComics();
  }

  setItemsPerPage(items) {
    this.itemsPerPage = items;
    this.currentPage = 1;
    this.loadComics();
  }

  applyFilters(filteredComics) {
    this.filteredComics = filteredComics;
    this.currentPage = 1;
    this.loadComics();
  }
}
