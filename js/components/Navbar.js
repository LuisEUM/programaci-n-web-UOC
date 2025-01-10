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

    // Wait for collectionsManager to be initialized
    window.addEventListener("collectionsManagerReady", () => {
      this.updateCollectionsCount();
    });

    // Listen for collection updates
    window.addEventListener("collectionsUpdated", () => {
      this.updateCollectionsCount();
    });
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
    const isAuthenticated =
      localStorage.getItem("userToken") && localStorage.getItem("userName");

    if (!isAuthenticated) {
      dataStatus.innerHTML = `
      <div class="data-status-container">
        <button class="data-status-toggle hide">
         <p>IMPORTANTE: Aquí tendremos un botón que permitirá cambiar la fuente de datos dentro de la aplicación</p>
        </button>
      </div>
    `;
    } else {
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
    }

    document.body.insertBefore(dataStatus, document.body.firstChild);

    // Añadir evento de click al botón
    const toggleButton = dataStatus.querySelector(".data-status-toggle");
    toggleButton.addEventListener("click", () => this.toggleDataSource());
  }

  toggleDataSource() {
    const isUsingMock = Config.toggleDataSource();
    localStorage.setItem("dataSourcePreference", isUsingMock ? "mock" : "api");

    // Obtener la URL actual y mantener sus parámetros existentes
    const currentUrl = new URL(window.location.href);

    // Recargar la página manteniendo la URL actual
    window.location.href = currentUrl.toString();
  }

  renderNavbar() {
    const isAuthenticated =
      localStorage.getItem("userToken") && localStorage.getItem("userName");
    const navbar = document.createElement("nav");
    navbar.className = "navbar";

    if (!isAuthenticated) {
      navbar.innerHTML = `
        <div class="nav-content">
          <div class="logo">
            <a href="home.html" title="Ir a inicio">
              <img src="images/marvel.svg" alt="Marvel Logo" class="marvel-logo">
            </a>
          </div>
          <div class="nav-right">
            <div class="auth-section">
              <a href="login.html" class="auth-link">
                <i class="fas fa-sign-in-alt"></i>
                <span>Ingresar</span>
              </a>
              <a href="register.html" class="auth-link register">
                <i class="fas fa-user-plus"></i>
                <span>Registrarse</span>
              </a>
            </div>
            <button class="hamburger-menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      `;
    } else {
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
            }">Colecciones - </a>
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
    }

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

  updateCollectionsCount() {
    if (!window.collectionsManager) return; // Guard clause

    const totalUnique = window.collectionsManager.getTotalUniqueComics();
    const collectionsLink = document.querySelector(
      '.nav-link[href="collections.html"]'
    );
    if (collectionsLink) {
      const countBadge =
        collectionsLink.querySelector(".count-badge") ||
        document.createElement("span");
      countBadge.className = "count-badge";
      countBadge.textContent = totalUnique;
      if (!collectionsLink.querySelector(".count-badge")) {
        collectionsLink.appendChild(countBadge);
      }
    }
  }
}

// Crear una instancia global
window.navbar = new Navbar();
