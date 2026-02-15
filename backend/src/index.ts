// solucion de ia porque mongo no conectaba//
import * as dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);
//esto de arriba//

import express, { Request, Response } from "express";
import path from "path";
import petsRoutes from './routes/pets.routes';
import authRoutes from "./routes/auth.routes";
import { authenticate, authorize } from "./middlewares/auth.middleware";
import { connectDB } from "./config/database";
import { UserRole } from "./types/auth";



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "..", "public")));

app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/veterinarian', require('./routes/veterinarian.routes').default);



app.get("/public", (req: Request, res: Response) => {
  res.json({
    message: "Cualquiera puede entrar!",
  });
});

app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "Acceso permitido",
  });
});

// Ruta de administrador (requiere autenticación y rol admin)
app.get("/admin", authenticate, authorize(UserRole.ADMIN), (req, res) => {
  res.json({
    message: "Acceso de administrador permitido",
  });
});

app.get("/api/saludo", (req: Request, res: Response) => {
  res.json({ mensaje: "Hola desde la API 🚀" });
});


// Conectar a MongoDB y luego iniciar el servidor HTTP
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
  });
});
