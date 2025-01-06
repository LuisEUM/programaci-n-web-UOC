class Hero {
  constructor(id, name, thumbnail) {
    this.id = id;
    this.name = name;
    this.thumbnail = thumbnail;
  }

  static fromAPI(data) {
    return new Hero(data.id, data.name, data.thumbnail);
  }

  getImageURL() {
    if (this.thumbnail && this.thumbnail.path && this.thumbnail.extension) {
      return `${this.thumbnail.path}.${this.thumbnail.extension}`;
    }
    return "assets/images/image-not-found.jpg";
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      thumbnail: this.thumbnail,
    };
  }
}
