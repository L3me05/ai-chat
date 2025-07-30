import * as nodemailer from "nodemailer";
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

class EmailTool {
    constructor({host, port, user, pass}) {
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });

        this.tool = tool(async ({ to, subject, text, html }) => {
            console.log("📨 Invio dell'email in corso");
            const info = await this.transporter.sendMail({
                from: `"Agente" <${user}>`,
                to,
                subject,
                text,
                html,
            });
            return `Email inviata: ${info.messageId}`;
        }, {
            name: 'email_sender',
            description: 'Invia un\'email con oggetto e corpo specificati a un destinatario',
            schema: z.object({
                to: z.string().email('Email destinatario non valida'),
                subject: z.string().min(1, 'L\'oggetto non può essere vuoto'),
                text: z.string().optional(),
                html: z.string().optional(),
            }),
        });
    }
}

export default EmailTool;