class Tests {
  static runAll() {
    console.group("🧪 TESTS DE EVALUACIÓN PRA1");

    this.testComic();
    this.testHero();
    this.testFavorites();
    this.testRecursiveFunction();
    this.testReduceFunction();
    this.testRestOperator();
    this.testSpreadOperator();
    this.testMapAndFilter();

    this.testComicEncapsulation();
    this.testHeroEncapsulation();
    this.testFavoritesCollectionManagement();

    console.groupEnd();
  }

  static testComic() {
    console.group("1️⃣ Test Clase Comic (5 puntos)");
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

      // Verificar getters
      console.assert(comic.id === 1, "❌ Comic ID test failed");
      console.assert(
        comic.title === "Test Comic",
        "❌ Comic title test failed"
      );
      console.assert(comic.price === 9.99, "❌ Comic price test failed");

      // Verificar método getThumbnailURL
      console.assert(
        comic.getThumbnailURL() === "test/path.jpg",
        "❌ Comic thumbnail URL test failed"
      );

      // Verificar encapsulación
      console.assert(
        typeof comic.id === "number",
        "❌ Comic ID encapsulation failed"
      );

      console.log("✅ Todos los tests de Comic pasaron");
    } catch (error) {
      console.error("❌ Tests de Comic fallaron:", error);
    }
    console.groupEnd();
  }

  static testHero() {
    console.group("2️⃣ Test Clase Hero (5 puntos)");
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

      // Verificar getters
      console.assert(hero.id === 1, "❌ Hero ID test failed");
      console.assert(hero.name === "Test Hero", "❌ Hero name test failed");

      // Verificar método getThumbnailURL
      console.assert(
        hero.getThumbnailURL() === "test/path.jpg",
        "❌ Hero thumbnail URL test failed"
      );

      // Verificar encapsulación
      console.assert(
        Array.isArray(hero.comics),
        "❌ Hero comics encapsulation failed"
      );

      console.log("✅ Todos los tests de Hero pasaron");
    } catch (error) {
      console.error("❌ Tests de Hero fallaron:", error);
    }
    console.groupEnd();
  }

  static testFavorites() {
    console.group("3️⃣ Test Clase Favorites (5 puntos)");
    try {
      const favorites = new Favorites();
      const comic1 = new Comic(
        1,
        "Test Comic 1",
        1,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        9.99,
        [],
        []
      );
      const comic2 = new Comic(
        2,
        "Test Comic 2",
        2,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        19.99,
        [],
        []
      );

      // Test addFavorite
      favorites.addFavoriteComic(comic1);
      console.assert(
        favorites.showFavorites().length > 0,
        "❌ Add favorite failed"
      );

      // Test addMultipleFavorites (rest operator)
      favorites.addMultipleFavorites(comic1, comic2);
      console.assert(
        favorites.showFavorites().length === 2,
        "❌ Add multiple failed"
      );

      // Test showFavorites
      const shown = favorites.showFavorites();
      console.assert(Array.isArray(shown), "❌ Show favorites failed");

      console.log("✅ Todos los tests de Favorites pasaron");
    } catch (error) {
      console.error("❌ Tests de Favorites fallaron:", error);
    }
    console.groupEnd();
  }

  static testRecursiveFunction() {
    console.group("4️⃣ Test Función Recursiva findComicById (5 puntos)");
    try {
      const favorites = new Favorites();
      const comic = new Comic(
        1,
        "Test Comic",
        1,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        9.99,
        [],
        []
      );

      favorites.addFavoriteComic(comic);
      const found = favorites.findComicById(1);

      console.assert(found !== null, "❌ Find comic by ID failed");
      console.assert(found?.id === 1, "❌ Found comic ID mismatch");

      console.log("✅ Test de función recursiva pasó");
    } catch (error) {
      console.error("❌ Test de función recursiva falló:", error);
    }
    console.groupEnd();
  }

  static testReduceFunction() {
    console.group("5️⃣ Test Reduce calculateAveragePrice (5 puntos)");
    try {
      const favorites = new Favorites();
      const comic1 = new Comic(
        1,
        "Test Comic 1",
        1,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        10,
        [],
        []
      );
      const comic2 = new Comic(
        2,
        "Test Comic 2",
        2,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        20,
        [],
        []
      );

      favorites.addFavoriteComic(comic1);
      favorites.addFavoriteComic(comic2);

      const average = favorites.calculateAveragePrice();
      console.assert(average === 15, "❌ Calculate average price failed");

      console.log("✅ Test de reduce pasó");
    } catch (error) {
      console.error("❌ Test de reduce falló:", error);
    }
    console.groupEnd();
  }

  static testRestOperator() {
    console.group("6️⃣ Test Rest Operator addMultipleFavorites (5 puntos)");
    try {
      const favorites = new Favorites();
      const comics = [
        new Comic(
          1,
          "Test Comic 1",
          1,
          "Description",
          32,
          { path: "test", extension: "jpg" },
          9.99,
          [],
          []
        ),
        new Comic(
          2,
          "Test Comic 2",
          2,
          "Description",
          32,
          { path: "test", extension: "jpg" },
          19.99,
          [],
          []
        ),
      ];

      favorites.addMultipleFavorites(...comics);
      console.assert(
        favorites.showFavorites().length === 2,
        "❌ Rest operator test failed"
      );

      console.log("✅ Test de rest operator pasó");
    } catch (error) {
      console.error("❌ Test de rest operator falló:", error);
    }
    console.groupEnd();
  }

  static testSpreadOperator() {
    console.group("7️⃣ Test Spread Operator copyFavorites (5 puntos)");
    try {
      const favorites = new Favorites();
      const comic = new Comic(
        1,
        "Test Comic",
        1,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        9.99,
        [],
        []
      );

      favorites.addFavoriteComic(comic);
      const copy = favorites.copyFavorites();

      console.assert(Array.isArray(copy), "❌ Copy is not an array");
      console.assert(copy.length === 1, "❌ Copy length mismatch");
      console.assert(copy[0].id === comic.id, "❌ Copied comic mismatch");

      console.log("✅ Test de spread operator pasó");
    } catch (error) {
      console.error("❌ Test de spread operator falló:", error);
    }
    console.groupEnd();
  }

  static testMapAndFilter() {
    console.group("8️⃣ Test Map y Filter getAffordableComicTitles (5 puntos)");
    try {
      const favorites = new Favorites();
      const comic1 = new Comic(
        1,
        "Cheap Comic",
        1,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        5,
        [],
        []
      );
      const comic2 = new Comic(
        2,
        "Expensive Comic",
        2,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        15,
        [],
        []
      );

      favorites.addFavoriteComic(comic1);
      favorites.addFavoriteComic(comic2);

      const affordableComics = favorites.getAffordableComicTitles(10);
      console.assert(
        Array.isArray(affordableComics),
        "❌ Result is not an array"
      );
      console.assert(
        affordableComics.length === 1,
        "❌ Affordable comics count mismatch"
      );
      console.assert(
        affordableComics[0] === "Cheap Comic",
        "❌ Affordable comic title mismatch"
      );

      console.log("✅ Test de map y filter pasó");
    } catch (error) {
      console.error("❌ Test de map y filter falló:", error);
    }
    console.groupEnd();
  }

  static testComicEncapsulation() {
    console.group("🔒 Test Encapsulación Comic");
    try {
      const comic = new Comic(
        1,
        "Test Comic",
        1,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        9.99,
        [],
        []
      );

      // Verificar que las propiedades son privadas
      console.assert(
        comic["#id"] === undefined,
        "❌ ID no está correctamente encapsulado"
      );
      console.assert(
        comic["#title"] === undefined,
        "❌ Title no está correctamente encapsulado"
      );

      // Verificar getters
      console.assert(
        typeof comic.id === "number",
        "❌ Getter de ID no funciona"
      );
      console.assert(
        typeof comic.title === "string",
        "❌ Getter de title no funciona"
      );

      // Verificar que no se pueden modificar propiedades directamente
      try {
        comic.id = 2;
        console.assert(comic.id === 1, "❌ ID no debería ser modificable");
      } catch (e) {
        console.log("✅ ID está protegido contra modificaciones");
      }

      console.log("✅ Tests de encapsulación de Comic pasaron");
    } catch (error) {
      console.error("❌ Tests de encapsulación de Comic fallaron:", error);
    }
    console.groupEnd();
  }

  static testHeroEncapsulation() {
    console.group("🔒 Test Encapsulación Hero");
    try {
      const hero = new Hero(
        1,
        "Test Hero",
        "Description",
        "2024-01-01",
        { path: "test", extension: "jpg" },
        "test/uri",
        []
      );

      // Verificar que las propiedades son privadas
      console.assert(
        hero["#id"] === undefined,
        "❌ ID no está correctamente encapsulado"
      );
      console.assert(
        hero["#name"] === undefined,
        "❌ Name no está correctamente encapsulado"
      );

      // Verificar getters
      console.assert(
        typeof hero.id === "number",
        "❌ Getter de ID no funciona"
      );
      console.assert(
        typeof hero.name === "string",
        "❌ Getter de name no funciona"
      );

      console.log("✅ Tests de encapsulación de Hero pasaron");
    } catch (error) {
      console.error("❌ Tests de encapsulación de Hero fallaron:", error);
    }
    console.groupEnd();
  }

  static testFavoritesCollectionManagement() {
    console.group("📚 Test Gestión de Colecciones de Favoritos");
    try {
      const favorites = new Favorites();
      const comic1 = new Comic(
        1,
        "Test Comic 1",
        1,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        9.99,
        [],
        []
      );
      const comic2 = new Comic(
        2,
        "Test Comic 2",
        2,
        "Description",
        32,
        { path: "test", extension: "jpg" },
        19.99,
        [],
        []
      );

      // Test de addFavorite
      favorites.addFavoriteComic(comic1);
      console.assert(
        favorites.showFavorites().length === 1,
        "❌ addFavorite no funciona correctamente"
      );

      // Test de addMultipleFavorites con rest operator
      favorites.addMultipleFavorites(comic1, comic2);
      console.assert(
        favorites.showFavorites().length === 2,
        "❌ addMultipleFavorites no funciona correctamente"
      );

      // Test de copyFavorites con spread operator
      const copy = favorites.copyFavorites();
      console.assert(
        Array.isArray(copy),
        "❌ copyFavorites no retorna un array"
      );
      console.assert(
        copy.length === favorites.showFavorites().length,
        "❌ La copia no tiene la misma longitud"
      );

      // Test de búsqueda recursiva
      const found = favorites.findComicById(1);
      console.assert(found !== null, "❌ findComicById no encuentra el cómic");
      console.assert(
        found.id === 1,
        "❌ findComicById encuentra el cómic incorrecto"
      );

      // Test de cálculo de precio promedio
      const average = favorites.calculateAveragePrice();
      console.assert(
        Math.abs(average - 14.99) < 0.01,
        "❌ calculateAveragePrice calcula incorrectamente"
      );

      // Test de filtrado por precio
      const affordable = favorites.getAffordableComicTitles(15);
      console.assert(
        affordable.length === 1,
        "❌ getAffordableComicTitles filtra incorrectamente"
      );
      console.assert(
        affordable[0] === "Test Comic 1",
        "❌ getAffordableComicTitles retorna títulos incorrectos"
      );

      console.log("✅ Tests de gestión de colecciones pasaron");
    } catch (error) {
      console.error("❌ Tests de gestión de colecciones fallaron:", error);
    }
    console.groupEnd();
  }
}

// Ejecutar las pruebas cuando se carga el archivo
document.addEventListener("DOMContentLoaded", () => Tests.runAll());
