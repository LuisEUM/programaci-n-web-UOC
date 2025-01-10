# 📚 Aplicación de Gestión de Cómics Marvel

## 🏗️ Modelos

### 🦸‍♂️ Hero

La clase `Hero` representa un héroe en la aplicación y se utiliza en varios componentes clave.

#### 🎯 Usos Principales

- **HeroesGrid**: Para mostrar la lista de héroes
- **HeroModal**: Para mostrar detalles del héroe
- **HeroesCarousel**: Para mostrar héroes destacados
- **ComicsGrid**: Para filtrar cómics por héroe
- **DataService**: Para transformar datos de la API

#### 🛠️ Métodos Principales

##### 📥 Constructor y Propiedades Privadas

- `constructor(id, name, description, modified, thumbnail, resourceURI, comics)`: Crea una nueva instancia de héroe
  - 🔄 Usado en: HeroesGrid, HeroModal, fromAPI
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `id`: ID único del héroe
    - `name`: Nombre del héroe
    - `description`: Descripción del héroe
    - `modified`: Fecha de última modificación
    - `thumbnail`: Objeto con información de la imagen
    - `resourceURI`: URI del recurso en la API
    - `comics`: Array con nombres de cómics relacionados
  - 🔒 Propiedades Privadas:
    - `#id`: ID único del héroe
    - `#name`: Nombre del héroe
    - `#description`: Descripción del héroe
    - `#modified`: Fecha de modificación
    - `#thumbnail`: Objeto con información de la imagen
    - `#resourceURI`: URI del recurso
    - `#comics`: Array de cómics relacionados
  - 📝 Validaciones:
    - ID debe ser un número válido
    - Nombre debe ser una cadena no vacía
    - Thumbnail debe tener path y extension

##### 🖼️ Métodos Públicos

- `getThumbnailURL()`: Obtiene la URL completa de la imagen del héroe
  - 🔄 Usado en: HeroesGrid, HeroModal, HeroesCarousel
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {string} URL completa de la imagen o imagen por defecto
  - 📝 Validaciones:
    - Verifica existencia de thumbnail.path y thumbnail.extension
    - Retorna imagen por defecto si no hay thumbnail válido
  - 📝 Efectos:
    - Construye la URL completa concatenando path y extension
    - Maneja casos de error retornando imagen por defecto

##### 🔄 Métodos Estáticos

- `static fromAPI(apiHero)`: Crea una instancia de Hero a partir de datos de la API de Marvel
  - 🔄 Usado en: DataService, HeroesGrid, HeroModal
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `apiHero`: Datos del héroe en formato API
      - Debe contener: id, name, description, modified, thumbnail, resourceURI, comics
  - 📝 Retorna: {Hero} Nueva instancia de Hero
  - 📝 Validaciones:
    - Verifica estructura de datos de la API
    - Aplica valores por defecto si faltan datos
    - Formatea campos especiales como fechas y URLs
  - 📝 Efectos:
    - Transforma datos de la API al formato interno
    - Aplica valores por defecto para campos faltantes
    - Formatea campos especiales como fechas y URLs

##### 📊 Getters

- `get id()`: Obtiene el ID del héroe

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {number} ID único del héroe

- `get name()`: Obtiene el nombre del héroe

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {string} Nombre del héroe

- `get description()`: Obtiene la descripción del héroe

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {string} Descripción del héroe

- `get modified()`: Obtiene la fecha de modificación

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {string} Fecha de última modificación

- `get thumbnail()`: Obtiene el objeto thumbnail

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {Object} Objeto con path y extension de la imagen

- `get resourceURI()`: Obtiene la URI del recurso

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {string} URI del recurso en la API

- `get comics()`: Obtiene el array de cómics
  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {Array} Lista de cómics relacionados

##### 📝 Setters

- [No tiene setters - Todos los valores son inmutables después de la creación]

##### 🔒 Métodos Privados

- [No tiene métodos privados - Toda la funcionalidad se maneja a través de métodos públicos]

### 📖 Comic

La clase `Comic` representa un cómic en la aplicación y se utiliza para gestionar la información de los cómics de Marvel.

#### 🎯 Usos Principales

- **ComicsGrid**: Para mostrar la lista de cómics y su información
- **ComicModal**: Para mostrar detalles del cómic en modal
- **ComicDetailsModal**: Para mostrar información detallada del cómic
- **DataService**: Para transformar datos de la API
- **Collections**: Para gestionar cómics en colecciones

#### 🛠️ Métodos Principales

##### 📥 Constructor y Propiedades Privadas

- `constructor(id, title, issueNumber, description, pageCount, thumbnail, price, creators, characters)`: Crea una nueva instancia de cómic
  - 🔄 Usado en: fromAPI, fromMockData
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `id`: ID único del cómic
    - `title`: Título del cómic
    - `issueNumber`: Número de edición
    - `description`: Descripción del cómic
    - `pageCount`: Número de páginas
    - `thumbnail`: Objeto con información de la imagen
    - `price`: Precio del cómic
    - `creators`: Array de creadores
    - `characters`: Array de personajes
  - 🔒 Propiedades Privadas:
    - `#id`: ID único del cómic
    - `#title`: Título del cómic
    - `#issueNumber`: Número de edición
    - `#description`: Descripción del cómic
    - `#pageCount`: Número de páginas
    - `#thumbnail`: Objeto con información de la imagen
    - `#price`: Precio del cómic
    - `#creators`: Array de creadores
    - `#characters`: Array de personajes
  - 📝 Validaciones:
    - ID debe ser un número válido
    - Título debe ser una cadena no vacía
    - Número de edición debe ser un número
    - Descripción debe ser una cadena
    - Número de páginas debe ser un número no negativo
    - Thumbnail debe tener path y extension
    - Precio debe ser un número no negativo
    - Creators debe ser un array
    - Characters debe ser un array

##### 🖼️ Métodos Públicos

- `getThumbnailURL()`: Obtiene la URL completa de la imagen del cómic
  - 🔄 Usado en: ComicsGrid, ComicModal, ComicDetailsModal
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {string} URL completa de la imagen o imagen por defecto
  - 📝 Validaciones:
    - Verifica existencia de thumbnail.path y thumbnail.extension
    - Retorna imagen por defecto si no hay thumbnail válido
  - 📝 Efectos:
    - Construye la URL completa concatenando path y extension
    - Maneja casos de error retornando imagen por defecto
    - Asegura que la URL sea válida para uso en elementos img

##### 🔄 Métodos Estáticos

