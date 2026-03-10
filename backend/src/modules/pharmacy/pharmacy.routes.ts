import { Router } from 'express';
import { createMedication, getMedications, updateStock } from './pharmacy.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/medications', authorizeRoles('ADMIN', 'PHARMACIST'), createMedication);
router.get('/medications', authorizeRoles('ADMIN', 'PHARMACIST', 'DOCTOR', 'NURSE'), getMedications);
router.patch('/medications/:id/stock', authorizeRoles('ADMIN', 'PHARMACIST'), updateStock);

export default router;
