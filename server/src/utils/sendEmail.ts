import nodemailer from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

export const sendEmail = async (options: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        host: '74.125.142.108',
        port: 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
        connectionTimeout: 10000, 
        greetingTimeout: 10000,
    });

    const mailOptions = {
        from: `"StockMaster Admin" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    return await transporter.sendMail(mailOptions);
};