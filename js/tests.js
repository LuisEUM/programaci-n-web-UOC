function ejecutarTests() {
    const tests = [];
    
    // Test 1: Creación de Comic
    try {
        const comicData = mockComics.comics[0];
        const comic = new Comic(
            comicData.id,
            comicData.title,
            comicData.issueNumber,
            comicData.description,
            comicData.pageCount,
            comicData.thumbnail,
            comicData.price,
            comicData.creators,
            comicData.characters
        );
        tests.push({
            name: '1. Creación de Comic',
            passed: comic instanceof Comic,
            message: 'Comic creado correctamente con todos sus atributos'
        });
    } catch (error) {
        tests.push({
            name: '1. Creación de Comic',
            passed: false,
            message: error.message
        });
    }

    // Test 2: Creación de Héroe
    try {
        const heroData = mockComics.heroes[0];
        const hero = new Heroe(
            heroData.id,
            heroData.name,
            heroData.description,
            heroData.modified,
            heroData.thumbnail,
            heroData.resourceURI,
            heroData.comics
        );
        tests.push({
            name: '2. Creación de Héroe',
            passed: hero instanceof Heroe,
            message: 'Héroe creado correctamente'
        });
    } catch (error) {
        tests.push({
            name: '2. Creación de Héroe',
            passed: false,
            message: error.message
        });
    }

    // Test 3: Gestión de Favoritos
    try {
        const favorites = new Favorites();
        const comic = new Comic(
            mockComics.comics[0].id,
            mockComics.comics[0].title,
            mockComics.comics[0].issueNumber,
            mockComics.comics[0].description,
            mockComics.comics[0].pageCount,
            mockComics.comics[0].thumbnail,
            mockComics.comics[0].price,
            mockComics.comics[0].creators,
            mockComics.comics[0].characters
        );
        
        favorites.addFavorite(comic);
        const hasFavorite = favorites.showFavorites().length === 1;
        
        tests.push({
            name: '3. Gestión de Favoritos',
            passed: hasFavorite,
            message: 'Favoritos gestionados correctamente'
        });
    } catch (error) {
        tests.push({
            name: '3. Gestión de Favoritos',
            passed: false,
            message: error.message
        });
    }

    return tests;
}

function testsTarea1() {
    const tests = [];
    try {
        const comic = new Comic(
            mockComics.comics[0].id,
            mockComics.comics[0].title,
            mockComics.comics[0].issueNumber,
            mockComics.comics[0].description,
            mockComics.comics[0].pageCount,
            mockComics.comics[0].thumbnail,
            mockComics.comics[0].price,
            mockComics.comics[0].creators,
            mockComics.comics[0].characters
        );
        
        tests.push({
            name: 'Creación y propiedades del cómic',
            passed: comic.id && comic.title && comic.price,
            message: 'El cómic tiene todas las propiedades requeridas'
        });

        tests.push({
            name: 'URL del thumbnail',
            passed: comic.getThumbnailURL() === `${mockComics.comics[0].thumbnail.path}.${mockComics.comics[0].thumbnail.extension}`,
            message: 'El método getThumbnailURL funciona correctamente'
        });
    } catch (error) {
        tests.push({
            name: 'Test de Comic',
            passed: false,
            message: error.message
        });
    }
    return tests;
}

function testsTarea2() {
    const tests = [];
    try {
        const comics = mockComics.comics.map(c => new Comic(
            c.id, c.title, c.issueNumber, c.description, 
            c.pageCount, c.thumbnail, c.price, c.creators, c.characters
        ));

        const foundComic = findComicById(comics, 2);
        tests.push({
            name: 'Búsqueda recursiva de cómic',
            passed: foundComic && foundComic.id === 2,
            message: 'La función findComicById encuentra correctamente el cómic'
        });

        const avgPrice = calculateAveragePrice(comics);
        tests.push({
            name: 'Cálculo de precio promedio',
            passed: typeof avgPrice === 'number' && avgPrice > 0,
            message: `Precio promedio calculado: $${avgPrice.toFixed(2)}`
        });
    } catch (error) {
        tests.push({
            name: 'Test de funciones de utilidad',
            passed: false,
            message: error.message
        });
    }
    return tests;
}

function testsTarea3() {
    const tests = [];
    try {
        const comics = mockComics.comics.map(c => new Comic(
            c.id, c.title, c.issueNumber, c.description, 
            c.pageCount, c.thumbnail, c.price, c.creators, c.characters
        ));

        const favorites = new Favorites();
        favorites.addMultipleFavorites(...comics);

        tests.push({
            name: 'Agregar múltiples favoritos',
            passed: favorites.showFavorites().length === comics.length,
            message: 'Múltiples cómics agregados correctamente'
        });

        const affordable = getAffordableComicTitles(comics, 13.00);
        tests.push({
            name: 'Filtrado de cómics asequibles',
            passed: Array.isArray(affordable) && affordable.length > 0,
            message: `Encontrados ${affordable.length} cómics asequibles`
        });

        const copy = favorites.copyFavorites();
        tests.push({
            name: 'Copia de favoritos',
            passed: copy.length === favorites.showFavorites().length,
            message: 'Copia de favoritos creada correctamente'
        });
    } catch (error) {
        tests.push({
            name: 'Test de operaciones con favoritos',
            passed: false,
            message: error.message
        });
    }
    return tests;
} 