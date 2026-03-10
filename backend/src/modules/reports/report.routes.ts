import { Router } from 'express';
import { createReport, getReports } from './report.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorizeRoles('ADMIN', 'DOCTOR'), createReport);
router.get('/', authorizeRoles('ADMIN', 'DOCTOR', 'RECEPTIONIST'), getReports);

export default router;
