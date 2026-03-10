import { Router } from 'express';
import { createPrescription, getConsultationPrescriptions, getPatientPrescriptions } from './prescription.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorizeRoles('DOCTOR'), createPrescription);
router.get('/consultation/:consultationId', authorizeRoles('ADMIN', 'DOCTOR', 'PATIENT', 'PHARMACIST'), getConsultationPrescriptions);
router.get('/patient/:patientId', authorizeRoles('ADMIN', 'DOCTOR', 'PATIENT', 'PHARMACIST'), getPatientPrescriptions);

export default router;
