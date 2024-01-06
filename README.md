# SteamChat

Este es el backend de muestro proyecto de smite counters, se encargará de manejar la información necesaria para neustra web

## Construido con 🛠️

* [MONGODB](https://www.mongodb.com/es) - Usado para la base de datos  
* [TYPESCRIPT](https://www.typescriptlang.org/) 
* [BCRYPT](https://www.npmjs.com/package/bcrypt)  - Usado para la encriptación de las contraseñas
* [AXIOS](https://axios-http.com/es/docs/intro)  - Usado para la peticiones HTTP
* [EXPRESS](https://expressjs.com/es/) 
* [JWT](https://jwt.io/) - Usado para generar tokens a los usuarios logueados
* [MONGOOSE](https://mongoosejs.com/) 

## Wiki 📖

A continuación se explicaran los pasos a seguir para poder utilizar nuestra aplicación.

###Estructura:
La aplicación está dividida en un archivo principal (app.js) responsable del lanzamiento de la aplicación y dos entidades modularizadas (users y meetings), cada una con su modelo, su router y su controlador asociados dentro de su carpeta, de modo que resulte fácil encontrar y editar las partes del código necesarias sin que se vean afectadas otras secciones no relacionadas.

###Model:
Contiene toda la estructura del modelo Mongoose que se usará para cada usuario, tanto usuario como tatuador en el caso de los usuarios, y cada cita en el caso de las citas

###Router:
Aquí están todos los servicios disponibles en la API. Importan la lógica de los controladores y se exportan a App.ts

###Controller:
Toda la lógica se gestiona aquí. Es donde están todas las funciones, que reciben los parámetros pertinentes desde el router, gestionan la petición, y le devuelven la información que se deba retornar al usuario. Importa el Model, y exporta las funciones al Router.

### Instalación

-   Haz un pull de nuestro repositorio.
-   Haz un `npm i`, para que instale todas las dependecias necesarias.
-   Crea el archivo `.env` y dentro cambia los valores que necesites.

### Endpoints
A continuación te mostraremos una tabla con los endpoints de la aplicación y los datos que deben proporcionar para su correcto funcionamiento.

#### Dioses
| Endpoint                  | Método | Datos de Entrada                       | Parámetros de URL                  | Requiere Autenticación        |
|---------------------------|--------|----------------------------------------|-----------------------------|-----------------------|
| `/addGod`                 | POST   | `name, pantheon, role, lore, abilities, images, isActive, isNew, isFreeToPlay` | Ninguno                     | No                    |
| `/filterGodsActive`       | POST   | `pantheon, role, godName`             | Ninguno                     | No                    |
| `/createGod`              | POST   | `name, pantheon, role, lore, abilities, images, isActive, isNewGod, isFreeToPlay` | Ninguno                     | Sí (`authMiddleware`) |
| `/allGodsActive`          | GET    | Ninguno                                | Ninguno                     | No                    |
| `/allGods`                | GET    | Ninguno                                | Ninguno                     | Sí (`authMiddleware`) |
| `/godDetails/:id`         | GET    | Ninguno                                | `id` (parámetro de ruta)   | No                    |
| `/updateGodActive/:id`    | PUT    | `isActive`                             | `id` (parámetro de ruta)   | Sí (`authMiddleware`) |
| `/updateGod/:id`          | PUT    | `name, pantheon, role, lore, abilities, images, isActive, isNewGod, isFreeToPlay` | `id` (parámetro de ruta)   | Sí (`authMiddleware`) |


#### Usuarios

| Endpoint                       | Método | Datos de Entrada                       | Parámetros         | Autenticación        |
|--------------------------------|--------|----------------------------------------|--------------------|-----------------------|
| `/addUser`                     | POST   | `email, username, password, birthday`   | Ninguno            | No                    |
| `/login`                       | POST   | `email, password`                      | Ninguno            | No                    |
| `/saveListCounter`             | POST   | `listName, mainGod, counterpicks`       | Ninguno            | Sí (`authMiddleware`) |
| `/getListCounter`              | GET    | Ninguno                                | Ninguno            | Sí (`authMiddleware`) |
| `/profile`                     | GET    | Ninguno                                | Ninguno            | Sí (`authMiddleware`) |
| `/updateProfile`               | PUT    | `email, username, password, birthday`   | Ninguno            | Sí (`authMiddleware`) |
| `/getList/:id`                  | GET    | Ninguno                                | `id` (parámetro de ruta) | Sí (`authMiddleware`) |
| `/deleteCounterGod/`           | DELETE | `godId`                                | Ninguno            | Sí (`authMiddleware`) |
| `/deleteListCounter/:id`        | DELETE | Ninguno                                | `id` (parámetro de ruta) | Sí (`authMiddleware`) |


## Autores ✒️


* **Jorge Loza Guzmán** - *Trabajo Inicial* -  *Documentación* - [JorgeLozaDev](https://github.com/JorgeLozaDev)



## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

