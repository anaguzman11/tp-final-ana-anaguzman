import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createHistorialClinico, getHistorialClinicoByPet, getAllHistorialClinico } from '../controllers/historialClinico.controller';

const router = Router();

router.use(authenticate);

router.post('/', createHistorialClinico);
router.get('/pet/:petId', getHistorialClinicoByPet);
router.get('/all', getAllHistorialClinico);

export default router;
