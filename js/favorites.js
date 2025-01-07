document.addEventListener("DOMContentLoaded", function () {
  // Verificar autenticación
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  if (!userToken || !userName) {
    window.location.href = "login.html";
    return;
  }

  // Inicializar manejador de favoritos
  const favoritesManager = new Favorites();
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

  // Cargar favoritos iniciales (Lista de Deseos por defecto)
  loadFavorites("wishlist", favoritesManager);

  // Event Listeners
  setupEventListeners(favoritesManager);
});

function setupEventListeners(favoritesManager) {
  // Logout
  const logoutButton = document.querySelector(".logout-button");
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
  });

  // Tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Actualizar estado activo de los tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Cargar favoritos de la colección seleccionada
      const collection = this.dataset.collection;
      loadFavorites(collection, favoritesManager);
    });
  });
}

async function loadFavorites(collection, favoritesManager) {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
  const favoritesGrid = document.querySelector(".favorites-grid");
  const noFavoritesMessage = document.querySelector(".no-favorites-message");

  // Obtener los IDs de los cómics de la colección
  const favorites =
    favoritesManager.getAllFavorites(dataSource)[collection] || [];

  // Limpiar grid
  favoritesGrid.innerHTML = "";

  if (favorites.length === 0) {
    favoritesGrid.style.display = "none";
    noFavoritesMessage.style.display = "block";
  } else {
    favoritesGrid.style.display = "grid";
    noFavoritesMessage.style.display = "none";

    // Cargar los datos completos de los cómics
    for (const comicId of favorites) {
      try {
        const comic = await DataService.fetchItemById("comics", comicId);
        if (comic) {
          const card = createComicCard(comic, collection, favoritesManager);
          favoritesGrid.appendChild(card);
        }
      } catch (error) {
        console.error(`Error loading comic ${comicId}:`, error);
      }
    }
  }
}

function createComicCard(comic, currentCollection, favoritesManager) {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
  const card = document.createElement("div");
  card.className = "comic-card";
  card.dataset.id = comic.id;

  card.innerHTML = `
    <div class="comic-image">
      <img src="${comic.image}" alt="${comic.title}">
    </div>
    <div class="comic-info">
      <h3 class="comic-title">${comic.title}</h3>
      <p class="comic-description">${comic.description}</p>
      <div class="comic-meta">
        <span class="series">${comic.series}</span>
        <span class="price">$${comic.price.toFixed(2)}</span>
      </div>
      <button class="remove-favorite-btn" onclick="removeFromCollection('${
        comic.id
      }', '${currentCollection}')">
        <i class="fas fa-trash"></i>
        Remover de favoritos
      </button>
    </div>
  `;

  return card;
}

function removeFromCollection(comicId, collection) {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
  const favoritesManager = new Favorites();

  // Remover el cómic de la colección
  favoritesManager.removeFavorite(dataSource, collection, comicId);

  // Mostrar mensaje de éxito
  showToast("Cómic removido de favoritos", "success");

  // Recargar la colección actual
  loadFavorites(collection, favoritesManager);
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}
