import prisma from '../../utils/prisma';

export const createPatient = async (data: any) => {
    // If registered with account, userId can be provided
    const patient = await prisma.patient.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: new Date(data.dateOfBirth),
            gender: data.gender,
            bloodGroup: data.bloodGroup,
            contactNumber: data.contactNumber,
            address: data.address,
            emergencyContact: data.emergencyContact,
            history: data.history,
            userId: data.userId || null,
        }
    });
    return patient;
};

export const getAllPatients = async () => {
    return await prisma.patient.findMany({
        orderBy: { createdAt: 'desc' },
    });
};

export const getPatientById = async (id: string) => {
    const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
            user: { select: { email: true, phone: true } },
            appointments: { take: 5, orderBy: { appointmentDate: 'desc' } },
            admissions: { take: 2, orderBy: { admissionDate: 'desc' } },
        }
    });
    if (!patient) throw { statusCode: 404, message: 'Patient not found' };
    return patient;
};

export const updatePatient = async (id: string, data: any) => {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) throw { statusCode: 404, message: 'Patient not found' };

    if (data.dateOfBirth) {
        data.dateOfBirth = new Date(data.dateOfBirth);
    }

    return await prisma.patient.update({
        where: { id },
        data,
    });
};

export const deletePatient = async (id: string) => {
    return await prisma.patient.delete({ where: { id } });
};
