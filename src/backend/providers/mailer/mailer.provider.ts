import { EmailMessage } from "@/value-objects/email-message.value-object";

export interface IMailerProvider {
    send(emailMessage: EmailMessage): Promise<void>;
}
