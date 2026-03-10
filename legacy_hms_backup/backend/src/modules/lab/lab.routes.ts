import { Router } from 'express';
import { addLabTest, getTests, orderTest, getPatientOrders, updateOrderStatus } from './lab.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/tests', authorizeRoles('ADMIN', 'LAB_TECH'), addLabTest);
router.get('/tests', authorizeRoles('ADMIN', 'LAB_TECH', 'DOCTOR', 'RECEPTIONIST'), getTests);

router.post('/orders', authorizeRoles('ADMIN', 'DOCTOR', 'RECEPTIONIST'), orderTest);
router.get('/orders/patient/:patientId', authorizeRoles('ADMIN', 'DOCTOR', 'LAB_TECH', 'PATIENT'), getPatientOrders);
router.patch('/orders/:id/status', authorizeRoles('ADMIN', 'LAB_TECH'), updateOrderStatus);

export default router;
