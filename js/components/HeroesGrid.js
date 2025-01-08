class HeroesGrid {
  constructor() {
    this.container = document.getElementById("heroesGrid");
    this.modal = document.getElementById("heroModal");
    this.currentPage = 1;
    this.itemsPerPage =
      parseInt(document.getElementById("itemsPerPage").value) || 10;
    this.setupModal();
    this.setupPagination();
    this.loadHeroes();
  }

  setupModal() {
    const closeBtn = this.modal.querySelector(".close-modal");
    closeBtn.addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });
  }

  setupPagination() {
    // Event listeners para los botones de paginación
    document.getElementById("firstPage").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage = 1;
        this.loadHeroes();
      }
    });

    document.getElementById("prevPage").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadHeroes();
      }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadHeroes();
      }
    });

    document.getElementById("lastPage").addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage = this.totalPages;
        this.loadHeroes();
      }
    });

    // Event listener para el input de página
    document.getElementById("pageInput").addEventListener("change", (e) => {
      const newPage = parseInt(e.target.value);
      if (newPage && newPage > 0 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.loadHeroes();
      } else {
        e.target.value = this.currentPage;
        this.showToast("Número de página inválido", "error");
      }
    });

    // Event listener para items por página
    document.getElementById("itemsPerPage").addEventListener("change", (e) => {
      this.itemsPerPage = parseInt(e.target.value);
      this.currentPage = 1;
      this.loadHeroes();
    });
  }

  async loadHeroes(params = {}) {
    try {
      this.container.innerHTML = '<p class="loading">Cargando héroes...</p>';

      const offset = (this.currentPage - 1) * this.itemsPerPage;
      const apiParams = {
        limit: this.itemsPerPage,
        offset,
        ...params,
      };

      const response = await MarvelAPI.getCharacters(apiParams);
      const { results, total } = response.data;

      this.totalPages = Math.ceil(total / this.itemsPerPage);
      this.updatePaginationControls();

      if (results.length === 0) {
        this.container.innerHTML =
          '<p class="no-results">No se encontraron héroes</p>';
        return;
      }

      this.renderHeroes(results);
    } catch (error) {
      console.error("Error loading heroes:", error);
      this.container.innerHTML =
        '<p class="error">Error al cargar los héroes. Por favor, intenta de nuevo más tarde.</p>';
    }
  }

  renderHeroes(heroes) {
    this.container.innerHTML = heroes
      .map((hero) => this.createHeroCard(hero))
      .join("");

    // Agregar event listeners a las tarjetas
    this.container.querySelectorAll(".hero-card").forEach((card) => {
      card.addEventListener("click", () =>
        this.showHeroDetails(card.dataset.id)
      );
    });
  }

  createHeroCard(hero) {
    return `
      <div class="hero-card" data-id="${hero.id}">
        <img class="hero-image" src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}" onerror="this.src='assets/images/image-not-found.jpg'">
        <div class="hero-info">
          <h3 class="hero-name">${hero.name}</h3>
          <p class="hero-id">ID: ${hero.id}</p>
          <button class="view-more-btn">Ver más</button>
        </div>
      </div>
    `;
  }

  async showHeroDetails(heroId) {
    try {
      // Obtener detalles del héroe
      const heroResponse = await MarvelAPI.getCharacter(heroId);
      const hero = heroResponse.data.results[0];

      // Obtener comics del héroe
      const comicsResponse = await MarvelAPI.getCharacterComics(heroId);
      const comics = comicsResponse.data.results;

      this.renderModal(hero, comics);
      this.openModal();
    } catch (error) {
      console.error("Error loading hero details:", error);
      this.showToast("Error al cargar los detalles del héroe", "error");
    }
  }

  renderModal(hero, comics) {
    // Actualizar contenido del modal
    this.modal.querySelector(".modal-title").textContent = hero.name;
    this.modal.querySelector(
      ".hero-modal-image"
    ).src = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
    this.modal.querySelector(".hero-description").textContent =
      hero.description || "No hay descripción disponible.";

    // Renderizar lista de comics
    const comicsContainer = this.modal.querySelector(".comics-container");
    comicsContainer.innerHTML = comics
      .map(
        (comic) => `
      <div class="comic-item">
        <div class="comic-name">${comic.title}</div>
        <div class="comic-id">ID: ${comic.id}</div>
      </div>
    `
      )
      .join("");
  }

  updatePaginationControls() {
    // Actualizar número de página actual y total
    document.getElementById("pageInput").value = this.currentPage;
    document.getElementById("totalPages").textContent = this.totalPages;

    // Actualizar estado de los botones
    document.getElementById("firstPage").disabled = this.currentPage === 1;
    document.getElementById("prevPage").disabled = this.currentPage === 1;
    document.getElementById("nextPage").disabled =
      this.currentPage === this.totalPages;
    document.getElementById("lastPage").disabled =
      this.currentPage === this.totalPages;
  }

  openModal() {
    this.modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevenir scroll
  }

  closeModal() {
    this.modal.style.display = "none";
    document.body.style.overflow = ""; // Restaurar scroll
  }

  showToast(message, type = "info") {
    // Implementar sistema de notificaciones toast
    console.log(`${type}: ${message}`);
  }
}
