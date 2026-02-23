# Patitas Felices - Gestión Veterinaria 🐾

Bienvenido a **Patitas Felices**, una aplicación integral para la administración de clínicas veterinarias. Este proyecto evolucionó a partir de nuestro **TP Intermedio**, transformándose en una plataforma completa con Frontend y Backend robustos.

## 🚀 Evolución del Proyecto
El proyecto comenzó como una base conceptual en el TP Intermedio. Con la ayuda de la automatización de **Antigravity** y la inspiración en el diseño de **Stitch**, logramos desarrollar una interfaz moderna ("Summer Theme") y una API escalable.

---

## �️ Tecnologías Utilizadas

### Frontend
- **React 19** + **Vite**: Para una experiencia de desarrollo rápida y moderna.
- **TypeScript**: Garantizando tipado fuerte y menos errores en tiempo de ejecución.
- **Tailwind CSS**: Con una paleta de colores personalizada ("Summer Lime", "Summer Cyan", etc.).
- **Material Icons**: Para una iconografía intuitiva.
- **Antigravity**: Utilizado para la automatización de componentes y lógica de negocio.

### Backend
- **Node.js** + **Express**: Servidor de alto rendimiento.
- **MongoDB** + **Mongoose**: Base de datos NoSQL para flexibilidad en los registros.
- **JWT (JSON Web Tokens)**: Seguridad en la autenticación y manejo de sesiones.
- **Bcrypt**: Encriptación segura de contraseñas.

---

## � Acceso de Administrador
Para probar todas las funcionalidades (gestión de dueños, mascotas e historiales), utiliza las siguientes credenciales:

- **Usuario**: `admin@admin.com`
- **Contraseña**: `admin1234`

---

## 🧪 Verificación de la API (Backend)
Durante el desarrollo inicial, verificamos la robustez del backend utilizando **CURLs** e **Insomnia**. Aquí algunos ejemplos clave:

### 1. Iniciar Sesión (Login)
```bash
curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@admin.com", "password": "admin1234"}'
```

### 2. Registrar Mascota (Requiere Token)
```bash
curl -X POST http://localhost:3000/api/pets/register \
     -H "Authorization: Bearer TU_TOKEN_JWT" \
     -H "Content-Type: application/json" \
     -d '{"name": "Firulais", "species": "Dog", "breed": "Poodle", "age": 3, "owner": "ID_DEL_DUEÑO"}'
```

### 3. Obtener Historial Clínico
```bash
curl -X GET http://localhost:3000/api/medical-records/all \
     -H "Authorization: Bearer TU_TOKEN_JWT"
```

---

## 📋 Características Principales
- **Gestión de Dueños**: Registro y edición de clientes (rol `client`).
- **Dashboard de Mascotas**: Visualización clara con filtros de búsqueda por nombre, especie o dueño.
- **Historial Clínico**: Registro centralizado de atenciones médicos para cada mascota.
- **Modo Oscuro/Claro**: Interfaz adaptable con el nuevo "Summer Theme".
- **Buscador Inteligente**: Filtrado en tiempo real en todas las tablas de datos.

---

## ⚙️ Instalación

### Backend
1. Navega a `/backend`.
2. Ejecuta `npm install`.
3. Crea un archivo `.env` (ver `.env.example`).
4. Inicia con `npm run dev`.

### Frontend
1. Navega a `/frontend`.
2. Ejecuta `npm install`.
3. Inicia con `npm run dev`.

---

## 👤 Autor
Desarrollado por **Ana Guzmán**.
*Proyecto Final de la Diplomatura en Desarrollo Web con Inteligencia Artificial.*
