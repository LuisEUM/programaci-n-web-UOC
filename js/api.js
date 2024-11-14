const MarvelAPI = {
    /**
     * Transforma los datos de la API al formato de nuestra aplicación
     * @param {Object} apiComic - Datos del cómic desde la API
     * @returns {Object} Datos transformados
     * @private
     */
    transformComicData(apiComic) {
        return {
            id: apiComic.id || 0,
            title: apiComic.title || "Sin título",
            issueNumber: apiComic.issueNumber || 0,
            description: apiComic.description || "No description available",
            pageCount: apiComic.pageCount || 1,
            thumbnail: {
                path: apiComic.thumbnail?.path || "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available",
                extension: apiComic.thumbnail?.extension || "jpg",
            },
            price: apiComic.prices?.[0]?.price || 0,
            creators: apiComic.creators?.items?.map((creator) => creator.name) || [],
            characters: apiComic.characters?.items?.map((char) => char.name) || [],
        };
    },

    /**
     * Obtiene una lista de cómics
     * @param {Object} params - Parámetros adicionales para la búsqueda
     * @returns {Promise<Array>} Lista de cómics
     */
    async getComics(params = {}) {
        const timestamp = new Date().getTime().toString();
        const hash = Utils.generateMarvelHash(
            timestamp,
            Config.MARVEL_PRIVATE_KEY,
            Config.MARVEL_PUBLIC_KEY
        );

        const queryParams = new URLSearchParams({
            ts: timestamp,
            apikey: Config.MARVEL_PUBLIC_KEY,
            hash: hash,
            limit: params.limit || Config.LIMIT,
            offset: params.offset || 0,
            ...(params.titleStartsWith && { titleStartsWith: params.titleStartsWith }),
            ...(params.orderBy && { orderBy: params.orderBy })
        });

        try {
            const response = await fetch(`${Config.MARVEL_API_BASE_URL}/comics?${queryParams}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Marvel API error: ${response.status} - ${errorData.message || "Unknown error"}`);
            }

            const data = await response.json();
            return {
                results: data.data.results.map(comic => this.transformComicData(comic)),
                total: data.data.total
            };
        } catch (error) {
            console.error("Error fetching comics:", error);
            throw error;
        }
    },

    /**
     * Obtiene un cómic específico por su ID
     * @param {number} comicId - ID del cómic
     * @returns {Promise<Object>} Datos del cómic
     */
    async getComicById(comicId) {
        const timestamp = new Date().getTime().toString();
        const hash = Utils.generateMarvelHash(
            timestamp,
            Config.MARVEL_PRIVATE_KEY,
            Config.MARVEL_PUBLIC_KEY
        );

        const queryParams = new URLSearchParams({
            ts: timestamp,
            apikey: Config.MARVEL_PUBLIC_KEY,
            hash: hash
        });

        try {
            const response = await fetch(`${Config.MARVEL_API_BASE_URL}/comics/${comicId}?${queryParams}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Marvel API error: ${response.status} - ${errorData.message || "Unknown error"}`);
            }

            const data = await response.json();
            return this.transformComicData(data.data.results[0]);
        } catch (error) {
            console.error("Error fetching comic:", error);
            throw error;
        }
    }
};
