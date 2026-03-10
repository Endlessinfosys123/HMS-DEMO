import { Request, Response, NextFunction } from 'express';
import * as appointmentService from './appointment.service';

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointment = await appointmentService.createAppointment(req.body);
        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        next(error);
    }
};

export const getDoctorAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // If user is a doctor, they can only get their own appointments unless they are ADMIN
        let doctorId = req.params.doctorId;
        if (req.user.role.name === 'DOCTOR' && req.user.id !== doctorId) {
            doctorId = req.user.id;
        }

        const appointments = await appointmentService.getAppointmentsByDoctor(doctorId as string);
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        next(error);
    }
};

export const getPatientAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointments = await appointmentService.getAppointmentsByPatient(req.params.patientId as string);
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointment = await appointmentService.updateAppointmentStatus(req.params.id as string, req.body.status);
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        next(error);
    }
};
