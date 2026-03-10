import { Request, Response, NextFunction } from 'express';
import * as consultationService from './consultation.service';

export const createConsultation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const consultation = await consultationService.createConsultation(req.body);
        res.status(201).json({ success: true, data: consultation });
    } catch (error) {
        next(error);
    }
};

export const getConsultationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const consultation = await consultationService.getConsultationById(req.params.id as string);
        res.status(200).json({ success: true, data: consultation });
    } catch (error) {
        next(error);
    }
};

export const getPatientConsultations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const consultations = await consultationService.getConsultationsByPatient(req.params.patientId as string);
        res.status(200).json({ success: true, data: consultations });
    } catch (error) {
        next(error);
    }
};