- `static fromAPI(apiComic)`: Crea una instancia de Comic a partir de datos de la API de Marvel

  - 🔄 Usado en: ComicsGrid, DataService
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `apiComic`: Datos del cómic en formato API
      - Debe contener: id, title, issueNumber, description, pageCount, thumbnail, prices, creators, characters
  - 📝 Retorna: {Comic} Nueva instancia de Comic
  - 📝 Validaciones:
    - Verifica estructura de datos de la API
    - Aplica valores por defecto si faltan datos
    - Transforma datos de precios y creadores al formato correcto
  - 📝 Efectos:
    - Transforma datos de la API al formato interno
    - Aplica valores por defecto para campos faltantes
    - Formatea campos especiales como precios y URLs
    - Normaliza arrays de creadores y personajes
    - Maneja el modo mock si está activado

- `static fromMockData(mockComic)`: Crea una instancia de Comic a partir de datos mock
  - 🔄 Usado en: DataService
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `mockComic`: Datos del cómic en formato mock
      - Debe contener los mismos campos que la API
  - 📝 Retorna: {Comic} Nueva instancia de Comic
  - 📝 Validaciones:
    - Verifica estructura de datos mock
    - Asegura que todos los campos requeridos estén presentes
  - 📝 Efectos:
    - Transforma datos mock al formato interno
    - Aplica valores predeterminados si es necesario
    - Asegura la consistencia de los datos con el formato de la API
    - Mantiene la integridad de las referencias

##### 📊 Getters

- `get id()`: Obtiene el ID del cómic

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {number} ID único del cómic

- `get title()`: Obtiene el título del cómic

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {string} Título del cómic

- `get issueNumber()`: Obtiene el número de edición

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {number} Número de edición

- `get description()`: Obtiene la descripción del cómic

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {string} Descripción del cómic

- `get pageCount()`: Obtiene el número de páginas

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {number} Número de páginas

- `get thumbnail()`: Obtiene el objeto thumbnail

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {Object} Objeto con path y extension de la imagen

- `get price()`: Obtiene el precio del cómic

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {number} Precio del cómic

- `get creators()`: Obtiene el array de creadores

  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {Array} Lista de creadores del cómic

- `get characters()`: Obtiene el array de personajes
  - 🔄 Usado en: A través de toda la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {Array} Lista de personajes del cómic

##### 📝 Setters

- `set price(newPrice)`: Establece el precio del cómic
  - 🔄 Usado en: Para actualizar precios
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `newPrice`: {number} Nuevo precio del cómic
  - 📝 Validaciones:
    - Debe ser un número
    - No puede ser negativo
  - 📝 Lanza: Error si el precio es inválido

##### 🔒 Métodos Privados

- [No tiene métodos privados - Toda la funcionalidad se maneja a través de métodos públicos]

### 📑 Collections

La clase `Collections` gestiona las colecciones de cómics del usuario, permitiendo organizar los cómics en diferentes categorías predefinidas.

#### 🎯 Usos Principales

- **CollectionModal**: Para gestionar las colecciones desde el modal
- **ComicsCollectionModal**: Para mover/clonar cómics entre colecciones
- **ComicsGrid**: Para mostrar estado de colecciones
- **DataService**: Para cargar y gestionar datos de colecciones

#### 📋 Colecciones Predeterminadas

- 🌟 Lista de Deseos (wishlist)
- 📚 Por Leer (toread)
- 📖 Leyendo (reading)
- ✅ Leídos (read)
- ❤️ Favoritos (collections)

#### 🛠️ Métodos Principales

##### 📥 Constructor y Propiedades Privadas

- `constructor()`: Inicializa el gestor de colecciones
  - 🔄 Usado en: collections.js
  - ✅ Estado: Activo y en uso
  - 📝 Inicializa:
    - `#collections`: Map para almacenar colecciones
    - `#observers`: Array de observadores para cambios
  - 📝 Acciones:
    - Carga colecciones desde localStorage
    - Migra colecciones antiguas si existen
    - Inicializa colecciones predeterminadas

##### 🔄 Propiedades Estáticas

- `static DEFAULT_COLLECTIONS`: Define las colecciones predeterminadas

  - 🔄 Usado en: Constructor, addCollection
  - ✅ Estado: Activo y en uso
  - 📝 Valor: Array de nombres de colecciones predeterminadas

- `static COLLECTION_NAMES`: Define los nombres de visualización de las colecciones

  - 🔄 Usado en: CollectionModal, ComicsCollectionModal
  - ✅ Estado: Activo y en uso
  - 📝 Valor: Objeto con mapeo de ID a nombres de visualización

- `static COPY_SUFFIX`: Define el sufijo para copias de colecciones
  - 🔄 Usado en: Métodos de clonación
  - ✅ Estado: Activo y en uso
  - 📝 Valor: String con el sufijo " copia"

##### 🛠️ Métodos Públicos de Gestión

- `addCollection(dataSource, collection, comicId)`: Añade un cómic a una colección

  - 🔄 Usado en: CollectionModal, ComicsCollectionModal, collections.js
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `dataSource`: Fuente de datos (marvel/local)
    - `collection`: Nombre de la colección
    - `comicId`: ID del cómic a añadir
  - 📝 Retorna: {boolean} True si se añadió correctamente
  - 📝 Validaciones:
    - Verifica dataSource válida
    - Verifica colección válida
    - Verifica que el cómic no esté ya en la colección
  - 📝 Efectos:
    - Actualiza el Map de colecciones
    - Guarda cambios en localStorage
    - Notifica a los observadores
    - Actualiza estadísticas de la colección

- `removeCollection(dataSource, collection, comicId)`: Elimina un cómic de una colección

  - 🔄 Usado en: CollectionModal, ComicsCollectionModal, collections.js
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `dataSource`: Fuente de datos (marvel/local)
    - `collection`: Nombre de la colección
    - `comicId`: ID del cómic a eliminar
  - 📝 Retorna: {boolean} True si se eliminó correctamente
  - 📝 Validaciones:
    - Verifica dataSource válida
    - Verifica colección válida
    - Verifica que el cómic exista en la colección
  - 📝 Efectos:
    - Elimina el cómic del Map de colecciones
    - Guarda cambios en localStorage
    - Notifica a los observadores
    - Actualiza estadísticas de la colección

- `isCollection(dataSource, collection, comicId)`: Verifica si un cómic está en una colección

  - 🔄 Usado en: CollectionModal, ComicsCollectionModal, ComicsGrid
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `dataSource`: Fuente de datos (marvel/local)
    - `collection`: Nombre de la colección
    - `comicId`: ID del cómic a verificar
  - 📝 Retorna: {boolean} True si el cómic está en la colección
  - 📝 Efectos:
    - Accede al Map de colecciones
    - Realiza búsqueda optimizada
    - No modifica el estado

