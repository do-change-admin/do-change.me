import { EmailMessage } from "@/value-objects/email-message.value-object";

export interface IMailerService {
    send(emailMessage: EmailMessage): Promise<void>;
}
