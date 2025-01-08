/**
 * Configuración global de la aplicación
 * Centraliza las constantes y parámetros de configuración
 */
const Config = {
  // Endpoints y credenciales de la API de Marvel
  MARVEL_API_BASE_URL: "https://gateway.marvel.com/v1/public",
  MARVEL_PUBLIC_KEY: "9690fb126710ad21d39ffcf891e65d1f",
  MARVEL_PRIVATE_KEY: "66d08e2e9df5d20c37bb95d35f3b42bf2a48892f",

  // Modo de datos mock para desarrollo y pruebas
  USE_MOCK_DATA: true,

  // Configuración de paginación
  LIMIT: 10,

  // Colecciones predeterminadas para organizar cómics
  DEFAULT_COLLECTIONS: ["general", "reading", "wishlist"],

  // Inicializar la configuración de la fuente de datos
  init() {
    const storedPreference = localStorage.getItem("dataSourcePreference");
    this.USE_MOCK_DATA = storedPreference ? storedPreference === "mock" : true;
  },

  // Cambiar la fuente de datos y persistir la preferencia
  toggleDataSource() {
    this.USE_MOCK_DATA = !this.USE_MOCK_DATA;
    localStorage.setItem(
      "dataSourcePreference",
      this.USE_MOCK_DATA ? "mock" : "api"
    );
    return this.USE_MOCK_DATA;
  },
};
