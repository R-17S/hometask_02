import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail', // или другой SMTP-сервис
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const nodemailerService = {
    async sendEmail(to: string, code: string, template: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: 'Подтверждение регистрации',
            html: template.replace('{{code}}', code)
        };

        console.log('📤 Отправка письма:', {
            to,
            subject: mailOptions.subject,
            code,
            previewHtml: mailOptions.html.slice(0, 100) + '...'
        });

        await transporter.sendMail(mailOptions);
    }
};