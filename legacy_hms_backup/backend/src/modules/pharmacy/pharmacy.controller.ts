import { Request, Response, NextFunction } from 'express';
import * as pharmacyService from './pharmacy.service';

export const createMedication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medication = await pharmacyService.addMedication(req.body);
        res.status(201).json({ success: true, data: medication });
    } catch (error) {
        next(error);
    }
};

export const getMedications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medications = await pharmacyService.getAllMedications();
        res.status(200).json({ success: true, data: medications });
    } catch (error) {
        next(error);
    }
};

export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medication = await pharmacyService.updateMedicationStock(req.params.id as string, Number(req.body.stock));
        res.status(200).json({ success: true, data: medication });
    } catch (error) {
        next(error);
    }
};
