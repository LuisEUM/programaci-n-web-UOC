// Al inicio del archivo, importar los datos mock
let mockComicsData;
let collectionsManager;

// Función para cargar los datos mock
async function loadMockData() {
  try {
    const response = await fetch("data/comics.json");
    mockComicsData = await response.json();
  } catch (error) {
    console.error("Error loading mock data:", error);
  }
}

// Función para actualizar contadores
function updateCollectionCounts() {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    const collection = button.dataset.collection;
    const collections =
      collectionsManager.getAllCollections(dataSource)[collection] || [];
    const countSpan = button.querySelector(".collection-count");
    if (countSpan) {
      countSpan.textContent = `(${collections.length})`;
    }
  });
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

  // Inicializar manejador de colecciones
  collectionsManager = new Collections();
  window.collectionsManager = collectionsManager; // Make it globally available

  // Dispatch event to notify collectionsManager is ready
  window.dispatchEvent(new CustomEvent("collectionsManagerReady"));

  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

  // Cargar colecciones iniciales (Lista de Deseos por defecto)
  loadCollections("wishlist", collectionsManager);

  // Event Listeners
  setupEventListeners(collectionsManager);
});

function setupEventListeners(collectionsManager) {
  // Logout
  const logoutButton = document.querySelector(".logout-button");
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
  });

  // Update counts initially
  updateCollectionCounts();

  // Listen for collection updates
  window.addEventListener("collectionsUpdated", updateCollectionCounts);

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

      // Cargar colecciones de la colección seleccionada
      const collection = this.dataset.collection;
      loadCollections(collection, collectionsManager);

      // Update counts after loading
      updateCollectionCounts();
    });
  });
}

async function loadCollections(collection, collectionsManager) {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
  const collectionsGrid = document.querySelector(".collections-grid");
  const noCollectionsMessage = document.querySelector(
    ".no-collections-message"
  );

  try {
    // Obtener los IDs de los cómics de la colección
    const collections =
      collectionsManager.getAllCollections(dataSource)[collection] || [];

    // Limpiar grid
    collectionsGrid.innerHTML = "";

    if (collections.length === 0) {
      collectionsGrid.style.display = "none";
      noCollectionsMessage.style.display = "block";
      return;
    }

    collectionsGrid.style.display = "grid";
    noCollectionsMessage.style.display = "none";

    // Cargar los datos completos de los cómics
    for (const comicId of collections) {
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
            collectionsManager
          );
          collectionsGrid.appendChild(card);
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
    console.error("Error loading collections:", error);
    showToast("Error al cargar los colecciones", "error");
  }
}

function createComicCard(comic, currentCollection, collectionsManager) {
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
      <div class="comic-actions">
        <button class="move-collection-btn" onclick="moveToCollection('${
          comic.id
        }', '${currentCollection}')">
          <i class="fas fa-exchange-alt"></i>
          Mover a otra colección
        </button>
        <button class="clone-collection-btn" onclick="cloneToCollection('${
          comic.id
        }', '${currentCollection}')">
          <i class="fas fa-clone"></i>
          Clonar a otra colección
        </button>
        <button class="remove-collection-btn" onclick="removeFromCollection('${
          comic.id
        }', '${currentCollection}')">
          <i class="fas fa-trash"></i>
          Remover de Colección
        </button>
      </div>
    </div>
  `;

  return card;
}

// Función para mover un cómic a otra colección
function moveToCollection(comicId, currentCollection) {
  const modal = new CollectionModal();
  modal.open("move", comicId, currentCollection);
}

// Función para clonar un cómic a otra colección
function cloneToCollection(comicId, currentCollection) {
  const modal = new CollectionModal();
  modal.open("clone", comicId, currentCollection);
}

// Función para remover un cómic de una colección
function removeFromCollection(comicId, collection) {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

  try {
    // Convertir comicId a número si es string
    comicId = parseInt(comicId);

    // Remover el cómic de la colección
    collectionsManager.removeCollection(dataSource, collection, comicId);

    // Guardar cambios
    collectionsManager.saveCollections();

    // Recargar la vista actual
    loadCollections(collection, collectionsManager);

    showToast("Cómic removido de la colección", "success");
  } catch (error) {
    console.error("Error removing comic:", error);
    showToast("Error al remover el cómic", "error");
  }
}

// Función para manejar la selección de colección en el modal
function handleModalSelection(targetCollection) {
  const modal = document.getElementById("collectionModal");
  const comicId = modal.dataset.comicId;
  const currentCollection = modal.dataset.currentCollection;
  const action = modal.dataset.action;
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

  if (action === "move") {
    // Remover de la colección actual
    collectionsManager.removeCollection(dataSource, currentCollection, comicId);
    // Añadir a la nueva colección
    collectionsManager.addCollection(dataSource, targetCollection, comicId);
    showToast("Cómic movido exitosamente", "success");
  } else if (action === "clone") {
    // Solo añadir a la nueva colección
    collectionsManager.addCollection(dataSource, targetCollection, comicId);
    showToast("Cómic clonado exitosamente", "success");
  }

  // Cerrar el modal y recargar la vista
  modal.style.display = "none";
  loadCollections(currentCollection, collectionsManager);
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
