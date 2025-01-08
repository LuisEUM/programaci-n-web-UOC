// Inicializar componentes cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar la cuadrícula de héroes
  const heroesGrid = new HeroesGrid();

  // Inicializar el componente de búsqueda
  new HeroesSearch(heroesGrid);
});
