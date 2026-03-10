import { Request, Response, NextFunction } from 'express';
import * as reportService from './report.service';

export const createReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = { ...req.body, generatedBy: req.user.id };
        const report = await reportService.generateReport(data);
        res.status(201).json({ success: true, data: report });
    } catch (error) {
        next(error);
    }
};

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reports = await reportService.getReports();
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        next(error);
    }
};
