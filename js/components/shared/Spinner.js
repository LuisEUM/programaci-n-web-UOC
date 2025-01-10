class Spinner {
  constructor() {
    // Ya no necesitamos crear estilos aquí
  }

  render(container, text = "Cargando...") {
    const spinnerHTML = `
      <div class="spinner-container">
        <div class="spinner"></div>
        <div class="spinner-text">${text}</div>
      </div>
    `;

    if (typeof container === "string") {
      container = document.querySelector(container);
    }

    if (container) {
      container.innerHTML = spinnerHTML;
    }

    return spinnerHTML;
  }

  static show(container, text) {
    const spinner = new Spinner();
    return spinner.render(container, text);
  }
}

// Exportar para uso global
window.Spinner = Spinner;
