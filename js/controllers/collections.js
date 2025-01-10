/**
 * Controlador para la página de colecciones (collections.js)
 * Este controlador maneja la gestión de colecciones de cómics, incluyendo:
 * - Visualización de colecciones
 * - Movimiento de cómics entre colecciones
 * - Clonación de cómics
 * - Eliminación de cómics de colecciones
 * - Integración con modo mock/API
 */

// Variables globales para gestión de datos
let mockComicsData;
let collectionsManager;

/**
 * Carga los datos mock desde la configuración
 * Se utiliza cuando la aplicación está en modo mock
 */
async function loadMockData() {
  try {
    mockComicsData = { comics: Config.MOCK_DATA.comics };
  } catch (error) {
    console.error("Error loading mock data:", error);
  }
}

/**
 * Actualiza los contadores de cómics en cada colección
 * Se ejecuta después de cada operación que modifica las colecciones
 */
function updateCollectionCounts() {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
  const tabButtons = document.querySelectorAll(".tab-btn");

  // Actualizar contador en cada pestaña
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

// Inicialización del controlador
document.addEventListener("DOMContentLoaded", async function () {
  // Verificar autenticación del usuario
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  // Redirigir si no hay sesión activa
  if (!userToken || !userName) {
    window.location.href = "login.html";
    return;
  }

  // Cargar datos mock si es necesario
  if (Config.USE_MOCK_DATA) {
    await loadMockData();
  }

  // Inicializar y exponer el gestor de colecciones
  collectionsManager = new Collections();
  window.collectionsManager = collectionsManager;
  window.dispatchEvent(new CustomEvent("collectionsManagerReady"));

  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

  // Cargar colección inicial (Lista de Deseos)
  loadCollections("wishlist", collectionsManager);

  // Configurar listeners de eventos
  setupEventListeners(collectionsManager);
});

/**
 * Configura todos los event listeners necesarios
 * @param {Collections} collectionsManager - Instancia del gestor de colecciones
 */
function setupEventListeners(collectionsManager) {
  // Configurar botón de cierre de sesión
  const logoutButton = document.querySelector(".logout-button");
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
  });

  // Inicializar contadores
  updateCollectionCounts();

  // Escuchar actualizaciones de colecciones
  window.addEventListener("collectionsUpdated", updateCollectionCounts);

  // Configurar navegación por pestañas
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      // Actualizar estado visual de las pestañas
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Asegurar datos mock si es necesario
      if (Config.USE_MOCK_DATA && !mockComicsData) {
        await loadMockData();
      }

      // Cargar colección seleccionada
      const collection = this.dataset.collection;
      loadCollections(collection, collectionsManager);

      // Actualizar contadores
      updateCollectionCounts();
    });
  });
}

/**
 * Carga y muestra los cómics de una colección específica
 * @param {string} collection - Nombre de la colección a cargar
 * @param {Collections} collectionsManager - Instancia del gestor de colecciones
 */
async function loadCollections(collection, collectionsManager) {
  const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";
  const collectionsGrid = document.querySelector(".collections-grid");
  const noCollectionsMessage = document.querySelector(
    ".no-collections-message"
  );

  try {
    // Obtener IDs de cómics en la colección
    const collections =
      collectionsManager.getAllCollections(dataSource)[collection] || [];

    // Limpiar grid existente
    collectionsGrid.innerHTML = "";

    // Mostrar mensaje si la colección está vacía
    if (collections.length === 0) {
      collectionsGrid.style.display = "none";
      noCollectionsMessage.style.display = "block";
      return;
    }

    // Configurar visualización del grid
    collectionsGrid.style.display = "grid";
    noCollectionsMessage.style.display = "none";

    // Cargar y mostrar cada cómic
    for (const comicId of collections) {
      try {
        let comic;
        if (Config.USE_MOCK_DATA) {
          // Buscar en datos mock
          comic = mockComicsData?.comics?.find(
            (c) => c.id === parseInt(comicId)
          );
        } else {
          // Obtener de la API
          comic = await MarvelAPI.getComicById(parseInt(comicId));
        }

        if (comic) {
          // Formatear datos del cómic
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

          // Crear y añadir tarjeta del cómic
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

/**
 * Crea una tarjeta visual para un cómic
 * @param {Object} comic - Datos del cómic
 * @param {string} currentCollection - Colección actual del cómic
 * @param {Collections} collectionsManager - Instancia del gestor de colecciones
 * @returns {HTMLElement} Elemento DOM de la tarjeta
 */
function createComicCard(comic, currentCollection, collectionsManager) {
  const card = document.createElement("div");
  card.className = "comic-card";
  card.dataset.id = comic.id;

  // Formatear datos del cómic
  const price =
    typeof comic.price === "number" ? comic.price.toFixed(2) : "0.00";
  const description = comic.description || "Sin descripción disponible";
  const series = comic.series || "Serie no disponible";

  // Imagen de respaldo para cómics sin imagen
  const fallbackImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==";

  // Construir estructura HTML de la tarjeta
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

/**
 * Abre el modal para mover un cómic a otra colección
 * @param {string|number} comicId - ID del cómic a mover
 * @param {string} currentCollection - Colección actual del cómic
 */
function moveToCollection(comicId, currentCollection) {
  const modal = new CollectionModal();
  modal.open("move", comicId, currentCollection);
}

/**
 * Abre el modal para clonar un cómic a otra colección
 * @param {string|number} comicId - ID del cómic a clonar
 * @param {string} currentCollection - Colección actual del cómic
 */
function cloneToCollection(comicId, currentCollection) {
  const modal = new CollectionModal();
  modal.open("clone", comicId, currentCollection);
}

/**
 * Elimina un cómic de una colección
 * @param {string|number} comicId - ID del cómic a eliminar
 * @param {string} collection - Colección de la que eliminar
 */
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

/**
 * Maneja la selección de una colección en el modal
 * Permite mover o clonar un cómic entre colecciones
 * @param {string} targetCollection - Colección destino para el cómic
 */
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

/**
 * Muestra un mensaje toast en la interfaz
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje (info, success, error)
 */
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
