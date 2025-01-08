class Navbar {
  constructor() {
    // Intentar obtener el usuario del localStorage
    const storedUsername = localStorage.getItem("userName");
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      this.username = currentUser.usuario || "Usuario";
    }
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    // Inicializar la configuración de la fuente de datos
    Config.init();
    this.renderDataStatus();
    this.renderNavbar();
    this.setupEventListeners();
  }

  renderDataStatus() {
    const dataStatus = document.createElement("div");
    dataStatus.className = "data-status-bar";
    dataStatus.innerHTML = `
      <div class="data-status-container">
        <button class="data-status-toggle ${
          Config.USE_MOCK_DATA ? "" : "api-mode"
        }">
          <i class="fas fa-database" aria-hidden="true"></i>
          <span class="data-status-text">${
            Config.USE_MOCK_DATA
              ? "Usando Data Mockeada"
              : "Usando Data de la API"
          }</span>
        </button>
      </div>
    `;
    document.body.insertBefore(dataStatus, document.body.firstChild);

    // Añadir evento de click al botón
    const toggleButton = dataStatus.querySelector(".data-status-toggle");
    toggleButton.addEventListener("click", () => this.toggleDataSource());
  }

  toggleDataSource() {
    const isUsingMock = Config.toggleDataSource();
    // Actualizar el texto del botón
    const toggleButton = document.querySelector(".data-status-toggle");
    const statusText = toggleButton.querySelector(".data-status-text");

    if (toggleButton) {
      toggleButton.classList.toggle("api-mode", !isUsingMock);
      statusText.textContent = isUsingMock
        ? "Usando Data Mockeada"
        : "Usando Data de la API";
    }

    // Disparar un evento personalizado para notificar el cambio
    window.dispatchEvent(
      new CustomEvent("dataSourceChanged", {
        detail: { isUsingMock },
      })
    );
  }

  renderNavbar() {
    const navbar = document.createElement("nav");
    navbar.className = "navbar";
    navbar.innerHTML = `
      <div class="logo">
        <a href="home.html" title="Ir a inicio">
          <img src="images/marvel.svg" alt="Marvel Logo" class="marvel-logo">
        </a>
      </div>
      <button class="hamburger-menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="nav-menu">
        <div class="nav-links">
          <a href="comics.html" class="nav-link ${
            window.location.pathname.includes("comics") ? "active" : ""
          }">Comics</a>
          <a href="heroes.html" class="nav-link ${
            window.location.pathname.includes("heroes") ? "active" : ""
          }">Héroes</a>
          <a href="collections.html" class="nav-link ${
            window.location.pathname.includes("collections") ? "active" : ""
          }">Colecciones</a>
        </div>
        <div class="user-section">
          <span class="username">
            <i class="fas fa-user"></i>
            Hola, ${this.username}
          </span>
          <button class="logout-button" aria-label="Logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    `;

    document.body.insertBefore(navbar, document.body.children[1]);
  }

  setupEventListeners() {
    const hamburgerBtn = document.querySelector(".hamburger-menu");
    const navMenu = document.querySelector(".nav-menu");
    const logoutBtn = document.querySelector(".logout-button");

    hamburgerBtn?.addEventListener("click", () => {
      this.isMenuOpen = !this.isMenuOpen;
      hamburgerBtn.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (this.isMenuOpen) {
          this.isMenuOpen = false;
          hamburgerBtn.classList.remove("active");
          navMenu.classList.remove("active");
        }
      });
    });

    logoutBtn?.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userName");
      window.location.href = "login.html";
    });
  }
}

// Crear una instancia global
window.navbar = new Navbar();
