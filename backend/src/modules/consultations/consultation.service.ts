import prisma from '../../utils/prisma';

export const createConsultation = async (data: any) => {
    const { appointmentId, patientId, doctorId, symptoms, diagnosis, notes } = data;

    const consultation = await prisma.consultation.create({
        data: {
            appointmentId,
            patientId,
            doctorId,
            symptoms,
            diagnosis,
            notes
        }
    });

    if (appointmentId) {
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'COMPLETED' } // Mark appointment as completed
        });
    }

    return consultation;
};

export const getConsultationById = async (id: string) => {
    const consultation = await prisma.consultation.findUnique({
        where: { id },
        include: {
            patient: { select: { firstName: true, lastName: true } },
            doctor: { select: { firstName: true, lastName: true } },
            prescriptions: { include: { medication: true } },
        }
    });

    if (!consultation) throw { statusCode: 404, message: 'Consultation not found' };
    return consultation;
};

export const getConsultationsByPatient = async (patientId: string) => {
    return await prisma.consultation.findMany({
        where: { patientId },
        include: { doctor: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' }
    });
};
