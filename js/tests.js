class Tests {
    static runAll() {
        this.testComic();
        this.testHero();
        this.testFavorites();
        this.testUtils();
    }

    static testComic() {
        console.group('Comic Tests');
        try {
            const comic = new Comic(
                1,
                "Test Comic",
                1,
                "Test Description",
                32,
                { path: "test/path", extension: "jpg" },
                9.99,
                ["Creator 1", "Creator 2"],
                ["Character 1", "Character 2"]
            );

            console.assert(comic.id === 1, 'Comic ID test failed');
            console.assert(comic.title === "Test Comic", 'Comic title test failed');
            console.assert(comic.price === 9.99, 'Comic price test failed');
            console.assert(comic.getThumbnailURL() === "test/path.jpg", 'Comic thumbnail URL test failed');

            console.log('✅ Comic tests passed');
        } catch (error) {
            console.error('❌ Comic tests failed:', error);
        }
        console.groupEnd();
    }

    static testHero() {
        console.group('Hero Tests');
        try {
            const hero = new Hero(
                1,
                "Test Hero",
                "Test Description",
                "2024-01-01",
                { path: "test/path", extension: "jpg" },
                "test/uri",
                ["Comic 1", "Comic 2"]
            );

            console.assert(hero.id === 1, 'Hero ID test failed');
            console.assert(hero.name === "Test Hero", 'Hero name test failed');
            console.assert(hero.getThumbnailURL() === "test/path.jpg", 'Hero thumbnail URL test failed');

            console.log('✅ Hero tests passed');
        } catch (error) {
            console.error('❌ Hero tests failed:', error);
        }
        console.groupEnd();
    }

    static testFavorites() {
        console.group('Favorites Tests');
        try {
            const favorites = new Favorites();
            
            // Test addFavorite
            favorites.addFavorite('mock', 'general', 1);
            console.assert(favorites.isFavorite('mock', 'general', 1), 'Add favorite test failed');

            // Test addMultipleFavorites
            favorites.addMultipleFavorites('mock', 'general', 2, 3, 4);
            console.assert(favorites.isFavorite('mock', 'general', 2), 'Add multiple favorites test failed');

            // Test copyFavorites
            const newCollectionName = favorites.copyFavorites('mock', 'general');
            console.assert(favorites.favorites.mock[newCollectionName], 'Copy favorites test failed');

            // Test calculateAveragePrice
            const comics = [
                { price: 10 },
                { price: 20 },
                { price: 30 }
            ];
            console.assert(favorites.calculateAveragePrice(comics) === 20, 'Calculate average price test failed');

            // Test getAffordableComicTitles
            const testComics = [
                { title: "Comic 1", price: 5 },
                { title: "Comic 2", price: 15 },
                { title: "Comic 3", price: 25 }
            ];
            const affordable = favorites.getAffordableComicTitles(testComics, 20);
            console.assert(affordable.length === 2, 'Get affordable comics test failed');

            console.log('✅ Favorites tests passed');
        } catch (error) {
            console.error('❌ Favorites tests failed:', error);
        }
        console.groupEnd();
    }

    static testUtils() {
        console.group('Utils Tests');
        try {
            // Test truncateText
            console.assert(
                Utils.truncateText("Hello World", 5) === "Hello...",
                'Truncate text test failed'
            );

            // Test generateUniqueId
            const id1 = Utils.generateUniqueId();
            const id2 = Utils.generateUniqueId();
            console.assert(id1 !== id2, 'Generate unique ID test failed');

            // Test deepClone
            const obj = { a: 1, b: { c: 2 } };
            const clone = Utils.deepClone(obj);
            console.assert(
                JSON.stringify(obj) === JSON.stringify(clone),
                'Deep clone test failed'
            );

            console.log('✅ Utils tests passed');
        } catch (error) {
            console.error('❌ Utils tests failed:', error);
        }
        console.groupEnd();
    }
}

// Ejecutar las pruebas cuando se carga el archivo
document.addEventListener('DOMContentLoaded', () => Tests.runAll());