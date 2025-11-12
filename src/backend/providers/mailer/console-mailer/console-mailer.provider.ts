import { EmailMessage } from "@/value-objects/email-message.value-object";
import { IMailerProvider } from "../mailer.provider";
import { injectable } from "inversify";

@injectable()
export class ConsoleMailerProvider implements IMailerProvider {
    public async send(emailMessage: EmailMessage): Promise<void> {
        const { message } = emailMessage;
        console.log(message, "succesfully sent email");
    }
}
