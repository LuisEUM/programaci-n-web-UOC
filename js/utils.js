// Funciones de utilidad
function findComicById(comics, id) {
    if (!comics.length) return null;
    return comics[0].id === id ? comics[0] : findComicById(comics.slice(1), id);
}

function calculateAveragePrice(comics) {
    if (!comics.length) return 0;
    return comics.reduce((acc, comic) => acc + comic.price, 0) / comics.length;
}

function getAffordableComicTitles(comics, maxPrice) {
    return comics
        .filter(comic => comic.price <= maxPrice)
        .map(comic => comic.title);
} 