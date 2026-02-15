Backend Veterinaria API

Este proyecto es el backend de una aplicación para una veterinaria, construido con Node.js, Express y TypeScript. Utiliza MongoDB como base de datos con Mongoose ODM para la gestión de datos, e implementa autenticación JWT y autorización basada en roles (RBAC).

🚀 Tecnologías Utilizadas
Node.js & npm
Express.js: Framework web.
TypeScript: Lenguaje de programación.
MongoDB & Mongoose: Base de datos y ODM.
JSON Web Tokens (JWT): Autenticación.
Bcrypt: Hasheo de contraseñas.
express-validator: Validación de datos.
Insomnia/Postman: Pruebas de API.

🛠️ Configuración e Instalación Local
Sigue estos pasos para tener el proyecto funcionando en tu máquina:
1. Clonar el Repositorio de GitHub
2. Instalamos Dependencias
3. Configuramos el entorno : creamos un archivo .env en la raiz del proyecto, con la informacion:
PORT=3000
MONGODB_URI="tu_cadena_de_conexion_a_mongodb"
JWT_SECRET="una_clave_secreta_fuerte"
4. Iniciamos el servidor con el : npm run dev
5. Estructuramos el Proyecto
 src/
├── config/              # Configuración de BD y entorno
├── controllers/         # Lógica de negocio (auth, pets, veterinarian)
├── middlewares/         # Lógica intermedia (auth.middleware.ts, etc.)
├── models/              # Esquemas de Mongoose (user.model.ts, pet.model.ts)
├── routes/              # Definición de endpoints (auth.routes.ts, pets.routes.ts)
├── services/            # Lógica de servicios (auth.service.ts)
├── index.ts             # Punto de entrada principal

🔑 Funcionalidades Implementadas (Endpoints)
Todas las rutas comienzan con /api.
Autenticación y Usuarios (auth.routes.ts)
Gestiona el acceso y el CRUD de usuarios (clientes y veterinarios).

# POST -- /api/auth/register PARA CREAR UN USUARIO
# POST -- /api/auth/login PARA INICIAR SESION
# PUT -- /api/auth/update/:id PARA ACTUALIZAR DATOS DE UN USUARIO
# DELETE -- /api/auth/delete/:id PARA ELIMINAR UN USUARIO DE LA BASE DE DATOS
# GET -- api/pets/my LISTA LAS MASCOTAS DE UN USUARIO

# Procedemos a REGISTRARNOS
-POST http://localhost:3000/api/auth/register

EN EL BODY DE INSOMINA - EN MODO JSON, COLOCAMOS 
{
  "name": "Ana Guzman",
  "email": "aguzica@gmail.com",
  "password": "contraseña123"
 }

 # Seguimos por LOGUEARNOS
 -POST http://localhost:3000/api/auth/login
EN EL BODY DE INSOMINA - EN MODO JSON, COLOCAMOS 
{
"email": "aguzica@gmail.com",
"password": "contraseña123"
}

Y NOS DEVUELVE EL TOKEN:
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2VlN2RiOWQyMTQzOWNiNjNlOTUwMiIsIm5hbWUiOiJBbmEgR3V6bWFuIiwicm9sZSI6ImNsaWVudCIsImlhdCI6MTc2OTkyNDg1MywiZXhwIjoxNzcwMDExMjUzLCJpc3MiOiJwYXRpdGFzLWZlbGljZXMtYXBpIn0.LueGPQfyouINJlOmFRb619XozkX3hgtaUhEbmuZPO3c"
}

# CREAR MASCOTA
- POST http://localhost:3000/api/pets/register
EN EL BODY DE INSOMINA - MODO JSON
{
  "name": "Goyo",
  "species": "Dog",
  "breed": "Yorkshire",
  "age": 10
}

VA A SOLICITAR EL TOKEN - EL QUE ME DEVOLVIO EN EL PASO ANTERIOR

Y EN AUTH - SELECCIONO LA OPCION "BEARER TOKEN" Y COLOCO EL "TOKEN"
ME DEVUELVE:
{
	"name": "Goyo",
	"species": "Dog",
	"breed": "Yorkshire",
	"age": 10,
	"owner": "69829e14edc1d1e0b91bf3a6",
	"_id": "6982a4f6edc1d1e0b91bf3ab",
	"__v": 0
}
# PARA LISTAR UNA MASCOTA
- GET http://localhost:3000/api/pets/6982a4f6edc1d1e0b91bf3ab (CON EL ID DE LA MASCOTA)
- EN AUTH COLOCO EL TOKEN DEL DUEÑO
- ME DEVUELVE:
{
	"_id": "6982a4f6edc1d1e0b91bf3ab",
	"name": "Goyo",
	"species": "Dog",
	"breed": "Yorkshire",
	"age": 10,
	"owner": {
		"_id": "69829e14edc1d1e0b91bf3a6",
		"email": "cabeguzica@gmail.com",
		"name": "camila guzman"
	},
	"__v": 0
}

# PARA MODIFICAR UN CLIENTE

TIENE QUE ESTAR LOGUEADO, PARA TENER EL TOKEN
- POST http://localhost:3000/api/auth/login
{
"email": "vilma_11@hotmail.com",
"password": "contraseña123"

}
ME DEVUELVE EL TOKEN:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODJhMmY0ZWRjMWQxZTBiOTFiZjNhOSIsIm5hbWUiOiJ2aWxtYSBndXptYW4iLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNzcwMTcwODEyLCJleHAiOjE3NzAyNTcyMTIsImlzcyI6InBhdGl0YXMtZmVsaWNlcy1hcGkifQ.aqMUsvWcHZhvPsX6tpBHmUvbCZx1uh8Q-1NGiRXwunU

SIGO PARA MODIFICAR:
- PUT http://localhost:3000/api/auth/update/6982a2f4edc1d1e0b91bf3a9 (LE AGREGO EL ID)
Y EN AUTH - MODO BEARER TOKEN, COLOCO EL TOKEN DEL USUARIO LOGUEADO (EN CASO DE QUE EL CLIENTE QUIERA HACER UNA MODIFICACION DE SUS DATOS)

# PARA ELIMINAR UN CLIENTE

- DELETE http://localhost:3000/api/auth/delete/6982b234bb0ccbf84d762593 (AGREGO EL ID QUE SACO DE LA DB)

- EM AUTH COLOCO EL TOKEN DEL ADMINISTRADOR (YA QUE SOLO EL POSEE LA AUTORIZACION PARA ELIMINAR)

ME DEVUELVE:
{
	"message": "Usuario eliminado correctamente",
	"user": {
		"_id": "6982b234bb0ccbf84d762593",
		"email": "aguzica@gmail.com",
		"password": "$2b$10$cDNuieD5tulGxmfAn84/ueJZwHV3XpBloMhr3nbnQ1eCV51OJVOEW",
		"name": "Ana Guzman",
		"role": "client",
		"__v": 0
	}
}


