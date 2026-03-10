import { Request, Response, NextFunction } from 'express';
import * as prescriptionService from './prescription.service';

export const createPrescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = { ...req.body, doctorId: req.user.id };
        const prescription = await prescriptionService.createPrescription(data);
        res.status(201).json({ success: true, data: prescription });
    } catch (error) {
        next(error);
    }
};

export const getConsultationPrescriptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prescriptions = await prescriptionService.getPrescriptionsByConsultation(req.params.consultationId as string);
        res.status(200).json({ success: true, data: prescriptions });
    } catch (error) {
        next(error);
    }
};

export const getPatientPrescriptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prescriptions = await prescriptionService.getPrescriptionsByPatient(req.params.patientId as string);
        res.status(200).json({ success: true, data: prescriptions });
    } catch (error) {
        next(error);
    }
};
