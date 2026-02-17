import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getAllClients } from '../controllers/auth.controller';
import { updateUser } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { deleteUser } from '../controllers/auth.controller';
import { UserRole } from '../types/auth';

const router = Router();

// Ruta POST para registrar un nuevo usuario
router.post(
  '/register',
  [
    // Validación básica con express-validator
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('El email debe ser válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  register
);

// Ruta POST para iniciar sesión
router.post(
  '/login',
  [
    // Validación básica de login
    body('email').isEmail().withMessage('El email debe ser válido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
  ],
  login
);

// NUEVA RUTA para actualizar usuario
router.put(
  '/update/:id',
  authenticate, // Primero verificamos que esté logueado
  [
    body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email').optional().isEmail().withMessage('El email debe ser válido'),
  ],
  updateUser
);

// ruta para eliminar usuario
router.delete('/delete/:id', authenticate, authorize(UserRole.ADMIN), deleteUser);



router.get('/admin-data', authenticate, authorize(UserRole.ADMIN), (req, res) => {
  res.json({ message: "Bienvenido, Administrador" });
});

export default router;
