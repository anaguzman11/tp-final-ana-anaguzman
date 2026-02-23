// Solución de IA para DNS
import * as dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import express, { Request, Response } from "express";
import path from "path";
import cors from 'cors';
import mongoose from "mongoose";
import petsRoutes from './routes/pets.routes';
import authRoutes from "./routes/auth.routes";
import historialCliniciRoutes from "./routes/historialClinico.routes";
import { authenticate, authorize } from "./middlewares/auth.middleware";
import { connectDB } from "./config/database";
import { UserRole } from "./types/auth";
import * as authService from './services/auth.service';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURACIÓN DE MIDDLEWARES ---

// 1. CORS: Permitimos todos los orígenes para evitar bloqueos en el despliegue inicial
app.use(cors({
  origin: '*',
  credentials: true
}));

// 2. Parseo de JSON
app.use(express.json());

// 3. Archivos estáticos
app.use(express.static(path.join(__dirname, "..", "public")));

// --- DEFINICIÓN DE RUTAS ---

// Ruta raíz para que Vercel NO de 404 al entrar a la URL principal
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API de Patitas Felices funcionando correctamente en Vercel");
});

app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/medical-records', historialCliniciRoutes);

// Cambié el require por un manejo más estándar si es posible, 
// pero mantengo tu estructura para no romper nada
try {
  const vetRoutes = require('./routes/veterinarian.routes').default;
  app.use('/api/veterinarian', vetRoutes);
} catch (e) {
  console.log("Rutas de veterinario no cargadas o no encontradas");
}

app.get("/public", (req: Request, res: Response) => {
  res.json({ message: "Cualquiera puede entrar!" });
});

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Acceso permitido" });
});

app.get("/admin", authenticate, authorize(UserRole.ADMIN), (req, res) => {
  res.json({ message: "Acceso de administrador permitido" });
});

app.get("/api/saludo", (req: Request, res: Response) => {
  res.json({ mensaje: "Hola desde la API 🚀" });
});

// --- INICIO DE CONEXIÓN (Lógica para Vercel) ---

// Intentamos conectar a la DB
connectDB().then(async () => {
  console.log("✅ Conexión a MongoDB exitosa");

  // Ejecutamos el seed del admin una sola vez
  try {
    await authService.seedAdmin();
    console.log("✅ Seed de Admin completado");
  } catch (error) {
    console.error("⚠️ Error al crear admin:", error);
  }
}).catch(err => {
  console.error("❌ Error fatal de conexión:", err);
});

// IMPORTANTE: En Vercel, no se usa app.listen de forma continua.
// Solo lo activamos si estamos corriendo localmente.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo localmente en http://localhost:${PORT} 🚀`);
  });
}

// ESTA LÍNEA ES LA MÁS IMPORTANTE PARA VERCEL
export default app;
