import { EmailMessage } from "../value-objects/email-message.vo";

export interface CanSendEmail {
    sendEmail(message: EmailMessage): Promise<void>;
}
