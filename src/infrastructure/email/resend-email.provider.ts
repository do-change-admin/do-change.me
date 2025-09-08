import { CanSendEmail } from "@/backend-contracts";
import { EmailMessage } from "@/value-objects/email-message.vo";
import { Resend } from "resend";

export class ResendEmailProvider implements CanSendEmail {
    private sender!: Resend;

    constructor(apiKey: string) {
        this.sender = new Resend(apiKey);
    }

    /**
     * Unsafe.
     */
    async sendEmail(message: EmailMessage): Promise<void> {
        try {
            await this.sender.emails.send({
                from: message.from.address(),
                to: message.to.address(),
                subject: message.subject,
                text: message.html
            });
        } catch (err) {
            console.error("Email sending failed:", err);
            throw err;
        }
    }
}
