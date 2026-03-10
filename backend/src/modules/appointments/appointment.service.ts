import prisma from '../../utils/prisma';

export const createAppointment = async (data: any) => {
    const { patientId, doctorId, appointmentDate, reason } = data;

    // Basic validation to check if doctor exists
    const doctor = await prisma.user.findUnique({
        where: { id: doctorId },
        include: { role: true }
    });

    if (!doctor || doctor.role.name !== 'DOCTOR') {
        throw { statusCode: 400, message: 'Invalid doctor ID or user is not a doctor' };
    }

    const appointment = await prisma.appointment.create({
        data: {
            patientId,
            doctorId,
            appointmentDate: new Date(appointmentDate),
            reason,
            status: 'SCHEDULED'
        }
    });

    return appointment;
};

export const getAppointmentsByDoctor = async (doctorId: string) => {
    return await prisma.appointment.findMany({
        where: { doctorId },
        include: { patient: true },
        orderBy: { appointmentDate: 'asc' }
    });
};

export const getAppointmentsByPatient = async (patientId: string) => {
    return await prisma.appointment.findMany({
        where: { patientId },
        include: { doctor: { select: { firstName: true, lastName: true, doctorProfile: true } } },
        orderBy: { appointmentDate: 'desc' }
    });
};

export const updateAppointmentStatus = async (id: string, status: string) => {
    return await prisma.appointment.update({
        where: { id },
        data: { status }
    });
};
