class ComicDetailsModal {
  constructor() {
    this.modal = document.getElementById("comicDetailsModal");
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  setupModal() {
    const closeBtn = this.modal.querySelector(".close-modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    // Inicializar acordeones
    const modalContent = this.modal.querySelector(".modal-content");
    if (modalContent) {
      this.accordion = new Accordion(modalContent);
    }
  }

  async show(comic) {
    try {
      // Validar que el cómic sea válido
      if (!comic || !comic.id) {
        throw new Error("Cómic inválido");
      }

      // Si recibimos solo el ID, necesitamos cargar el cómic
      if (typeof comic === "number") {
        const comicData = await DataService.fetchItemById("comics", comic);
        if (!comicData) {
          throw new Error("Cómic no encontrado");
        }
        comic = comicData;
      }

      this.render(comic);
      this.modal.style.display = "block";
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Error showing comic details:", error);
      showToast("Error al mostrar los detalles del cómic", "error");
    }
  }

  close() {
    this.modal.style.display = "none";
    document.body.style.overflow = "";
  }

  render(comic) {
    const modalContent = this.modal.querySelector(".modal-content");
    modalContent.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title">${comic.title}</h2>
        <button class="close-modal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="comic-details">
          <div class="comic-info-container">
            <!-- Imagen del cómic -->
            <div class="comic-image-container">
              <img src="${comic.getThumbnailURL()}" alt="${
      comic.title
    }" class="comic-modal-image">
            </div>

            <!-- Información básica -->
            <div class="comic-basic-info">
              <span class="issue-number">Issue #${comic.issueNumber}</span>
              <span class="price">$${comic.price}</span>
              <span class="pages">${comic.pageCount} páginas</span>
            </div>

            <!-- Descripción Accordion -->
            ${Accordion.createAccordionSection(
              "Descripción",
              `<p>${comic.description || "No hay descripción disponible."}</p>`
            )}

            <!-- Creadores Accordion -->
            ${Accordion.createAccordionSection(
              "Creadores",
              `<div class="creators-list">
                ${
                  comic.creators.length > 0
                    ? comic.creators
                        .map((creator) => `<p>• ${creator}</p>`)
                        .join("")
                    : "<p>No hay información de creadores disponible.</p>"
                }
              </div>`
            )}

            <!-- Personajes Accordion -->
            ${Accordion.createAccordionSection(
              "Personajes",
              `<div class="characters-list">
                ${
                  comic.characters.length > 0
                    ? comic.characters
                        .map((character) => `<p>• ${character}</p>`)
                        .join("")
                    : "<p>No hay información de personajes disponible.</p>"
                }
              </div>`
            )}
          </div>
        </div>
      </div>
    `;

    // Reconfigurar los event listeners del modal
    this.setupModal();
  }
}
