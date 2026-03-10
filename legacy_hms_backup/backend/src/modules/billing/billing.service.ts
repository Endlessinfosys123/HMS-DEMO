import prisma from '../../utils/prisma';

export const createInvoice = async (data: any) => {
    const { patientId, amount, dueDate } = data;

    const invoice = await prisma.invoice.create({
        data: {
            patientId,
            amount: parseFloat(amount),
            dueDate: dueDate ? new Date(dueDate) : null,
            status: 'UNPAID'
        }
    });

    return invoice;
};

export const getInvoicesByPatient = async (patientId: string) => {
    return await prisma.invoice.findMany({
        where: { patientId },
        include: { payments: true },
        orderBy: { createdAt: 'desc' }
    });
};

export const getInvoiceById = async (id: string) => {
    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: { patient: true, payments: true }
    });
    if (!invoice) throw { statusCode: 404, message: 'Invoice not found' };
    return invoice;
};

export const createPayment = async (data: any) => {
    const { invoiceId, amount, paymentMethod, transactionId } = data;

    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { payments: true } });
    if (!invoice) throw { statusCode: 404, message: 'Invoice not found' };

    const parsedAmount = parseFloat(amount);

    const payment = await prisma.payment.create({
        data: {
            invoiceId,
            amount: parsedAmount,
            paymentMethod,
            transactionId
        }
    });

    // Calculate total paid so far
    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + parsedAmount;

    let newStatus = 'PARTIAL';
    if (totalPaid >= invoice.amount) {
        newStatus = 'PAID';
    }

    await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus }
    });

    return payment;
};