- `getAllCollections(dataSource)`: Obtiene todas las colecciones de una fuente de datos

  - 🔄 Usado en: collections.js, DataService.js
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `dataSource`: Fuente de datos (marvel/local)
  - 📝 Retorna: {Map} Mapa con todas las colecciones
  - 📝 Efectos:
    - Crea una copia segura del Map de colecciones
    - Filtra por fuente de datos
    - No modifica el estado original

- `getCollectionDisplayName(collection)`: Obtiene el nombre para mostrar de una colección
  - 🔄 Usado en: ComicsCollectionModal, DataService.js
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `collection`: ID de la colección
  - 📝 Retorna: {string} Nombre de visualización de la colección
  - 📝 Efectos:
    - Accede al objeto de nombres de colección
    - Retorna nombre por defecto si no existe mapeo
    - No modifica el estado

##### 💾 Métodos de Persistencia

- `saveCollections()`: Guarda las colecciones en localStorage

  - 🔄 Usado en: CollectionModal, collections.js, internamente
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {void}
  - 📝 Efectos:
    - Convierte colecciones a JSON
    - Guarda en localStorage
    - Notifica a observadores

- `loadCollections()`: Carga las colecciones desde localStorage
  - 🔄 Usado en: collections.js, CollectionModal
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {void}
  - 📝 Efectos:
    - Lee de localStorage
    - Parsea JSON a colecciones
    - Inicializa colecciones predeterminadas si no existen

##### 📊 Métodos de Estadísticas

- `calculateCollectionAveragePrice(dataSource, collection)`: Calcula el precio promedio

  - ⚠️ Usado en: Sin uso actual
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Parámetros:
    - `dataSource`: Fuente de datos (marvel/local)
    - `collection`: Nombre de la colección
  - 📝 Retorna: {number} Precio promedio de la colección
  - 📝 Efectos:
    - Accede a los cómics de la colección
    - Calcula suma total de precios
    - Maneja casos de colección vacía
    - No modifica el estado

- `getCollectionStats(dataSource, collection)`: Obtiene estadísticas de una colección

  - ⚠️ Usado en: Sin uso actual
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Parámetros:
    - `dataSource`: Fuente de datos (marvel/local)
    - `collection`: Nombre de la colección
  - 📝 Retorna: {Object} Estadísticas de la colección
  - 📝 Efectos:
    - Calcula total de cómics
    - Calcula precio promedio
    - Analiza distribución de creadores
    - No modifica el estado

- `getAllCollectionStats(dataSource)`: Obtiene todas las estadísticas

  - ⚠️ Usado en: Sin uso actual
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Parámetros:
    - `dataSource`: Fuente de datos (marvel/local)
  - 📝 Retorna: {Object} Estadísticas de todas las colecciones
  - 📝 Efectos:
    - Itera sobre todas las colecciones
    - Agrega estadísticas individuales
    - Calcula totales globales
    - No modifica el estado

- `getCollectionCount(collection)`: Obtiene el conteo de cómics en una colección

  - ⚠️ Usado en: Sin uso actual
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Parámetros:
    - `collection`: Nombre de la colección
  - 📝 Retorna: {number} Número de cómics en la colección
  - 📝 Efectos:
    - Accede a la colección específica
    - Cuenta elementos únicos
    - No modifica el estado

- `getTotalUniqueComics()`: Obtiene el total de cómics únicos
  - 🔄 Usado en: Navbar.js
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {number} Total de cómics únicos en todas las colecciones
  - 📝 Efectos:
    - Itera sobre todas las colecciones
    - Elimina duplicados entre colecciones
    - Calcula total único
    - No modifica el estado

##### 🔒 Métodos Privados

- `#validateDataSource(dataSource)`: Valida la fuente de datos

  - 🔄 Usado en: Internamente
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `dataSource`: Fuente de datos a validar
  - 📝 Retorna: {boolean} True si la fuente es válida
  - 📝 Lanza: Error si la fuente es inválida

- `#validateCollection(collection)`: Valida el nombre de la colección

  - 🔄 Usado en: Internamente
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `collection`: Nombre de colección a validar
  - 📝 Retorna: {boolean} True si la colección es válida
  - 📝 Lanza: Error si la colección es inválida

- `#notifyCollectionUpdate()`: Notifica a los observadores sobre cambios
  - 🔄 Usado en: Internamente
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {void}
  - 📝 Efectos: Notifica a todos los observadores registrados

##### 🧪 Métodos de Práctica (Local)

- `addCollectionComic(comic)`: Añade un cómic a la colección local

  - 🔄 Usado en: Internamente por addMultipleCollections
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Parámetros:
    - `comic`: {Comic} Instancia del cómic a añadir
  - 📝 Retorna: {boolean} True si se añadió correctamente
  - 📝 Validaciones:
    - Verifica que el cómic sea una instancia válida
    - Verifica que no exista en la colección

- `removeCollectionComic(comicId)`: Elimina un cómic de la colección local

  - ⚠️ Usado en: Sin uso actual
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Parámetros:
    - `comicId`: {number} ID del cómic a eliminar
  - 📝 Retorna: {boolean} True si se eliminó correctamente
  - 📝 Validaciones:
    - Verifica que el ID sea válido
    - Verifica que el cómic exista en la colección

- `showCollections()`: Muestra los cómics en la colección local

  - ⚠️ Usado en: Sin uso actual
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Retorna: {Array} Lista de cómics en la colección
  - 📝 Efectos:
    - Formatea los datos para visualización
    - Ordena los cómics por título

- `addMultipleCollections(...comics)`: Añade múltiples cómics

  - ⚠️ Usado en: Sin uso actual
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Parámetros:
    - `comics`: {...Comic[]} Array de cómics a añadir
  - 📝 Retorna: {boolean} True si todos los cómics se añadieron correctamente
  - 📝 Validaciones:
    - Verifica que cada cómic sea una instancia válida
    - Evita duplicados

- `copyCollections()`: Crea una copia de la colección local

  - ⚠️ Usado en: Sin uso actual
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Retorna: {Map} Nueva instancia de la colección
  - 📝 Efectos:
    - Realiza una copia profunda de los datos
    - Mantiene la integridad de las referencias

