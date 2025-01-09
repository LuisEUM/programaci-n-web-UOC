class HeroModal {
  constructor() {
    this.modal = document.getElementById("heroModal");
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

  async show(heroId) {
    try {
      const heroResponse = await MarvelAPI.getHeroById(heroId);
      if (!heroResponse.data.results.length) {
        throw new Error("Héroe no encontrado");
      }

      const hero = Hero.fromAPI(heroResponse.data.results[0]);
      this.render(hero);
      this.modal.style.display = "block";
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Error loading hero details:", error);
      showToast("Error al cargar los detalles del héroe", "error");
    }
  }

  close() {
    this.modal.style.display = "none";
    document.body.style.overflow = "";
  }

  render(hero) {
    const modalContent = this.modal.querySelector(".modal-content");
    modalContent.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title">${hero.name}</h2>
        <button class="close-modal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="hero-details">
          <div class="hero-info-container">
            <!-- Imagen del héroe -->
            <div class="hero-image-container">
              <img src="${hero.getThumbnailURL()}" alt="${
      hero.name
    }" class="hero-modal-image">
            </div>

            <!-- Botón Ver Comics -->
            <a href="comics.html?hero=${hero.id}" class="view-comics-btn">
              <i class="fas fa-book-open"></i>
              Ver todos los comics 
            </a>

            <!-- Descripción Accordion -->
            ${Accordion.createAccordionSection(
              "Descripción",
              `<p>${hero.description || "No hay descripción disponible."}</p>`
            )}

            <!-- Comics Accordion -->
            ${Accordion.createAccordionSection(
              "Comics",
              `<div class="comics-list">
                ${
                  hero.comics && hero.comics.length > 0
                    ? hero.comics.map((comic) => `<p>• ${comic}</p>`).join("")
                    : "<p>No hay comics disponibles.</p>"
                }
              </div>`
            )}



            <!-- Información General Accordion -->
            ${Accordion.createAccordionSection(
              "Información General",
              `<p><strong>ID:</strong> ${hero.id}</p>
               <p><strong>Nombre:</strong> ${hero.name}</p>
               <p><strong>Última modificación:</strong> ${new Date(
                 hero.modified
               ).toLocaleDateString()}</p>`
            )}
          </div>
        </div>
      </div>
    `;

    // Reconfigurar los event listeners del modal
    this.setupModal();
  }
}
