import { Request, Response, NextFunction } from 'express';
import * as labService from './lab.service';

export const addLabTest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const test = await labService.createLabTest(req.body);
        res.status(201).json({ success: true, data: test });
    } catch (error) {
        next(error);
    }
};

export const getTests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tests = await labService.getLabTests();
        res.status(200).json({ success: true, data: tests });
    } catch (error) {
        next(error);
    }
};

export const orderTest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await labService.createLabOrder(req.body);
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

export const getPatientOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await labService.getLabOrdersByPatient(req.params.patientId as string);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await labService.updateLabOrderStatus(req.params.id as string, req.body.status, req.body.result);
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};