- `findComicById(comicId, comics)`: Busca un cómic por ID

  - 🔄 Usado en: Solo recursivamente dentro del mismo método
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Parámetros:
    - `comicId`: {number} ID del cómic a buscar
    - `comics`: {Array} Lista de cómics donde buscar
  - 📝 Retorna: {Comic|null} Cómic encontrado o null
  - 📝 Validaciones:
    - Verifica que el ID sea válido
    - Verifica que la lista de cómics sea válida

- `calculateAveragePrice()`: Calcula el precio promedio local

  - ⚠️ Usado en: Sin uso actual
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Retorna: {number} Precio promedio de la colección
  - 📝 Validaciones:
    - Ignora cómics sin precio
    - Maneja casos de colección vacía

- `getAffordableComicTitles(maxPrice)`: Obtiene cómics por precio máximo
  - ⚠️ Usado en: Sin uso actual
  - ⏳ Estado: Pendiente de implementación o eliminación
  - 📝 Parámetros:
    - `maxPrice`: {number} Precio máximo a considerar
  - 📝 Retorna: {Array} Lista de títulos de cómics asequibles
  - 📝 Validaciones:
    - Verifica que maxPrice sea un número positivo
    - Filtra cómics sin precio

##### 📝 Acciones Recomendadas

1. 🔍 Evaluar la necesidad de mantener los métodos sin uso
2. 💡 Implementar funcionalidades que aprovechen estos métodos
3. 🗑️ Considerar la eliminación de métodos no utilizados para mantener el código limpio
4. 📄 Documentar cualquier decisión de mantener métodos para uso futuro

## Componentes

[Documentación pendiente]

## Servicios

### 🦸‍♂️ MarvelAPI

Clase que maneja las interacciones con la API de Marvel, proporcionando métodos estáticos para realizar peticiones a los endpoints de cómics y héroes.

#### 🌐 Propiedades Estáticas

- `static BASE_URL`: URL base de la API de Marvel

  - 📝 Tipo: {string}
  - 🔄 Usado en: Todos los métodos de la clase
  - ✅ Estado: Activo y en uso

- `static PUBLIC_KEY`: Clave pública de la API de Marvel

  - 📝 Tipo: {string}
  - 🔄 Usado en: Autenticación de peticiones
  - ✅ Estado: Activo y en uso

- `static PRIVATE_KEY`: Clave privada de la API de Marvel
  - 📝 Tipo: {string}
  - 🔄 Usado en: Generación de hash para autenticación
  - ✅ Estado: Activo y en uso

#### 🛠️ Métodos

##### 🔐 Autenticación

- `static generateHash(timestamp)`: Genera un hash MD5 para autenticar peticiones
  - 🔄 Usado en: Todos los métodos de petición
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `timestamp`: {string} Marca de tiempo actual
  - 📝 Retorna: {string} Hash MD5 generado
  - 📝 Efectos:
    - Combina timestamp, clave privada y pública
    - Genera hash MD5 para autenticación

##### 📚 Gestión de Cómics

- `static async getComics(params)`: Obtiene lista de cómics

  - 🔄 Usado en: DataService, ComicsGrid
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `params`: {Object} Parámetros de la petición
      - `limit`: {number} Límite de resultados por página
      - `offset`: {number} Número de resultados a saltar
      - `titleStartsWith`: {string} Filtro por título
  - 📝 Retorna: {Promise<Object>} Respuesta de la API
  - 📝 Lanza: Error si hay problemas en la petición
  - 📝 Efectos:
    - Genera autenticación
    - Realiza petición a la API
    - Maneja errores de red

- `static async getComicById(id)`: Obtiene un cómic específico
  - 🔄 Usado en: DataService, ComicModal
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `id`: {number} ID del cómic
  - 📝 Retorna: {Promise<Object|null>} Datos del cómic o null
  - 📝 Lanza: Error si hay problemas en la petición
  - 📝 Efectos:
    - Genera autenticación
    - Realiza petición a la API
    - Transforma datos al formato interno
    - Maneja valores por defecto

##### 🦸‍♂️ Gestión de Héroes

- `static async getHeroes(params)`: Obtiene lista de héroes

  - 🔄 Usado en: DataService, HeroesGrid
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `params`: {Object} Parámetros de la petición
      - `limit`: {number} Límite de resultados por página
      - `offset`: {number} Número de resultados a saltar
      - `nameStartsWith`: {string} Filtro por nombre
  - 📝 Retorna: {Promise<Object>} Respuesta de la API
  - 📝 Lanza: Error si hay problemas en la petición
  - 📝 Efectos:
    - Genera autenticación
    - Realiza petición a la API
    - Maneja errores de red

- `static async getHeroById(id)`: Obtiene un héroe específico
  - 🔄 Usado en: DataService, HeroModal
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `id`: {number} ID del héroe
  - 📝 Retorna: {Promise<Object>} Datos del héroe
  - 📝 Lanza: Error si hay problemas en la petición
  - 📝 Efectos:
    - Genera autenticación
    - Realiza petición a la API
    - Maneja errores de red

#### 📝 Notas de Implementación

1. 🔐 **Seguridad**

   - Las claves de API se obtienen de Config.js
   - El hash MD5 se genera para cada petición
   - La clave privada nunca se expone al cliente

2. 🔄 **Manejo de Errores**

   - Validación de respuestas de red
   - Manejo de errores HTTP
   - Logging de errores en consola

3. 🎯 **Optimizaciones**

   - Transformación de datos en getComicById
   - Valores por defecto para parámetros opcionales
   - Manejo de casos nulos

4. ⚠️ **Consideraciones**
   - La instancia global window.marvelAPI podría ser innecesaria
   - Considerar implementar caché de respuestas
   - Evaluar añadir reintentos automáticos

### 🔄 DataService

Servicio que actúa como capa intermedia entre la API/datos mock y los componentes, proporcionando métodos para obtener y gestionar datos de cómics y héroes.

#### 🎯 Usos Principales

- **ComicsGrid**: Para obtener y filtrar cómics
- **HeroesGrid**: Para obtener y filtrar héroes
- **ComicModal**: Para obtener detalles de cómics
- **HeroModal**: Para obtener detalles de héroes
- **Collections**: Para cargar elementos de colecciones

#### 🛠️ Métodos

##### 📥 Obtención de Datos

- `static async fetchItems(type, params)`: Obtiene lista de elementos con paginación

  - 🔄 Usado en: ComicsGrid, HeroesGrid
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `type`: {string} Tipo de elementos ('comics' o 'heroes')
    - `params`: {Object} Parámetros de la petición
      - `limit`: {number} Límite de resultados por página
      - `offset`: {number} Número de resultados a saltar
      - `titleStartsWith`: {string} Filtro por título (cómics)
      - `nameStartsWith`: {string} Filtro por nombre (héroes)
  - 📝 Retorna: {Promise<Object>} Resultados y metadata
  - 📝 Lanza: Error si hay problemas o tipo inválido
  - 📝 Efectos:
    - Maneja datos mock si está configurado
    - Realiza peticiones a la API si es necesario
    - Aplica filtros y paginación
    - Formatea respuesta consistentemente

