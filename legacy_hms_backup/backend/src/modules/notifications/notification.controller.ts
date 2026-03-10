import { Request, Response, NextFunction } from 'express';
import * as notificationService from './notification.service';

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await notificationService.createNotification(req.body);
        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.user.id);
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        next(error);
    }
};

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await notificationService.markAsRead(req.params.id as string);
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};
