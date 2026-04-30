/**
 * WHATSAPP INTEGRATION SERVICE
 * 
 * Provides utilities to generate WhatsApp messaging links for patients.
 */

export const whatsappService = {
    /**
     * Generates a wa.me link with a pre-filled message.
     */
    generateLink: (phone: string, message: string) => {
        // Remove non-numeric characters from phone
        const cleanPhone = phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    },

    /**
     * Send Appointment Confirmation
     */
    sendAppointmentConfirmation: (patientName: string, doctorName: string, date: string, time: string, phone: string) => {
        const message = `Hello ${patientName},\n\nYour appointment with Dr. ${doctorName} at HealthCore Clinic is confirmed for ${date} at ${time}.\n\nPlease arrive 10 minutes early. See you soon!`;
        window.open(whatsappService.generateLink(phone, message), '_blank');
    },

    /**
     * Send Invoice/Bill
     */
    sendInvoice: (patientName: string, amount: string, invoiceId: string, phone: string) => {
        const message = `Hello ${patientName},\n\nYour invoice #${invoiceId} for the amount of ₹${amount} has been generated.\n\nYou can pay online or at the reception.\n\nThank you for choosing HealthCore!`;
        window.open(whatsappService.generateLink(phone, message), '_blank');
    },

    /**
     * Send Lab Result Alert
     */
    sendLabAlert: (patientName: string, testName: string, phone: string) => {
        const message = `Hello ${patientName},\n\nYour lab results for "${testName}" are now ready. You can view them in your patient portal or collect them from the lab.\n\nRegards,\nHealthCore Lab`;
        window.open(whatsappService.generateLink(phone, message), '_blank');
    }
};
