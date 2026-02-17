# FRONTEND

# Patitas Felices - Adopción de Mascotas

Aplicación web para la adopción de mascotas, desarrollada como proyecto final de la Diplomatura en Desarrollo Web con Inteligencia Artificial.

## 📋 Características

- **Registro e Inicio de Sesión**: Autenticación segura con JWT.
- **Gestión de Mascotas**: CRUD completo para mascotas (crear, ver, editar, eliminar).
- **Roles de Usuario**: Administrador y Usuario regular.
- **Diseño Responsivo**: Interfaz adaptada para móviles y escritorio.

## 🚀 Instalación y Ejecución

### Requisitos Previos

- Node.js (v16 o superior)
- npm

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd tp-final-ana-guzman
```

### 2. Configurar el Backend

```bash
cd backend
npm install
# Crear archivo .env en backend/ con las siguientes variables:
# MONGODB_URI=tu_conexion_mongodb
# JWT_SECRET=tu_secreto_jwt
# JWT_EXPIRES_IN=1h
npm run dev
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
# Crear archivo .env en frontend/ con la siguiente variable:
# VITE_API_URL=http://localhost:3000
npm run dev
```

### 4. Acceder a la aplicación

Abrir [http://localhost:5173](http://localhost:5173) en el navegador.

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose)
- **JWT** (JSON Web Tokens)
- **Bcrypt** (Hashing de contraseñas)

### Frontend
- **React**
- **Vite**
- **Tailwind CSS**
- **Axios**

## 👥 Autores

- Ana Guzmán
- [Otros colaboradores si aplica]

## 📄 Licencia

Este proyecto es para fines educativos.


# VETMANAGER

Aplicación web para la gestión de mascotas, desarrollada como proyecto final de la Diplomatura en Desarrollo Web con Inteligencia Artificial.

# CARACTERISTICAS

- **Registro e Inicio de Sesión**: Autenticación segura con JWT.
- **Gestión de Mascotas**: CRUD completo para mascotas (crear, ver, editar, eliminar).
- **Roles de Usuario**: Administrador y Usuario regular.
- **Diseño Responsivo**: Interfaz adaptada para móviles y escritorio.

Los datos se almacenan en una base de datos MongoDB.
clientes, mascotas, citas, veterinarios, medicamentos, historial de citas, historial de medicamentos.

## usuarios

- admin: admin.json 

```json
{
    "id": "675f2b6c2b6c2b6c2b6c2b6c",
    "name": "admin",
    "email": "admin@admin.com",
    "password": "admin",
    "role": "admin"
}
```

- cliente: clientes.json 

```json
{
    "id": "1",
    "nombre": "Ana",
    "apellido": "Guzman",
    "email": "cliente@cliente.com",
    "telefono": "12345678",
    "direccion": "direccion"
}
```

## mascotas: mascotas.json

```json
{
    "id": "1",
    "nombre": "mascota",
    "especie": "perro",
    "raza": "pastor aleman",
    "edad": 2,
    "cliente_id": "1"
}

### historiales clinicos: historiales_clinicos.json

```json
{
    "id": "1",
    "fecha": "2022-01-01",
    "descripcion": "Goyo se enfermo de gripe",
    "mascota_id": "1",
    
}, 
{
    "id":"1",
    "fecha": "2022-01-02",
    "descripcion": "Goyo sigue igual",
    "mascota_id": "1",
}

### Datos de Loguieo: usuarios.json

```json
{
    "id": "1",
   "user": "admin",
   "password": "admin"
}
```
