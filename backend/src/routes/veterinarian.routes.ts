import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getAllPets } from '../controllers/veterinarian.controller';
import { UserRole } from '../types/auth';

const router = Router();

// Aplica el middleware de autenticación a todas las rutas de este router
router.use(authenticate);

// Ruta protegida por ROL: Solo accesible para usuarios con rol 'veterinarian'
router.get('/pets', authorize(UserRole.VETERINARIAN), getAllPets);

export default router;
