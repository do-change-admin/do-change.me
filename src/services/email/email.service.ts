import { CanSendEmail } from "@/backend-contracts";
import { EmailMessage } from "@/value-objects/email-message.vo";

export class EmailService {
    constructor(private readonly mailer: CanSendEmail) { }

    sendEmail = async (data: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }) => {
        const email = EmailMessage.create(data);
        await this.mailer.sendEmail(email);
    };
}
