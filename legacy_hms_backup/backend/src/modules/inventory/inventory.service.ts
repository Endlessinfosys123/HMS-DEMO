import prisma from '../../utils/prisma';

export const createSupplier = async (data: any) => {
    return await prisma.supplier.create({ data });
};

export const getSuppliers = async () => {
    return await prisma.supplier.findMany({ orderBy: { name: 'asc' } });
};

export const addInventoryItem = async (data: any) => {
    const { medicationId, name, quantity, unit, reorderLevel, supplierId } = data;

    return await prisma.inventoryItem.create({
        data: {
            medicationId: medicationId || null,
            name,
            quantity: parseInt(quantity),
            unit,
            reorderLevel: parseInt(reorderLevel),
            supplierId: supplierId || null
        }
    });
};

export const getInventoryItems = async () => {
    return await prisma.inventoryItem.findMany({
        include: { medication: { select: { name: true } }, supplier: { select: { name: true } } },
        orderBy: { name: 'asc' }
    });
};

export const updateInventoryQuantity = async (id: string, newQuantity: number) => {
    return await prisma.inventoryItem.update({
        where: { id },
        data: { quantity: newQuantity }
    });
};