- `static async fetchItemById(type, id)`: Obtiene un elemento específico
  - 🔄 Usado en: ComicModal, HeroModal
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `type`: {string} Tipo de elemento ('comics' o 'heroes')
    - `id`: {number} ID del elemento
  - 📝 Retorna: {Promise<Object>} Datos del elemento
  - 📝 Lanza: Error si hay problemas o tipo inválido
  - 📝 Efectos:
    - Delega petición al servicio correspondiente
    - Maneja errores de forma consistente

##### 📚 Gestión de Colecciones

- `static async loadCollectionItems(collectionsManager)`: Carga elementos de colecciones

  - 🔄 Usado en: Collections, CollectionModal
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `collectionsManager`: {Collections} Gestor de colecciones
  - 📝 Retorna: {Promise<Array>} Colecciones con elementos
  - 📝 Efectos:
    - Determina fuente de datos (mock/api)
    - Carga elementos por colección
    - Obtiene nombres de visualización
    - Filtra colecciones vacías

- `static async getCollectionItems(dataSource, ids)`: Obtiene elementos por IDs
  - 🔄 Usado en: loadCollectionItems
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `dataSource`: {string} Fuente de datos ('mock' o 'api')
    - `ids`: {Array<number>} IDs de elementos
  - 📝 Retorna: {Promise<Array>} Elementos encontrados
  - 📝 Efectos:
    - Filtra datos mock o realiza peticiones
    - Maneja errores individuales
    - Omite elementos no encontrados

#### 📝 Notas de Implementación

1. 🔄 **Gestión de Datos**

   - Maneja tanto datos mock como de API
   - Proporciona interfaz consistente
   - Aplica transformaciones necesarias

2. 🎯 **Optimizaciones**

   - Filtrado y paginación en memoria para datos mock
   - Manejo de errores granular
   - Omisión de resultados vacíos

3. 🔍 **Validaciones**

   - Verifica tipos de elementos válidos
   - Valida parámetros de paginación
   - Maneja casos de IDs inválidos

4. ⚠️ **Consideraciones**
   - Evaluar implementación de caché
   - Considerar batch loading para colecciones
   - Mejorar manejo de errores en cascada

### ⚙️ Config

Objeto de configuración global que centraliza las constantes y parámetros de configuración de la aplicación.

#### 🎯 Usos Principales

- **MarvelAPI**: Para obtener credenciales y URL base
- **DataService**: Para gestionar el modo de datos (mock/API)
- **Components**: Para configurar límites de paginación
- **Collections**: Para definir colecciones predeterminadas

#### 🛠️ Propiedades

##### 🔑 Configuración de API

- `MARVEL_API_BASE_URL`: URL base de la API de Marvel

  - 🔄 Usado en: MarvelAPI
  - ✅ Estado: Activo y en uso
  - 📝 Valor: "https://gateway.marvel.com/v1/public"

- `MARVEL_PUBLIC_KEY`: Clave pública para autenticación

  - 🔄 Usado en: MarvelAPI
  - ✅ Estado: Activo y en uso
  - 📝 Valor: [Clave pública de Marvel]

- `MARVEL_PRIVATE_KEY`: Clave privada para autenticación
  - 🔄 Usado en: MarvelAPI
  - ✅ Estado: Activo y en uso
  - 📝 Valor: [Clave privada de Marvel]

##### 📊 Configuración de Datos

- `USE_MOCK_DATA`: Flag para usar datos mock

  - 🔄 Usado en: DataService
  - ✅ Estado: Activo y en uso
  - 📝 Valor: true (por defecto)
  - 📝 Efectos:
    - Determina la fuente de datos (mock/API)
    - Se puede cambiar en tiempo de ejecución
    - Se persiste en localStorage

- `LIMIT`: Límite de elementos por página
  - 🔄 Usado en: DataService, Grids
  - ✅ Estado: Activo y en uso
  - 📝 Valor: 10
  - 📝 Efectos:
    - Controla la paginación
    - Aplica tanto a datos mock como API

##### 📚 Configuración de Colecciones

- `DEFAULT_COLLECTIONS`: Colecciones predeterminadas
  - 🔄 Usado en: Collections
  - ✅ Estado: Activo y en uso
  - 📝 Valor: ["general", "reading", "wishlist"]
  - 📝 Efectos:
    - Define colecciones iniciales
    - Se usa en la inicialización

##### 🗄️ Datos Mock

- `MOCK_DATA`: Datos de prueba
  - 🔄 Usado en: DataService
  - ✅ Estado: Activo y en uso
  - 📝 Contiene:
    - `comics`: Array de cómics mock
    - `heroes`: Array de héroes mock
    - `location`: Datos de ubicación
    - `testUser`: Usuario de prueba
    - `loginTestUser`: Usuario de prueba para login

#### 🛠️ Métodos

##### 🔄 Gestión de Estado

- `init()`: Inicializa la configuración

  - 🔄 Usado en: Inicialización de la aplicación
  - ✅ Estado: Activo y en uso
  - 📝 Efectos:
    - Lee preferencia de fuente de datos
    - Establece USE_MOCK_DATA inicial

- `toggleDataSource()`: Cambia la fuente de datos
  - 🔄 Usado en: UI de configuración
  - ✅ Estado: Activo y en uso
  - 📝 Retorna: {boolean} Nuevo estado de USE_MOCK_DATA
  - 📝 Efectos:
    - Alterna entre mock y API
    - Persiste la preferencia
    - Notifica el cambio

#### 📝 Notas de Implementación

1. 🔐 **Seguridad**

   - Las claves de API están expuestas (considerar mover a variables de entorno)
   - Los datos mock son públicos
   - Las contraseñas de prueba son visibles

2. 🔄 **Persistencia**

   - Usa localStorage para preferencias
   - Mantiene estado entre recargas
   - Permite cambios en runtime

3. 📊 **Datos Mock**

   - Proporciona datos realistas
   - Mantiene estructura de API
   - Incluye casos de prueba

4. ⚠️ **Consideraciones**
   - Evaluar mover claves a backend
   - Considerar encriptar datos sensibles
   - Documentar proceso de actualización de mock data

### 🔧 Utils

