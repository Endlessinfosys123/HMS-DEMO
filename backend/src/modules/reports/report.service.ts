import prisma from '../../utils/prisma';

export const generateReport = async (data: any) => {
    // Mocking report generation
    const fileUrl = `/reports/mock-${Date.now()}.pdf`;

    return await prisma.report.create({
        data: {
            name: data.name,
            type: data.type,
            generatedBy: data.generatedBy,
            fileUrl
        }
    });
};

export const getReports = async () => {
    return await prisma.report.findMany({
        orderBy: { createdAt: 'desc' }
    });
};
