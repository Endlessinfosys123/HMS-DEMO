import prisma from '../../utils/prisma';

export const createNotification = async (data: any) => {
    return await prisma.notification.create({
        data: {
            userId: data.userId,
            type: data.type,
            message: data.message
        }
    });
};

export const getUserNotifications = async (userId: string) => {
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
};

export const markAsRead = async (id: string) => {
    return await prisma.notification.update({
        where: { id },
        data: { isRead: true }
    });
};
