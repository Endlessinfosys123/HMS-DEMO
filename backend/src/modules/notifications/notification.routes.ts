import { Router } from 'express';
import { createNotification, getMyNotifications, markRead } from './notification.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

// Only admins or system processes should create notifications manually
router.post('/', authorizeRoles('ADMIN'), createNotification);
router.get('/me', getMyNotifications); // All authenticated users can get their notifications
router.patch('/:id/read', markRead);

export default router;
