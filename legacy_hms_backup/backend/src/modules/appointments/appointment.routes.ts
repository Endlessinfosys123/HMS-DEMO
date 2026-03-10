import { Router } from 'express';
import { createAppointment, getDoctorAppointments, getPatientAppointments, updateStatus } from './appointment.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorizeRoles('ADMIN', 'RECEPTIONIST', 'PATIENT'), createAppointment);
router.get('/doctor/:doctorId', authorizeRoles('ADMIN', 'RECEPTIONIST', 'DOCTOR'), getDoctorAppointments);
router.get('/patient/:patientId', authorizeRoles('ADMIN', 'RECEPTIONIST', 'PATIENT', 'DOCTOR'), getPatientAppointments);
router.patch('/:id/status', authorizeRoles('ADMIN', 'RECEPTIONIST', 'DOCTOR'), updateStatus);

export default router;
