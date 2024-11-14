# Marvel Comics Explorer

## 📊 Diagramas

### Diagrama de Clases

```mermaid
classDiagram
class Comic {
-id: number
-title: string
-price: number
+getThumbnailURL()
+static fromAPI()
}
class Hero {
-id: number
-name: string
+getThumbnailURL()
+static fromAPI()
}
class Favorites {
-favorites: Array
+addFavorite()
+removeFavorite()
+calculateAveragePrice()
}
class UI {
+init()
+renderItems()
+handleSearch()
}
class DataService {
+static fetchItems()
+static fetchItemById()
}
class MarvelAPI {
+getComics()
+getHeroes()
}
UI --> DataService
DataService --> MarvelAPI
UI --> Favorites
Favorites --> Comic
DataService --> Comic
DataService --> Hero
```

### Diagrama de Flujo de Datos

```mermaid
flowchart TD
A[Usuario] -->|Interactúa| B[UI]
B -->|Solicita Datos| C[DataService]
C -->|Consulta| D[MarvelAPI]
D -->|Responde| C
C -->|Transforma| E[Comic/Hero]
E -->|Renderiza| B
B -->|Gestiona| F[Favorites]
F -->|Persiste| G[LocalStorage]
```

### Diagrama de Componentes

```mermaid
graph TB
A[index.html] --> B[UI]
B --> C[Card]
B --> D[Pagination]
B --> E[CollectionModal]
B --> F[MainTabs]
B --> G[CollectionsTabs]
C --> H[Comic]
C --> I[Hero]
G --> J[Favorites]
```

## 🛠️ Tecnologías y Patrones

### Tecnologías Core

- JavaScript ES6+
  - Campos privados
  - Módulos ES6
  - Async/Await
- HTML5 & CSS3
  - Grid Layout
  - Flexbox
  - Variables CSS
- Marvel API
  - REST API
  - Autenticación Hash
- LocalStorage
  - Persistencia de datos
  - Gestión de estado

### Patrones de Diseño

1. **Singleton**

   - Gestión de estado global
   - Configuración centralizada
   - Instancia única de servicios

2. **Observer**

   - Sistema de eventos
   - Actualizaciones de UI
   - Comunicación entre componentes

3. **Factory**

   - Creación de componentes
   - Transformación de datos
   - Instanciación de objetos

4. **Proxy**
   - Validación de datos
   - Control de acceso
   - Caché de datos

### Principios SOLID

1. **Single Responsibility**

   - Clases con propósito único
   - Separación de responsabilidades
   - Cohesión alta

2. **Open/Closed**

   - Extensibilidad de componentes
   - Herencia y composición
   - Plugins y middleware

3. **Interface Segregation**

   - APIs específicas
   - Contratos claros
   - Dependencias mínimas

4. **Dependency Inversion**
   - Inyección de dependencias
   - Acoplamiento reducido
   - Inversión de control

## 📊 Características Técnicas

### Encapsulación

```javascript
class Comic {
  #id;
  #title;
  #price;

  constructor(id, title, price) {
    this.#validateData(id, title, price);
    this.#id = id;
    this.#title = title;
    this.#price = price;
  }
}
```

### Programación Funcional

```javascript
const affordableComics = comics
  .filter((comic) => comic.price <= maxPrice)
  .map((comic) => comic.title);
```

### Asincronía

```javascript
async function loadComics() {
  try {
    const response = await DataService.fetchItems("comics");
    return response.results;
  } catch (error) {
    console.error(error);
  }
}
```

## 🧪 Testing

### Tests Unitarios

```mermaid
flowchart LR
A[Test Runner] -->|Ejecuta| B[Comic Tests]
A -->|Ejecuta| C[Hero Tests]
A -->|Ejecuta| D[Favorites Tests]
B --> E[Assertions]
C --> E
D --> E
```

### Cobertura

- Clases principales
  - Comic
  - Hero
  - Favorites
- Métodos críticos
  - addFavorite
  - calculateAveragePrice
  - findComicById
- Casos edge
  - Datos inválidos
  - Límites de paginación
  - Estado vacío

## 📱 Responsive Design

- Grid system adaptativo
- Media queries
- Mobile-first approach
- Flexbox layout

## 🔐 Seguridad

- Validación de inputs
- Sanitización de datos
- Control de acceso
- Manejo seguro de API keys

## 🚀 Performance

- Lazy loading
- Paginación eficiente
- Caché local
- Optimización de re-renders

## 📂 Estructura del Proyecto

```
marvel-comics/
├── index.html
├── tests.html
├── styles/
│   └── main.css
├── js/
│   ├── classes/
│   │   ├── Comic.js
│   │   ├── Hero.js
│   │   └── Favorites.js
│   ├── components/
│   │   ├── Card.js
│   │   ├── Pagination.js
│   │   └── ...
│   ├── services/
│   │   └── DataService.js
│   ├── api.js
│   ├── config.js
│   ├── ui.js
│   └── utils.js
└── README.md
```

## 🤝 Contribución

El proyecto está estructurado para facilitar contribuciones futuras:

- Código modular
- Documentación exhaustiva
- Tests automatizados

## 📝 Licencia

Este proyecto es parte de una práctica académica y utiliza la API de Marvel bajo sus términos y condiciones.

## 🎯 Objetivos Cumplidos

1. ✅ Implementación de clases base
2. ✅ Sistema de gestión de favoritos
3. ✅ Funciones recursivas y funcionales
4. ✅ Interfaz intuitiva y responsive
5. ✅ Tests completos

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

## 📚 Referencias

- [Marvel API Documentation](https://developer.marvel.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Design Patterns](https://www.patterns.dev/)
