import { Router } from 'express';
import { createConsultation, getConsultationById, getPatientConsultations } from './consultation.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorizeRoles('DOCTOR'), createConsultation);
router.get('/:id', authorizeRoles('ADMIN', 'DOCTOR', 'PATIENT'), getConsultationById);
router.get('/patient/:patientId', authorizeRoles('ADMIN', 'DOCTOR', 'PATIENT'), getPatientConsultations);

export default router;
