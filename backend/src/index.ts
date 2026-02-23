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

// --- CONFIGURACIÓN DE MIDDLEWARES (ORDEN CRÍTICO) ---

// 1. CORS debe ser lo PRIMERO para que el navegador no bloquee
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// 2. Parseo de JSON
app.use(express.json());

// 3. Archivos estáticos
app.use(express.static(path.join(__dirname, "..", "public")));

// --- DEFINICIÓN DE RUTAS ---

app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/medical-records', historialCliniciRoutes);
app.use('/api/veterinarian', require('./routes/veterinarian.routes').default);

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

// --- INICIO DE CONEXIÓN Y SERVIDOR ---

connectDB().then(async () => {
  console.log("✅ Conexión inicial exitosa");

  try {
    // Esto asegura que el admin esté listo antes de que intentes loguearte
    await authService.seedAdmin();
  } catch (error) {
    console.error("❌ Error al crear admin:", error);
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
  });
}).catch(err => {
  console.error("❌ Error fatal al iniciar el sistema:", err);
});

export default app;
