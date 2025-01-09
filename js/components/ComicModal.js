class ComicModal {
  constructor() {
    this.modal = null;
    this.accordion = null;
    this.createModal();
    this.setupEventListeners();
  }

  createModal() {
    this.modal = document.createElement("div");
    this.modal.className = "comic-modal";
    this.modal.innerHTML = `
      <div class="comic-modal-content">
        <div class="comic-modal-header">
          <h2 class="comic-modal-title"></h2>
          <button class="close-modal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="comic-modal-body">
          <div class="comic-image-container">
            <img class="comic-modal-image" alt="Comic cover">
          </div>
          <div class="comic-details">
            <div class="comic-metadata">
              <div class="metadata-item">
                <span class="metadata-label">ID</span>
                <span class="metadata-value comic-id"></span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Número</span>
                <span class="metadata-value comic-issue"></span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Páginas</span>
                <span class="metadata-value comic-pages"></span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Precio</span>
                <span class="metadata-value comic-price"></span>
              </div>
            </div>
            <div class="comic-description"></div>
            <div class="accordion-container"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);
    this.accordion = new Accordion(
      this.modal.querySelector(".accordion-container")
    );
  }

  setupEventListeners() {
    this.modal.querySelector(".close-modal").addEventListener("click", () => {
      this.hide();
    });

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("show")) {
        this.hide();
      }
    });
  }

  async show(comic) {
    try {
      this.updateModalContent(comic);
      this.modal.classList.add("show");
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Error showing comic details:", error);
      window.showToast("Error al cargar los detalles del cómic", "error");
    }
  }

  hide() {
    this.modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  updateModalContent(comic) {
    // Actualizar título y metadata básica
    this.modal.querySelector(".comic-modal-title").textContent = comic.title;
    this.modal.querySelector(".comic-id").textContent = comic.id;
    this.modal.querySelector(
      ".comic-issue"
    ).textContent = `#${comic.issueNumber}`;
    this.modal.querySelector(
      ".comic-pages"
    ).textContent = `${comic.pageCount} páginas`;
    this.modal.querySelector(
      ".comic-price"
    ).textContent = `$${comic.price.toFixed(2)}`;

    // Actualizar imagen
    const imageUrl = comic.getThumbnailURL();
    const modalImage = this.modal.querySelector(".comic-modal-image");
    modalImage.src = imageUrl;
    modalImage.alt = comic.title;
    modalImage.onerror = () => {
      modalImage.src = "assets/images/image-not-found.jpg";
    };

    // Actualizar descripción
    const descriptionElement = this.modal.querySelector(".comic-description");
    descriptionElement.textContent =
      comic.description || "No hay descripción disponible.";

    // Crear contenido del acordeón
    const accordionContainer = this.modal.querySelector(".accordion-container");
    accordionContainer.innerHTML = "";

    // Sección de Creadores
    if (comic.creators && comic.creators.length > 0) {
      const creatorsContent = `
        <ul class="creators-list">
          ${comic.creators.map((creator) => `<li>${creator}</li>`).join("")}
        </ul>
      `;
      accordionContainer.innerHTML += Accordion.createAccordionSection(
        "Creadores",
        creatorsContent
      );
    }

    // Sección de Personajes
    if (comic.characters && comic.characters.length > 0) {
      const charactersContent = `
        <ul class="characters-list">
          ${comic.characters
            .map(
              (character) => `
                <li>
                  <a href="heroes.html?name=${encodeURIComponent(character)}">
                    <i class="fas fa-mask"></i> ${character}
                  </a>
                </li>
              `
            )
            .join("")}
        </ul>
      `;
      accordionContainer.innerHTML += Accordion.createAccordionSection(
        "Personajes",
        charactersContent
      );
    }

    // Reinicializar el acordeón
    this.accordion = new Accordion(accordionContainer);
  }
}
