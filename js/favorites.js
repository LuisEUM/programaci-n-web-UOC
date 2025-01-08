// Al inicio del archivo, importar los datos mock
let mockComicsData;

// Función para cargar los datos mock
async function loadMockData() {
  try {
    const response = await fetch("js/data/comics.json");
    mockComicsData = await response.json();
  } catch (error) {
    console.error("Error loading mock data:", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  // Verificar autenticación
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  if (!userToken || !userName) {
    window.location.href = "login.html";
    return;
  }

  // Cargar datos mock primero si estamos en modo mock
  if (Config.USE_MOCK_DATA) {
    await loadMockData();
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
    button.addEventListener("click", async function () {
      // Actualizar estado activo de los tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Asegurarse de que los datos mock estén cargados si es necesario
      if (Config.USE_MOCK_DATA && !mockComicsData) {
        await loadMockData();
      }

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

  try {
    // Obtener los IDs de los cómics de la colección
    const favorites =
      favoritesManager.getAllFavorites(dataSource)[collection] || [];

    // Limpiar grid
    favoritesGrid.innerHTML = "";

    if (favorites.length === 0) {
      favoritesGrid.style.display = "none";
      noFavoritesMessage.style.display = "block";
      return;
    }

    favoritesGrid.style.display = "grid";
    noFavoritesMessage.style.display = "none";

    // Cargar los datos completos de los cómics
    for (const comicId of favorites) {
      try {
        let comic;
        if (Config.USE_MOCK_DATA) {
          // Buscar en los datos mock
          comic = mockComicsData?.comics?.find(
            (c) => c.id === parseInt(comicId)
          );
        } else {
          // Obtener datos de la API
          comic = await MarvelAPI.getComicById(parseInt(comicId));
        }

        if (comic) {
          // Transformar los datos del cómic al formato necesario
          const formattedComic = {
            id: comic.id,
            title: comic.title || "Sin título",
            description: comic.description || "Sin descripción disponible",
            image: comic.thumbnail
              ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
              : null,
            price: comic.price || 0,
            series: comic.series || "Serie no disponible",
          };

          const card = createComicCard(
            formattedComic,
            collection,
            favoritesManager
          );
          favoritesGrid.appendChild(card);
        } else {
          console.error(`Comic with ID ${comicId} not found`);
          showToast(`No se encontró el cómic con ID ${comicId}`, "error");
        }
      } catch (error) {
        console.error(`Error loading comic ${comicId}:`, error);
        showToast(`Error al cargar el cómic ${comicId}`, "error");
      }
    }
  } catch (error) {
    console.error("Error loading favorites:", error);
    showToast("Error al cargar los favoritos", "error");
  }
}

function createComicCard(comic, currentCollection, favoritesManager) {
  const card = document.createElement("div");
  card.className = "comic-card";
  card.dataset.id = comic.id;

  // Asegurarse de que el precio sea un número válido
  const price =
    typeof comic.price === "number" ? comic.price.toFixed(2) : "0.00";
  const description = comic.description || "Sin descripción disponible";
  const series = comic.series || "Serie no disponible";

  // Imagen de respaldo en base64 (un placeholder gris simple)
  const fallbackImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==";

  card.innerHTML = `
    <div class="comic-image">
      <img src="${comic.image || fallbackImage}" alt="${
    comic.title
  }" onerror="this.src='${fallbackImage}'">
    </div>
    <div class="comic-info">
      <h3 class="comic-title">${comic.title}</h3>
      <p class="comic-description">${description}</p>
      <div class="comic-meta">
        <span class="series">${series}</span>
        <span class="price">$${price}</span>
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
