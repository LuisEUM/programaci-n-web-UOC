class DataService {
    static async fetchItems(type, params = {}) {
        try {
            let response;
            console.log(`Fetching ${type} with params:`, params);
            switch(type) {
                case 'comics':
                    if (Config.USE_MOCK_DATA) {
                        const filteredComics = mockComics.comics.filter(comic => 
                            !params.titleStartsWith || 
                            comic.title.toLowerCase().includes(params.titleStartsWith.toLowerCase())
                        );
                        console.log('Filtered Comics:', filteredComics);
                        
                        // Aplicar paginación a los datos mock
                        const start = (params.offset || 0);
                        const end = start + (params.limit || Config.LIMIT);
                        const paginatedComics = filteredComics.slice(start, end);
                        
                        return {
                            results: paginatedComics,
                            total: filteredComics.length
                        };
                    } else {
                        response = await MarvelAPI.getComics(params);
                        console.log('API Response for Comics:', response);
                        return {
                            results: response.data.results,
                            total: response.data.total
                        };
                    }
                case 'heroes':
                    if (Config.USE_MOCK_DATA) {
                        const allHeroes = mockComics.heroes;
                        
                        // Aplicar paginación a los datos mock
                        const start = (params.offset || 0);
                        const limit = (params.limit || Config.LIMIT);
                        const paginatedHeroes = allHeroes.slice(start, start + limit);
                        
                        return {
                            results: paginatedHeroes,
                            total: allHeroes.length,
                            limit: limit,
                            offset: start,
                            count: paginatedHeroes.length
                        };
                    } else {
                        const response = await MarvelAPI.getHeroes(params);
                        return {
                            results: response.data.results,
                            total: response.data.total,
                            limit: response.data.limit,
                            offset: response.data.offset,
                            count: response.data.count
                        };
                    }
                default:
                    throw new Error('Invalid item type');
            }
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            throw error;
        }
    }

    static async fetchItemById(type, id) {
        try {
            switch(type) {
                case 'comics':
                    return await MarvelAPI.getComicById(id);
                case 'heroes':
                    return await MarvelAPI.getHeroById(id);
                default:
                    throw new Error('Invalid item type');
            }
        } catch (error) {
            console.error(`Error fetching ${type} by ID:`, error);
            throw error;
        }
    }

    static createCardOptions(type, item, selectedItems, favoritesManager) {
        console.log('Creating card options for:', item);
        
        const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';
        const isSelected = selectedItems?.has(item.id);
        const isFavorite = type === 'comics' ? 
            favoritesManager.isFavorite(dataSource, null, item.id) : 
            false;

        return {
            showId: true,
            selectable: type === 'comics',
            isSelected,
            showMetadata: true,
            onSelect: () => UI.toggleSelect(item.id),
            actions: this.getCardActions(type, item, isFavorite)
        };
    }

    static getCardActions(type, item, isFavorite) {
        if (type !== 'comics') return [];

        return [
            {
                className: `add-favorite-btn ${isFavorite ? 'added' : ''}`,
                icon: `${isFavorite ? 'fas' : 'far'} fa-heart`,
                text: isFavorite ? 'Añadido a Favoritos' : 'Añadir a Favoritos',
                onClick: () => UI.toggleIndividualFavorite(item.id)
            },
            {
                className: 'remove-favorite-btn',
                icon: 'fas fa-trash-alt',
                text: 'Remover de Favoritos',
                onClick: () => UI.removeIndividualFavorite(item.id)
            }
        ];
    }

    static async loadFavoriteItems(favoritesManager) {
        const dataSource = Config.USE_MOCK_DATA ? 'mock' : 'api';
        const collections = favoritesManager.getAllFavorites(dataSource);
        const results = [];

        for (const [collectionName, favoriteIds] of Object.entries(collections)) {
            if (favoriteIds.length > 0) {
                const items = await this.getFavoriteItems(dataSource, favoriteIds);
                if (items.length > 0) {
                    results.push({
                        name: favoritesManager.getCollectionDisplayName(collectionName),
                        items
                    });
                }
            }
        }

        return results;
    }

    static async getFavoriteItems(dataSource, ids) {
        if (!ids || ids.length === 0) return [];
        
        if (dataSource === 'mock') {
            return mockComics.comics.filter(comic => ids.includes(comic.id));
        } else {
            const items = [];
            for (const id of ids) {
                try {
                    const item = await MarvelAPI.getComicById(id);
                    if (item) items.push(item);
                } catch (error) {
                    console.error(`Error loading item ${id}:`, error);
                }
            }
            return items;
        }
    }
} 