import { Request, Response, NextFunction } from 'express';
import * as billingService from './billing.service';

export const generateInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoice = await billingService.createInvoice(req.body);
        res.status(201).json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
};

export const getPatientInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoices = await billingService.getInvoicesByPatient(req.params.patientId as string);
        res.status(200).json({ success: true, data: invoices });
    } catch (error) {
        next(error);
    }
};

export const getInvoiceDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoice = await billingService.getInvoiceById(req.params.id as string);
        res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
};

export const makePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payment = await billingService.createPayment({ ...req.body, invoiceId: req.params.invoiceId as string });
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        next(error);
    }
};
