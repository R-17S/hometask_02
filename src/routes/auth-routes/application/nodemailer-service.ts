import nodemailer from 'nodemailer';
import {injectable} from "inversify";


const transporter = nodemailer.createTransport({
    service: 'gmail', // или другой SMTP-сервис
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

@injectable()
export class NodemailerService  {
    async sendEmail(to: string, code: string, template: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: 'Подтверждение регистрации',
            html: template.replace('{{code}}', code)
        };


        await transporter.sendMail(mailOptions);
    }
}