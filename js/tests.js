// Sistema de pruebas mejorado
const TestRunner = {
    results: [],
    
    run() {
        this.results = [];
        console.log('🧪 Iniciando pruebas...\n');
        
        this.testThumbnail();
        this.testComic();
        this.testFavorites();
        this.testUtils();
        
        this.showResults();
    },

    assert(description, condition) {
        const result = {
            description,
            passed: condition,
            timestamp: new Date()
        };
        this.results.push(result);
        return result;
    },

    testThumbnail() {
        const thumbnail = new Thumbnail('http://example.com/image', 'jpg');
        this.assert('Thumbnail - Creación correcta', 
            thumbnail.path === 'http://example.com/image' && 
            thumbnail.extension === 'jpg'
        );
    },

    testComic() {
        const thumbnail = new Thumbnail('http://example.com/image', 'jpg');
        const comic = new Comic(1, 'Test Comic', 1, 'Description', 32, thumbnail, 3.99, {}, []);
        
        this.assert('Comic - Creación correcta', 
            comic.id === 1 && comic.title === 'Test Comic'
        );
        this.assert('Comic - URL de thumbnail', 
            comic.getThumbnailURL() === 'http://example.com/image.jpg'
        );
    },

    testFavorites() {
        const favorites = new Favorites();
        const comic = new Comic(1, 'Test Comic', 1, 'Description', 32, 
            new Thumbnail('http://example.com/image', 'jpg'), 3.99, {}, []);
        
        favorites.addFavorite(comic);
        this.assert('Favorites - Añadir comic', favorites.favorites.length === 1);
        
        favorites.removeFavorite(1);
        this.assert('Favorites - Eliminar comic', favorites.favorites.length === 0);
    },

    testUtils() {
        const comics = [
            new Comic(1, 'Comic 1', 1, 'Description', 32, 
                new Thumbnail('http://example.com/image', 'jpg'), 3.99, {}, []),
            new Comic(2, 'Comic 2', 2, 'Description', 32, 
                new Thumbnail('http://example.com/image', 'jpg'), 4.99, {}, [])
        ];

        this.assert('Utils - Búsqueda por ID', 
            findComicById(comics, 1)?.id === 1
        );
        this.assert('Utils - Precio promedio', 
            calculateAveragePrice(comics) === 4.49
        );
        this.assert('Utils - Filtrado por precio', 
            getAffordableComicTitles(comics, 4.00).length === 1
        );
    },

    showResults() {
        const output = document.getElementById('output');
        output.innerHTML = '<h2>Resultados de las pruebas:</h2>';

        this.results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.className = `test-result ${result.passed ? 'test-success' : 'test-failure'}`;
            resultDiv.textContent = `${result.passed ? '✅' : '❌'} ${result.description}`;
            output.appendChild(resultDiv);
            
            console.log(`${result.passed ? '✅' : '❌'} ${result.description}`);
        });

        const summary = document.createElement('div');
        const passed = this.results.filter(r => r.passed).length;
        summary.className = 'test-summary';
        summary.textContent = `Total: ${this.results.length} | Pasaron: ${passed} | Fallaron: ${this.results.length - passed}`;
        output.appendChild(summary);
    }
}; 