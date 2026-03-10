import { Request, Response, NextFunction } from 'express';
import * as patientService from './patient.service';

export const createPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patient = await patientService.createPatient(req.body);
        res.status(201).json({ success: true, data: patient });
    } catch (error) {
        next(error);
    }
};

export const getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patients = await patientService.getAllPatients();
        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        next(error);
    }
};

export const getPatientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patient = await patientService.getPatientById(req.params.id as string);
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        next(error);
    }
};

export const updatePatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patient = await patientService.updatePatient(req.params.id as string, req.body);
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        next(error);
    }
};

export const deletePatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await patientService.deletePatient(req.params.id as string);
        res.status(200).json({ success: true, message: 'Patient deleted successfully' });
    } catch (error) {
        next(error);
    }
};