Clase de utilidades que proporciona funciones auxiliares reutilizables para operaciones comunes en la aplicación.

#### 🎯 Usos Principales

- **MarvelAPI**: Para generación de hashes
- **Collections**: Para conteo y gestión de colecciones
- **Global**: Para funciones de utilidad general

#### 🛠️ Métodos

##### 🔐 Autenticación

- `static generateMarvelHash(timestamp, privateKey, publicKey)`: Genera hash MD5 para API
  - 🔄 Usado en: MarvelAPI
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `timestamp`: Marca de tiempo actual
    - `privateKey`: Clave privada de la API
    - `publicKey`: Clave pública de la API
  - 📝 Retorna: Hash MD5 generado
  - 📝 Ejemplo:
    ```javascript
    const hash = Utils.generateMarvelHash(timestamp, privateKey, publicKey);
    ```

##### 📝 Gestión de Colecciones

- `static getCollectionCounts(collections?)`: Obtiene conteos de cómics

  - 🔄 Usado en: Collections, UI de estadísticas
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `collections`: Objeto de colecciones (opcional)
  - 📝 Retorna: Objeto con conteos por fuente de datos y colección
  - 📝 Efectos:
    - Lee de localStorage si no hay colecciones
    - Calcula conteos por fuente de datos
    - Maneja colecciones vacías

- `static getSourceCounts(sourceCollections)`: Calcula conteos por fuente

  - 🔄 Usado en: Internamente por getCollectionCounts
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `sourceCollections`: Colecciones de una fuente específica
  - 📝 Retorna: Objeto con conteos por colección
  - 📝 Efectos:
    - Verifica arrays válidos
    - Cuenta elementos por colección

- `static getUniqueComicsCount(collections?)`: Obtiene el total de cómics únicos

  - 🔄 Usado en: UI de estadísticas
  - ✅ Estado: Activo y en uso
  - 📝 Parámetros:
    - `collections`: Objeto de colecciones (opcional)
  - 📝 Retorna: Total de cómics únicos
  - 📝 Efectos:
    - Lee de localStorage si no hay colecciones
    - Usa Set para eliminar duplicados
    - Considera la fuente de datos actual

#### 📝 Notas de Implementación

1. 🔐 **Seguridad**

   - Manejo seguro de hashes
   - No expone datos sensibles
   - Validación de entradas

2. 🎯 **Persistencia**

   - Integración con localStorage
   - Manejo de casos nulos
   - Migración de datos antiguos

3. 📊 **Optimizaciones**

   - Uso de Set para unicidad
   - Manejo eficiente de colecciones
   - Validaciones robustas

## 🎮 Controladores

Los controladores manejan la lógica de negocio y la interacción entre la interfaz de usuario y los servicios.

### 📋 Resumen de Controladores

- `register.js` (588 líneas): Maneja el registro de usuarios
- `login.js` (123 líneas): Gestiona la autenticación de usuarios
- `collections.js` (305 líneas): Administra las colecciones de cómics
- `heroes.js` (142 líneas): Controla la visualización y filtrado de héroes
- `home.js` (56 líneas): Gestiona la página principal
- `comics.js` (164 líneas): Maneja la visualización, búsqueda y paginación de cómics

Vamos a documentar cada controlador en detalle:

### 🔐 Login Controller

El controlador de login (`login.js`) gestiona la autenticación de usuarios, incluyendo el manejo de usuarios de prueba y la interfaz de inicio de sesión.

#### 🎯 Responsabilidades

- Verificación de estado de sesión
- Gestión de usuarios de prueba
- Manejo del formulario de login
- Gestión de tokens de autenticación
- Control de UI interactiva

#### 🛠️ Funcionalidades Principales

##### 🔄 Inicialización

- **Verificación de Sesión**

  - 🔄 Ejecutado: Al cargar el DOM
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Verifica existencia de sesión activa
    - Redirige a `comics.html` si ya está autenticado

- **Configuración de Usuario de Prueba**
  - 🔄 Ejecutado: Al cargar el DOM
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Carga usuario de prueba desde `Config.MOCK_DATA`
    - Asegura disponibilidad en localStorage
    - Maneja errores de carga

##### 🎨 Elementos de UI

- **Toggle de Contraseña**

  - 🔄 Ejecutado: Al hacer clic en el icono
  - ✅ Estado: Activo y en uso
  - 📝 Comportamiento:
    - Alterna visibilidad de la contraseña
    - Cambia icono según estado
    - Mantiene estado de input

- **Grupos de Input Mejorados**
  - 🔄 Ejecutado: Al interactuar con input-groups
  - ✅ Estado: Activo y en uso
  - 📝 Comportamiento:
    - Área clickeable extendida
    - Focus automático en input
    - Mejora la usabilidad

##### 🔑 Gestión de Autenticación

- **Manejo de Formulario**

  - 🔄 Ejecutado: Al enviar el formulario
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Previene envío por defecto
    - Valida credenciales contra localStorage
    - Genera y almacena token de sesión
    - Redirige a `index.html` si éxito
    - Muestra error si falla

- **Generación de Token**
  - 🔄 Usado en: Proceso de login exitoso
  - ✅ Estado: Activo y en uso
  - 📝 Implementación:
    - Combina número aleatorio y timestamp
    - Asegura unicidad del token
    - Formato base36 para legibilidad

##### 📱 Feedback al Usuario

- **Sistema de Errores**

  - 🔄 Usado en: Fallos de autenticación
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Mensajes claros y visibles
    - Inserción dinámica en el DOM
    - Actualización sin recarga

- **Sistema de Toasts**
  - 🔄 Usado en: Notificaciones generales
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Múltiples tipos (success, error, info)
    - Estilo adaptativo según tipo
    - Auto-cierre configurable
    - Posicionamiento consistente

#### 📝 Notas de Implementación

1. 🔐 **Seguridad**

   - Almacenamiento seguro de credenciales
   - Tokens únicos por sesión
   - Limpieza de datos sensibles

2. 🎨 **UI/UX**

   - Feedback inmediato al usuario
   - Interacciones intuitivas
   - Manejo claro de errores

3. 🔄 **Estado**

   - Persistencia en localStorage
   - Gestión de sesión robusta
   - Manejo de estados de UI

4. ⚠️ **Consideraciones**
   - Implementar encriptación de contraseñas
   - Añadir validación más robusta
   - Considerar timeout de sesión
   - Mejorar seguridad de tokens

### 📝 Register Controller

El controlador de registro (`register.js`) gestiona el proceso de registro de usuarios, incluyendo validaciones en tiempo real y gestión de datos geográficos.

