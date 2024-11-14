class HeroesPagination extends Pagination {
    constructor(container, options = {}) {
        super(container, {
            ...options,
            itemsPerPage: options.itemsPerPage || 10
        });
    }

    // Método específico para actualizar la vista de héroes
    async updateHeroesView(heroes, offset, limit) {
        const container = document.getElementById("heroesContainer");
        container.innerHTML = "";

        if (heroes.length === 0) {
            container.innerHTML = '<div class="no-results">No se encontraron héroes.</div>';
            return;
        }

        // Mostrar solo los héroes de la página actual
        const paginatedHeroes = heroes.slice(offset, offset + limit);

        paginatedHeroes.forEach(hero => {
            const cardElement = Card.createBasicCard(
                hero,
                {
                    showId: true,
                    showMetadata: true,
                    extraClasses: 'hero-card'
                }
            );
            container.appendChild(cardElement);
        });

        // Actualizar la paginación
        this.update(heroes.length);
    }
} 