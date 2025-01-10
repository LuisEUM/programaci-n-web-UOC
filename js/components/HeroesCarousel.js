class HeroesCarousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.loadHeroes();
  }

  async loadHeroes() {
    try {
      const response = await fetch("data/heroes.json");
      const data = await response.json();
      const heroesInner = this.container.querySelector(".heroes-inner");

      // Dividir los héroes en grupos de 9
      const heroGroups = [];
      for (let i = 0; i < data.heroes.length; i += 9) {
        heroGroups.push(data.heroes.slice(i, i + 9));
      }

      // Crear grupos de héroes
      heroGroups.forEach((group) => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "heroes-group";

        group.forEach((hero) => {
          const heroCard = this.createHeroCard(hero);
          groupDiv.appendChild(heroCard);
        });

        heroesInner.appendChild(groupDiv);
      });

      // Actualizar controles del carrusel
      this.updateCarouselControls(heroGroups.length);
    } catch (error) {
      console.error("Error loading heroes:", error);
    }
  }

  createHeroCard(hero) {
    const card = document.createElement("div");
    card.className = "hero-card";
    card.dataset.id = hero.id;

    card.innerHTML = `
      <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
      <div class="hero-info">
        <h3>${hero.name}</h3>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `heroes.html?id=${hero.id}`;
    });

    return card;
  }

  updateCarouselControls(numGroups) {
    const wrapper = document.querySelector(".carousel-wrapper");
    const dots = document.querySelector(".carousel-dots");
    const controls = document.querySelector(".carousel-controls");

    // Limpiar controles existentes
    while (dots.firstChild) {
      dots.removeChild(dots.firstChild);
    }

    // Limpiar radio buttons existentes
    wrapper.querySelectorAll('input[type="radio"]').forEach((input) => {
      if (input.name === "hero-slider") {
        wrapper.removeChild(input);
      }
    });

    // Crear radio buttons y dots para cada grupo
    for (let i = 1; i <= numGroups; i++) {
      // Radio button
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "hero-slider";
      input.id = `hero${i}`;
      if (i === 1) input.checked = true;
      wrapper.insertBefore(input, wrapper.firstChild);

      // Dot
      const dot = document.createElement("label");
      dot.setAttribute("for", `hero${i}`);
      dots.appendChild(dot);
    }

    // Actualizar controles de navegación
    const prevLabel = controls.querySelector(".prev-slide");
    const nextLabel = controls.querySelector(".next-slide");

    const updateNavigationLabels = () => {
      const checkedInput = wrapper.querySelector(
        'input[name="hero-slider"]:checked'
      );
      const currentNum = parseInt(checkedInput.id.replace("hero", ""));

      prevLabel.setAttribute(
        "for",
        `hero${currentNum === 1 ? numGroups : currentNum - 1}`
      );
      nextLabel.setAttribute(
        "for",
        `hero${currentNum === numGroups ? 1 : currentNum + 1}`
      );
    };

    // Actualizar labels inicialmente
    updateNavigationLabels();

    // Agregar event listeners para actualizar las flechas cuando cambie la selección
    wrapper.querySelectorAll('input[name="hero-slider"]').forEach((input) => {
      input.addEventListener("change", updateNavigationLabels);
    });
  }
}
