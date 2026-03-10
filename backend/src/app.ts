import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app: Application = express();

// Security and utility middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base Route
app.get('/', (req, res) => {
    res.send('HMS API is running...');
});

// Modular Routes
import authRoutes from './modules/auth/auth.routes';
import patientRoutes from './modules/patients/patient.routes';
import appointmentRoutes from './modules/appointments/appointment.routes';
import consultationRoutes from './modules/consultations/consultation.routes';
import prescriptionRoutes from './modules/prescriptions/prescription.routes';
import billingRoutes from './modules/billing/billing.routes';
import pharmacyRoutes from './modules/pharmacy/pharmacy.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import labRoutes from './modules/lab/lab.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import reportRoutes from './modules/reports/report.routes';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/consultations', consultationRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/pharmacy', pharmacyRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/lab', labRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reports', reportRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
