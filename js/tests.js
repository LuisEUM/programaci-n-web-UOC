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
            const comic1 = new Comic(1, "Test Comic 1", 1, "Description", 32, 
                { path: "test", extension: "jpg" }, 9.99, [], []);
            const comic2 = new Comic(2, "Test Comic 2", 2, "Description", 32, 
                { path: "test", extension: "jpg" }, 19.99, [], []);

            // Test addFavorite
            favorites.addFavorite(comic1);
            console.assert(favorites.findComicById(1) === comic1, 'Add favorite failed');

            // Test addMultipleFavorites (rest operator)
            favorites.addMultipleFavorites(comic1, comic2);
            console.assert(favorites.showFavorites().length === 2, 'Add multiple failed');

            // Test copyFavorites (spread operator)
            const copy = favorites.copyFavorites();
            console.assert(copy.length === 2, 'Copy favorites failed');

            // Test calculateAveragePrice (reduce)
            console.assert(favorites.calculateAveragePrice() === 14.99, 'Average price failed');

            // Test getAffordableComicTitles (map & filter)
            const affordable = favorites.getAffordableComicTitles(15);
            console.assert(affordable.length === 1, 'Affordable titles failed');

            console.log('✅ All Favorites tests passed');
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