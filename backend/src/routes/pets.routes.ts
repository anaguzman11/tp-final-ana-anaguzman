import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import {
  createPet,
  getMyPets,
  getPetById,
  updatePet,
  deletePet
} from '../controllers/pet.controller';

const router = Router();

// Todas las rutas de abajo requieren estar logueado
router.use(authenticate);

// POST-->Registrar una nueva mascota
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('species').isIn(['Dog', 'Cat', 'Bird', 'Other']).withMessage('Especie inválida'),
    body('breed').notEmpty().withMessage('La raza es requerida'),
    body('age').isInt({ min: 0 }).withMessage('La edad debe ser un número positivo'),
  ],
  createPet
);

// GET /api/pets/my---> Listar las mascotas del usuario autenticado
router.get('/my', getMyPets);

// GET /api/pets/:id ---> Obtener una sola mascota por ID
router.get('/:id', getPetById);

// PUT /api/pets/:id ---> Actualizar una mascota
router.put('/:id',
  [
    body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('age').optional().isInt({ min: 0 }).withMessage('La edad debe ser un número positivo'),
  ],
  updatePet
);

// DELETE /api/pets/:id ---> Eliminar una mascota
router.delete('/:id', deletePet);

export default router;
