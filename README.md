# Marvel Comics Explorer

## 📊 Diagramas

### Diagrama de Clases

```mermaid
classDiagram
class Comic {
-id: number
-title: string
-price: number
-description: string
-thumbnail: object
-characters: array
-creators: array
-issueNumber: number
-pageCount: number
+getThumbnailURL()
+static fromAPI()
}

class Hero {
-id: number
-name: string
-description: string
-thumbnail: object
-comics: array
-modified: string
-resourceURI: string
+getThumbnailURL()
+static fromAPI()
}

class Collections {
-collections: object
-dataSource: string
+addCollection()
+removeCollection()
+isCollection()
+calculateAveragePrice()
+saveCollections()
+loadCollections()
}

class ComicsGrid {
-container: Element
-itemsPerPage: number
-currentPage: number
-currentFilters: object
+loadComics()
+createComicCard()
+updateFilters()
+setPage()
}

class HeroesGrid {
-container: Element
-itemsPerPage: number
-currentPage: number
-currentFilters: object
+loadHeroes()
+createHeroCard()
+updateFilters()
+setPage()
}

class ComicModal {
-modal: Element
+show()
+hide()
+updateModalContent()
}

class HeroModal {
-modal: Element
+show()
+hide()
+updateModalContent()
}

class CollectionModal {
-modal: Element
-currentAction: string
-currentComicId: number
+open()
+close()
+handleCollectionSelection()
+updateButtonStates()
}

class MarvelAPI {
+getComics()
+getHeroes()
+getComicById()
+getHeroById()
}

class DataService {
+static fetchItems()
+static fetchItemById()
+static processResponse()
}

ComicsGrid --> Comic
HeroesGrid --> Hero
ComicsGrid --> ComicModal
HeroesGrid --> HeroModal
ComicsGrid --> CollectionModal
DataService --> MarvelAPI
Comic ..> MarvelAPI
Hero ..> MarvelAPI
Collections --> Comic
```

### Diagrama de Flujo de Datos

```mermaid
flowchart TD
A[Usuario] -->|Interactúa| B[UI]
B -->|Búsqueda/Filtros| C[ComicsGrid/HeroesGrid]
C -->|Solicita Datos| D[DataService]
D -->|Consulta API| E[MarvelAPI]
E -->|Responde| D
D -->|Transforma| F[Comic/Hero]
F -->|Renderiza| C
C -->|Gestiona| G[Collections]
G -->|Persiste| H[LocalStorage]
C -->|Muestra| I[Modales]
I -->|Actualiza| G
```

### Diagrama de Componentes

```mermaid
graph TB
A[index.html] --> B[UI]
B --> C[ComicsGrid]
B --> D[HeroesGrid]
B --> E[ComicsSearch]
B --> F[HeroesSearch]
B --> G[FilterBadges]
B --> H[ComicsActionsBar]
B --> I[Navbar]
B --> J[HeroesCarousel]
C --> K[ComicModal]
C --> L[CollectionModal]
D --> M[HeroModal]
C & D --> N[Spinner]
K & L & M --> O[Accordion]
```

## 🛠️ Tecnologías y Patrones

### Tecnologías Core

- JavaScript ES6+
  - Clases y Herencia
  - Módulos ES6
  - Async/Await
  - LocalStorage
- HTML5 & CSS3
  - Grid Layout
  - Flexbox
  - Variables CSS
  - Animaciones
- Marvel API
  - REST API
  - Autenticación Hash
  - Endpoints de Comics y Heroes

### Patrones de Diseño

1. **Singleton**

   - Gestión de estado global (Collections)
   - Configuración centralizada
   - Instancia única de modales

2. **Observer**

   - Sistema de eventos para actualizaciones
   - Comunicación entre componentes
   - Manejo de cambios en colecciones

3. **Factory**

   - Creación de componentes UI
   - Transformación de datos API
   - Instanciación de modelos

4. **Proxy**
   - Validación de datos
   - Control de acceso
   - Caché de datos

## 📊 Características Principales

### Gestión de Comics

- Búsqueda por nombre, ID y héroe
- Filtrado por precio
- Vista detallada en modal
- Paginación dinámica

### Gestión de Héroes

- Búsqueda por nombre e ID
- Vista detallada con comics relacionados
- Carrusel de héroes populares
- Paginación avanzada

### Sistema de Colecciones

- Múltiples colecciones (Wishlist, Por Leer, Leyendo, Leídos, Favoritos)
- Mover y clonar comics entre colecciones
- Validación de duplicados
- Persistencia en LocalStorage

### Interfaz de Usuario

- Diseño responsive
- Animaciones fluidas
- Feedback visual (toasts)
- Modales interactivos

## 📂 Estructura del Proyecto

```
marvel-comics/
├── index.html
├── comics.html
├── heroes.html
├── collections.html
├── styles/
│   ├── comics.css
│   ├── heroes.css
│   ├── comicModal.css
│   ├── collection-modal.css
│   ├── navbar.css
│   └── spinner.css
├── js/
│   ├── models/
│   │   ├── Comic.js
│   │   ├── Hero.js
│   │   └── Collections.js
│   ├── components/
│   │   ├── ComicsGrid.js
│   │   ├── HeroesGrid.js
│   │   ├── ComicModal.js
│   │   ├── CollectionModal.js
│   │   ├── FilterBadges.js
│   │   ├── Spinner.js
│   │   └── Accordion.js
│   ├── controllers/
│   │   ├── comics.js
│   │   ├── heroes.js
│   │   └── collections.js
│   ├── services/
│   │   ├── MarvelAPI.js
│   │   ├── DataService.js
│   │   └── Config.js
│   └── utils/
│       └── utils.js
└── assets/
    └── images/
```

## 🔄 Ciclo de Desarrollo

```mermaid
graph TD
A[Análisis] -->|Requisitos| B[Diseño]
B -->|Arquitectura| C[Implementación]
C -->|Código| D[Testing]
D -->|Bugs| C
D -->|OK| E[Despliegue]
E -->|Feedback| A
```

## 📚 Objetivos Cumplidos

1. ✅ Sistema de búsqueda y filtrado avanzado
2. ✅ Gestión completa de colecciones
3. ✅ Interfaz moderna y responsive
4. ✅ Modales interactivos
5. ✅ Persistencia de datos
6. ✅ Optimización de rendimiento

## 📚 Referencias

- [Marvel API Documentation](https://developer.marvel.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Design Patterns](https://www.patterns.dev/)

## 📝 Licencia

Este proyecto es parte de una práctica académica y utiliza la API de Marvel bajo sus términos y condiciones.

Data provided by Marvel. © 2014 Marvel
