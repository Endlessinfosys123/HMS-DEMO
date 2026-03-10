import prisma from '../../utils/prisma';

export const createLabTest = async (data: any) => {
    return await prisma.labTest.create({
        data: {
            name: data.name,
            description: data.description,
            price: parseFloat(data.price)
        }
    });
};

export const getLabTests = async () => {
    return await prisma.labTest.findMany({ orderBy: { name: 'asc' } });
};

export const createLabOrder = async (data: any) => {
    return await prisma.labOrder.create({
        data: {
            patientId: data.patientId,
            testId: data.testId,
            status: 'PENDING'
        }
    });
};

export const getLabOrdersByPatient = async (patientId: string) => {
    return await prisma.labOrder.findMany({
        where: { patientId },
        include: { test: true },
        orderBy: { orderDate: 'desc' }
    });
};

export const updateLabOrderStatus = async (id: string, status: string, result?: string) => {
    return await prisma.labOrder.update({
        where: { id },
        data: { status, result }
    });
};
