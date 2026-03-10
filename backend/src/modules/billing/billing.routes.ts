import { Router } from 'express';
import { generateInvoice, getPatientInvoices, getInvoiceDetails, makePayment } from './billing.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/invoices', authorizeRoles('ADMIN', 'RECEPTIONIST'), generateInvoice);
router.get('/invoices/patient/:patientId', authorizeRoles('ADMIN', 'RECEPTIONIST', 'PATIENT'), getPatientInvoices);
router.get('/invoices/:id', authorizeRoles('ADMIN', 'RECEPTIONIST', 'PATIENT'), getInvoiceDetails);

router.post('/invoices/:invoiceId/payments', authorizeRoles('ADMIN', 'RECEPTIONIST', 'PATIENT'), makePayment);

export default router;
