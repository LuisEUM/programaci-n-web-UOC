// Modelos base
class Thumbnail {
    constructor(path, extension) {
        this.path = path;
        this.extension = extension;
    }
}

class Comic {
    constructor(id, title, issueNumber, description, pageCount, thumbnail, price, creators, characters) {
        this.id = id;
        this.title = title;
        this.issueNumber = issueNumber;
        this.description = description;
        this.pageCount = pageCount;
        this.thumbnail = thumbnail instanceof Thumbnail ? thumbnail : new Thumbnail(thumbnail.path, thumbnail.extension);
        this.price = price;
        this.creators = creators;
        this.characters = characters;
    }

    getThumbnailURL() {
        return `${this.thumbnail.path}.${this.thumbnail.extension}`;
    }
}

class Heroe {
    constructor(id, name, description, modified, thumbnail, resourceURI, comics) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.modified = modified;
        this.thumbnail = thumbnail instanceof Thumbnail ? thumbnail : new Thumbnail(thumbnail.path, thumbnail.extension);
        this.resourceURI = resourceURI;
        this.comics = comics;
    }

    getThumbnailURL() {
        return `${this.thumbnail.path}.${this.thumbnail.extension}`;
    }
}

class Favorites {
    constructor() {
        this.favorites = [];
    }

    addFavorite(comic) {
        if (!this.favorites.some(fav => fav.id === comic.id)) {
            this.favorites.push(comic);
            return true;
        }
        return false;
    }

    removeFavorite(comicId) {
        const initialLength = this.favorites.length;
        this.favorites = this.favorites.filter(comic => comic.id !== comicId);
        return this.favorites.length < initialLength;
    }

    showFavorites() {
        return this.favorites.map(comic => ({
            id: comic.id,
            title: comic.title
        }));
    }

    addMultipleFavorites(...comics) {
        return comics.map(comic => this.addFavorite(comic));
    }

    copyFavorites() {
        return [...this.favorites];
    }
} 