#### 🎯 Responsabilidades

- Verificación de estado de sesión
- Validación de campos del formulario
- Gestión de datos geográficos (España)
- Validación de disponibilidad de usuario
- Manejo de datos de prueba
- Control de UI interactiva

#### 🛠️ Funcionalidades Principales

##### 🔄 Inicialización

- **Verificación de Sesión**
  - 🔄 Ejecutado: Al cargar el DOM
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Verifica existencia de sesión activa
    - Redirige a `comics.html` si ya está autenticado

##### 🎨 Elementos de UI

- **Campo de Usuario**

  - 🔄 Ejecutado: Al cargar el DOM
  - ✅ Estado: Activo y en uso
  - 📝 Componentes:
    - Input de usuario
    - Botón de verificación
    - Mensajes de validación
    - Iconos de estado

- **Validación Visual**
  - 🔄 Ejecutado: En cada campo del formulario
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Iconos de éxito/error
    - Mensajes de validación
    - Estilos dinámicos
    - Feedback inmediato

##### 🗺️ Gestión Geográfica

- **Comunidades Autónomas**

  - 🔄 Ejecutado: Al cargar el formulario
  - ✅ Estado: Activo y en uso
  - 📝 Funcionalidades:
    - Carga datos desde Config
    - Poblado automático del select
    - Vinculación con códigos postales

- **Códigos Postales**
  - 🔄 Ejecutado: Al interactuar con el campo
  - ✅ Estado: Activo y en uso
  - 📝 Validaciones:
    - Formato (5 dígitos)
    - Correspondencia con comunidad
    - Autocompletado bidireccional
    - Validación en tiempo real

##### 🧪 Datos de Prueba

- **Usuario de Prueba**
  - 🔄 Ejecutado: Al hacer clic en botón de prueba
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Carga datos desde Config.MOCK_DATA
    - Rellena todos los campos
    - Dispara validaciones
    - Muestra feedback

#### 📝 Notas de Implementación

1. 🔐 **Validación**

   - Validación en tiempo real
   - Verificación de disponibilidad de usuario
   - Validación de formato de campos
   - Feedback visual inmediato

2. 🎨 **UI/UX**

   - Mensajes claros y descriptivos
   - Indicadores visuales de estado
   - Autocompletado inteligente
   - Prevención de errores

3. 🗺️ **Datos Geográficos**

   - Integración con datos de España
   - Validación de códigos postales
   - Relación entre comunidades y provincias
   - Actualización bidireccional

4. ⚠️ **Consideraciones**
   - Implementar validación de contraseña más robusta
   - Añadir validación de email en tiempo real
   - Considerar internacionalización
   - Mejorar manejo de errores de red

### 📚 Collections Controller

El controlador de colecciones (`collections.js`) gestiona la visualización y manipulación de las colecciones de cómics del usuario, permitiendo mover, clonar y eliminar cómics entre diferentes colecciones.

#### 🎯 Responsabilidades

- Gestión de datos mock y API
- Visualización de colecciones
- Manipulación de cómics entre colecciones
- Control de UI interactiva
- Actualización de contadores
- Gestión de estado de autenticación

#### 🛠️ Funcionalidades Principales

##### 🔄 Inicialización

- **Verificación de Autenticación**
  - 🔄 Ejecutado: Al cargar el DOM
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Verifica token y nombre de usuario
    - Redirige a `login.html` si no está autenticado
    - Inicializa `collectionsManager`
    - Carga datos mock si es necesario

##### 📊 Gestión de Datos

- **Carga de Datos Mock**
  - 🔄 Ejecutado: Al inicializar y según necesidad
  - ✅ Estado: Activo y en uso
  - 📝 Funcionalidades:
    - Carga datos desde `Config.MOCK_DATA`
    - Manejo de errores de carga
    - Integración con modo mock/API

##### 🎨 Interfaz de Usuario

- **Sistema de Tabs**

  - 🔄 Ejecutado: Al interactuar con tabs
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Cambio entre colecciones
    - Actualización de contadores
    - Estado activo visual
    - Carga dinámica de contenido

- **Grid de Colecciones**
  - 🔄 Ejecutado: Al cargar colección
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Visualización en grid
    - Mensajes de colección vacía
    - Carga asíncrona de cómics
    - Manejo de errores de carga

##### 🎴 Gestión de Cómics

- **Tarjetas de Cómics**

  - 🔄 Ejecutado: Por cada cómic en colección
  - ✅ Estado: Activo y en uso
  - 📝 Componentes:
    - Imagen con fallback
    - Información detallada
    - Botones de acción
    - Precios formateados

- **Acciones de Cómics**
  - 🔄 Ejecutado: Al interactuar con botones
  - ✅ Estado: Activo y en uso
  - 📝 Operaciones:
    - Mover entre colecciones
    - Clonar a otra colección
    - Remover de colección
    - Feedback visual de acciones

##### 📱 Feedback y Estado

- **Contadores de Colección**

  - 🔄 Ejecutado: Al actualizar colecciones
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Actualización en tiempo real
    - Muestra cantidad por colección
    - Manejo de colecciones vacías

- **Sistema de Notificaciones**
  - 🔄 Ejecutado: En operaciones clave
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Toasts informativos
    - Mensajes de error
    - Feedback de operaciones

#### 📝 Notas de Implementación

1. 🔄 **Gestión de Estado**

   - Persistencia en localStorage
   - Sincronización con collectionsManager
   - Manejo de modo mock/API
   - Eventos personalizados

2. 🎨 **UI/UX**

   - Interfaz responsiva
   - Feedback inmediato
   - Manejo de errores visual
   - Carga progresiva

3. 🔐 **Seguridad**

   - Verificación de autenticación
   - Validación de operaciones
   - Manejo seguro de datos
   - Control de acceso

4. ⚠️ **Consideraciones**
   - Implementar caché de imágenes
   - Optimizar carga de datos
   - Añadir confirmaciones en acciones críticas
   - Mejorar manejo de errores de red

### 🦸‍♂️ Heroes Controller

El controlador de héroes (`heroes.js`) gestiona la visualización, búsqueda y paginación de héroes de Marvel, proporcionando una interfaz interactiva para explorar el catálogo de personajes.

#### 🎯 Responsabilidades

- Gestión de estado de autenticación
- Inicialización de componentes
- Control de paginación
- Manejo de eventos personalizados
- Gestión de notificaciones
- Integración con modo mock/API

#### 🛠️ Funcionalidades Principales

##### 🔄 Inicialización

