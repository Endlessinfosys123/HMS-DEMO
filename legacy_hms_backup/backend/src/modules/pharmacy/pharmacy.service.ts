import prisma from '../../utils/prisma';

export const addMedication = async (data: any) => {
    return await prisma.medication.create({
        data: {
            name: data.name,
            description: data.description,
            manufacturer: data.manufacturer,
            price: parseFloat(data.price),
            stock: parseInt(data.stock)
        }
    });
};

export const getAllMedications = async () => {
    return await prisma.medication.findMany({
        orderBy: { name: 'asc' }
    });
};

export const updateMedicationStock = async (id: string, newStock: number) => {
    return await prisma.medication.update({
        where: { id },
        data: { stock: newStock }
    });
};
