import { Request, Response, NextFunction } from 'express';
import * as inventoryService from './inventory.service';

export const addSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supplier = await inventoryService.createSupplier(req.body);
        res.status(201).json({ success: true, data: supplier });
    } catch (error) {
        next(error);
    }
};

export const getSuppliers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const suppliers = await inventoryService.getSuppliers();
        res.status(200).json({ success: true, data: suppliers });
    } catch (error) {
        next(error);
    }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await inventoryService.addInventoryItem(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await inventoryService.getInventoryItems();
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

export const updateQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await inventoryService.updateInventoryQuantity(req.params.id as string, Number(req.body.quantity));
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};
