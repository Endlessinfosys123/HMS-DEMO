import prisma from '../../utils/prisma';

export const createPrescription = async (data: any) => {
    const { consultationId, doctorId, medicationId, dosage, instructions, durationDays } = data;

    const prescription = await prisma.prescription.create({
        data: {
            consultationId,
            doctorId,
            medicationId,
            dosage,
            instructions,
            durationDays: Number(durationDays)
        }
    });

    return prescription;
};

export const getPrescriptionsByConsultation = async (consultationId: string) => {
    return await prisma.prescription.findMany({
        where: { consultationId },
        include: { medication: true, doctor: { select: { firstName: true, lastName: true } } }
    });
};

export const getPrescriptionsByPatient = async (patientId: string) => {
    return await prisma.prescription.findMany({
        where: { consultation: { patientId } },
        include: {
            medication: true,
            consultation: { select: { diagnosis: true, createdAt: true } },
            doctor: { select: { firstName: true, lastName: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};
