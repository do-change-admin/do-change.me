import { EmailMessage } from "@/value-objects/email-message.vo";

export interface ProvidesEmailSending {
    sendEmail(message: EmailMessage): Promise<void>;
}

export type EmailProvider = ProvidesEmailSending