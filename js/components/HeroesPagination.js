class HeroesPagination extends Pagination {
    constructor(container, options = {}) {
        super(container, {
            ...options,
            itemsPerPage: options.itemsPerPage || 10
        });
    }

    async updateHeroesView(heroes, total, offset, limit) {
        const container = document.getElementById("heroesContainer");
        container.innerHTML = "";

        if (heroes.length === 0) {
            container.innerHTML = '<div class="no-results">No se encontraron héroes.</div>';
            return;
        }

        heroes.forEach(hero => {
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

        // Actualizar la paginación con el total real
        this.update(total);
        this.currentPage = Math.floor(offset / limit) + 1;
    }
} 