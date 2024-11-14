const MarvelAPI = {
    BASE_URL: Config.MARVEL_API_BASE_URL,
    PUBLIC_KEY: Config.MARVEL_PUBLIC_KEY,
    PRIVATE_KEY: Config.MARVEL_PRIVATE_KEY,

    generateHash(timestamp) {
        return Utils.generateMarvelHash(
            timestamp,
            this.PRIVATE_KEY,
            this.PUBLIC_KEY
        );
    },

    /**
     * Transforma los datos de la API al formato de nuestra aplicación
     * @param {Object} apiComic - Datos del cómic desde la API
     * @returns {Object} Datos transformados
     * @private
     */
    transformComicData(apiComic) {
        if (!apiComic) return null;
        
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
            price: Config.USE_MOCK_DATA ? 
                (apiComic.price || 0) : 
                (apiComic.prices?.[0]?.price || 0),
            creators: Config.USE_MOCK_DATA ? 
                (apiComic.creators || []) : 
                (Array.isArray(apiComic.creators?.items) ? 
                    apiComic.creators.items.map(creator => creator.name) : 
                    []),
            characters: Config.USE_MOCK_DATA ? 
                (apiComic.characters || []) : 
                (Array.isArray(apiComic.characters?.items) ? 
                    apiComic.characters.items.map(char => char.name) : 
                    [])
        };
    },

    /**
     * Obtiene una lista de cómics
     * @param {Object} params - Parámetros adicionales para la búsqueda
     * @returns {Promise<Array>} Lista de cómics
     */
    async getComics(params = {}) {
        if (Config.USE_MOCK_DATA) {
            return new Promise((resolve) => {
                const filteredComics = mockComics.comics.filter(comic => 
                    !params.titleStartsWith || comic.title.toLowerCase().includes(params.titleStartsWith.toLowerCase())
                );
                resolve({
                    results: filteredComics.map(comic => this.transformComicData(comic)),
                    total: filteredComics.length
                });
            });
        }

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
            ...(params.titleStartsWith && { titleStartsWith: params.titleStartsWith })
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
        if (Config.USE_MOCK_DATA) {
            return new Promise((resolve) => {
                const comic = mockComics.comics.find(c => c.id === comicId);
                resolve(this.transformComicData(comic));
            });
        }

        try {
            const timestamp = new Date().getTime().toString();
            const hash = this.generateHash(timestamp);
            
            const queryParams = new URLSearchParams({
                ts: timestamp,
                apikey: this.PUBLIC_KEY,
                hash: hash
            });
            
            const response = await fetch(
                `${this.BASE_URL}/comics/${comicId}?${queryParams}`
            );
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            if (data.data && data.data.results && data.data.results.length > 0) {
                return this.transformComicData(data.data.results[0]);
            }
            return null;
        } catch (error) {
            console.error('Error fetching comic by ID:', error);
            throw error;
        }
    },

    /**
     * Obtiene una lista de héroes
     * @param {Object} params - Parámetros adicionales para la búsqueda
     * @returns {Promise<Array>} Lista de héroes
     */
    async getHeroes(params = {}) {
        if (Config.USE_MOCK_DATA) {
            return new Promise((resolve) => {
                resolve(mockComics.heroes.map(hero => this.transformHeroData(hero)));
            });
        }

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
            ...(params.nameStartsWith && { nameStartsWith: params.nameStartsWith })
        });
        try {
            const response = await fetch(`${Config.MARVEL_API_BASE_URL}/characters?${queryParams}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Marvel API error: ${response.status} - ${errorData.message || "Unknown error"}`);
            }
            const data = await response.json();
            return data.data.results.map(hero => this.transformHeroData(hero));
        } catch (error) {
            console.error("Error fetching heroes:", error);
            throw error;
        }
    },

    transformHeroData(apiHero) {
        if (!apiHero) return null;

        return {
            id: apiHero.id || 0,
            name: apiHero.name || "Sin nombre",
            description: apiHero.description || "No description available",
            modified: apiHero.modified || "",
            thumbnail: {
                path: apiHero.thumbnail?.path || "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available",
                extension: apiHero.thumbnail?.extension || "jpg",
            },
            comics: Array.isArray(apiHero.comics?.items)
                ? apiHero.comics.items.map(comic => comic.name)
                : [],
            series: Array.isArray(apiHero.series?.items)
                ? apiHero.series.items.map(serie => serie.name)
                : []
        };
    },

    async getAllComics() {
        const comics = [];
        let offset = 0;
        const limit = 100; // Puedes ajustar el límite según tus necesidades
        let total = 0;

        do {
            const response = await this.fetchComics(offset, limit);
            const data = response.data;
            total = data.total;
            comics.push(...data.results);
            offset += limit;
        } while (offset < total);

        return comics;
    },

    fetchComics(offset, limit) {
        const ts = Date.now().toString();
        const hash = CryptoJS.MD5(ts + Config.MARVEL_PRIVATE_KEY + Config.MARVEL_PUBLIC_KEY).toString();
        const url = `${this.BASE_URL}/comics?apikey=${Config.MARVEL_PUBLIC_KEY}&ts=${ts}&hash=${hash}&offset=${offset}&limit=${limit}`;
    
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error fetching comics:', error);
                throw error;
            });
    }
};


