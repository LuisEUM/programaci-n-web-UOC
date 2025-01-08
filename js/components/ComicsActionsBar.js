class ComicsActionsBar {
  constructor() {
    this.actionsBar = document.getElementById("actionsBar");
    this.selectedCount = this.actionsBar.querySelector(".selected-count");
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("updateActionsBar", () => this.update());

    this.actionsBar
      .querySelector(".save-collections-btn")
      .addEventListener("click", () => {
        const selectedCards = document.querySelectorAll(".card.selected");
        if (selectedCards.length > 0) {
          document.dispatchEvent(
            new CustomEvent("openCollectionModal", {
              detail: { isIndividual: false },
            })
          );
        } else {
          showToast("No hay cómics seleccionados", "error");
        }
      });

    this.actionsBar
      .querySelector(".remove-collections-btn")
      .addEventListener("click", () => {
        const selectedCards = document.querySelectorAll(".card.selected");
        if (selectedCards.length > 0) {
          document.dispatchEvent(
            new CustomEvent("openRemoveCollectionModal", {
              detail: { isIndividual: false },
            })
          );
        } else {
          showToast("No hay cómics seleccionados", "error");
        }
      });
  }

  update() {
    const selectedCards = document.querySelectorAll(".card.selected");

    if (selectedCards.length > 0) {
      this.actionsBar.classList.add("visible");

      // Calcular precio total y promedio
      const prices = Array.from(selectedCards).map((card) => {
        const priceText = card.querySelector(".comic-price").textContent;
        return parseFloat(priceText.replace("$", ""));
      });

      const totalPrice = prices.reduce((sum, price) => sum + price, 0);
      const avgPrice = totalPrice / prices.length;

      this.selectedCount.innerHTML = `
        <div class="price-info">
          <span class="selected-text">${
            selectedCards.length
          } cómics seleccionados</span>
          <div class="price-details">
            <span class="total-price">Total: $${totalPrice.toFixed(2)}</span>
            <span class="average-price">Promedio: $${avgPrice.toFixed(2)}</span>
          </div>
        </div>
      `;
    } else {
      this.actionsBar.classList.remove("visible");
      this.selectedCount.innerHTML =
        '<span class="selected-text">0 cómics seleccionados</span>';
    }
  }
}
