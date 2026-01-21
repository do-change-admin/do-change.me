import { EmailMessage } from "@/value-objects/email-message.value-object";
import { MailerProvider } from "../mailer.provider";
import { injectable } from "inversify";

@injectable()
export class ConsoleMailerProvider implements MailerProvider {
    public async send(emailMessage: EmailMessage): Promise<void> {
        const { message } = emailMessage;
        console.log(message, "succesfully sent email");
    }
}
