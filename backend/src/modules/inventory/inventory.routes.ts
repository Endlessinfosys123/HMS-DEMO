import { Router } from 'express';
import { addSupplier, getSuppliers, addItem, getItems, updateQuantity } from './inventory.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/suppliers', authorizeRoles('ADMIN', 'PHARMACIST'), addSupplier);
router.get('/suppliers', authorizeRoles('ADMIN', 'PHARMACIST'), getSuppliers);

router.post('/items', authorizeRoles('ADMIN', 'PHARMACIST'), addItem);
router.get('/items', authorizeRoles('ADMIN', 'PHARMACIST', 'DOCTOR', 'NURSE'), getItems);
router.patch('/items/:id/quantity', authorizeRoles('ADMIN', 'PHARMACIST', 'NURSE'), updateQuantity);

export default router;
