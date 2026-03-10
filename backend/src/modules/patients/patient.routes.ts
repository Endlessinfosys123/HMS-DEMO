import { Router } from 'express';
import { createPatient, getAllPatients, getPatientById, updatePatient, deletePatient } from './patient.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';

const router = Router();

// Protect all patient routes
router.use(authenticate);

router.post('/', authorizeRoles('ADMIN', 'RECEPTIONIST'), createPatient);
router.get('/', authorizeRoles('ADMIN', 'RECEPTIONIST', 'DOCTOR'), getAllPatients);
router.get('/:id', authorizeRoles('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE'), getPatientById);
router.put('/:id', authorizeRoles('ADMIN', 'RECEPTIONIST'), updatePatient);
router.delete('/:id', authorizeRoles('ADMIN'), deletePatient);

export default router;