- **Verificación de Autenticación**

  - 🔄 Ejecutado: Al cargar el DOM
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Verifica token y nombre de usuario
    - Redirige a `login.html` si no está autenticado
    - Configura preferencia de fuente de datos

- **Inicialización de Componentes**
  - 🔄 Ejecutado: Al cargar el DOM
  - ✅ Estado: Activo y en uso
  - 📝 Componentes:
    - Collections Manager
    - Heroes Grid
    - Heroes Search
    - Hero Modal
    - Paginación

##### 📑 Control de Paginación

- **Configuración de Navegación**

  - 🔄 Ejecutado: Durante la inicialización
  - ✅ Estado: Activo y en uso
  - 📝 Controles:
    - Primera página
    - Página anterior
    - Página siguiente
    - Última página
    - Input directo de página

- **Actualización de Estado**
  - 🔄 Ejecutado: Al cambiar de página
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Actualiza input de página
    - Actualiza total de páginas
    - Gestiona estado de botones
    - Maneja límites de navegación

##### 🎯 Gestión de Eventos

- **Cambio de Fuente de Datos**

  - 🔄 Ejecutado: Al cambiar mock/API
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Recarga datos de héroes
    - Muestra notificación
    - Actualiza interfaz

- **Actualización de Filtros**

  - 🔄 Ejecutado: Al aplicar filtros
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Muestra conteo de resultados
    - Notifica cuando no hay resultados
    - Feedback visual inmediato

##### 📱 Sistema de Notificaciones

- **Toast Notifications**
  - 🔄 Ejecutado: En eventos clave
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Múltiples tipos (info, success, error)
    - Animaciones suaves
    - Auto-cierre
    - Limpieza automática
    - Posicionamiento dinámico

#### 📝 Notas de Implementación

1. 🔄 **Gestión de Estado**

   - Persistencia de preferencias
   - Estado de paginación
   - Sincronización de componentes
   - Manejo de eventos globales
   - Estado de colecciones

2. 🎨 **UI/UX**

   - Navegación intuitiva
   - Feedback inmediato
   - Transiciones suaves
   - Manejo de errores visual
   - Interfaz responsiva

3. 🔐 **Seguridad**

   - Verificación de autenticación
   - Control de acceso
   - Manejo seguro de datos
   - Validación de navegación
   - Protección de rutas

4. ⚠️ **Consideraciones**
   - Implementar caché de búsquedas
   - Optimizar carga de imágenes
   - Mejorar rendimiento de filtros
   - Añadir más opciones de ordenamiento
   - Implementar búsqueda avanzada

### 📚 Comics Controller

El controlador de cómics (`comics.js`) gestiona la visualización, búsqueda y paginación de cómics de Marvel, proporcionando una interfaz interactiva para explorar y gestionar el catálogo de cómics.

#### 🎯 Responsabilidades

- Gestión de estado de autenticación
- Inicialización de componentes
- Control de paginación
- Manejo de eventos personalizados
- Gestión de notificaciones
- Integración con colecciones
- Manejo de filtros y búsqueda

#### 🛠️ Funcionalidades Principales

##### 🔄 Inicialización

- **Verificación de Autenticación**

  - 🔄 Ejecutado: Al cargar el DOM
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Verifica token y nombre de usuario
    - Redirige a `login.html` si no está autenticado
    - Configura preferencia de fuente de datos

- **Inicialización de Componentes**
  - 🔄 Ejecutado: Al cargar el DOM
  - ✅ Estado: Activo y en uso
  - 📝 Componentes:
    - Collections Manager
    - Comics Grid
    - Comics Search
    - Comics Actions Bar
    - Comics Collection Modal
    - Heroes Carousel
    - Comic Modal

##### 📑 Control de Paginación

- **Configuración de Navegación**

  - 🔄 Ejecutado: Durante la inicialización
  - ✅ Estado: Activo y en uso
  - 📝 Controles:
    - Primera página
    - Página anterior
    - Página siguiente
    - Última página
    - Input directo de página
    - Selector de items por página

- **Validación de Navegación**
  - 🔄 Ejecutado: Al cambiar de página
  - ✅ Estado: Activo y en uso
  - 📝 Validaciones:
    - Rango de página válido
    - Límites de navegación
    - Feedback de errores
    - Actualización de UI

##### 🎯 Gestión de Eventos

- **Cambio de Fuente de Datos**

  - 🔄 Ejecutado: Al cambiar mock/API
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Recarga datos de cómics
    - Muestra notificación
    - Actualiza interfaz

- **Actualización de Filtros**

  - 🔄 Ejecutado: Al aplicar filtros
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Muestra conteo de resultados
    - Notifica cuando no hay resultados
    - Feedback visual inmediato

- **Actualización de Colecciones**
  - 🔄 Ejecutado: Al modificar colecciones
  - ✅ Estado: Activo y en uso
  - 📝 Acciones:
    - Actualiza botones de colección
    - Sincroniza estado de UI
    - Refleja cambios en tiempo real

##### 📱 Sistema de Notificaciones

- **Toast Notifications**
  - 🔄 Ejecutado: En eventos clave
  - ✅ Estado: Activo y en uso
  - 📝 Características:
    - Múltiples tipos (info, success, error)
    - Animaciones suaves
    - Auto-cierre
    - Limpieza automática
    - Posicionamiento dinámico

#### 📝 Notas de Implementación

1. 🔄 **Gestión de Estado**

   - Persistencia de preferencias
   - Estado de paginación
   - Sincronización de componentes
   - Manejo de eventos globales
   - Estado de colecciones

2. 🎨 **UI/UX**

   - Navegación intuitiva
   - Feedback inmediato
   - Transiciones suaves
   - Manejo de errores visual
   - Interfaz responsiva

3. 🔐 **Seguridad**

   - Verificación de autenticación
   - Control de acceso
   - Manejo seguro de datos
   - Validación de navegación
   - Protección de rutas

4. ⚠️ **Consideraciones**
   - Implementar caché de búsquedas
   - Optimizar carga de imágenes
   - Mejorar rendimiento de filtros
   - Añadir más opciones de ordenamiento
   - Implementar búsqueda avanzada

##### ⚠️ Consideraciones Futuras

1. **Optimizaciones Pendientes**

   - Implementar caché de búsquedas frecuentes
   - Añadir debounce en búsqueda por nombre
   - Optimizar validación de parámetros
   - Mejorar feedback visual durante búsquedas

2. **Mejoras Planificadas**
   - Sistema de autocompletado
   - Historial de búsquedas recientes
   - Filtros combinados más eficientes
   - Precarga inteligente de resultados
