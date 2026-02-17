import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createMedicalRecord, getMedicalRecordsByPet, getAllMedicalRecords } from '../controllers/medicalRecord.controller';

const router = Router();

router.use(authenticate);

router.post('/', createMedicalRecord);
router.get('/pet/:petId', getMedicalRecordsByPet);
router.get('/all', getAllMedicalRecords);

export default router;
