// pages/api/send-email.ts

import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: "mail.spacemail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
    },
});

export default async (to: string, subject: string, text?: string, html?: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
        return {
            success: false,
            message: `Invalid email format: ${to}`,
            code: 400
        };
    }

    const message: any = {
        from: process.env.SMTP_USER,
        to,
        subject,
        text: text || undefined,
        html: html || undefined
    };

    try {
        await transporter.sendMail(message);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            message: `Error sending email: ${error}`,
            code: 500
        };
    }
}