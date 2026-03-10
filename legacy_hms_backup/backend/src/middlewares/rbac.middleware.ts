import { Request, Response, NextFunction } from 'express';

export const authorize = (requiredPermissions: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role || !req.user.role.permissions) {
            return res.status(403).json({ success: false, message: 'Forbidden: No permissions found' });
        }

        const userPermissions = req.user.role.permissions.map((p: any) => p.name);

        const hasPermission = requiredPermissions.every(rp => userPermissions.includes(rp));

        // Admins usually have all permissions, but we can also explicitly check
        if (req.user.role.name === 'ADMIN') {
            return next();
        }

        if (!hasPermission) {
            return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        if (!roles.includes(req.user.role.name)) {
            return res.status(403).json({ success: false, message: `Role ${req.user.role.name} is not authorized` });
        }
        next();
    };
};
