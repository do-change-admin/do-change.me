import { EmailMessage } from "@/value-objects/email-message.value-object";
import { IMailerService } from "../mailer.service";
import { injectable } from "inversify";

@injectable()
export class MockMailerService implements IMailerService {
    public async send(emailMessage: EmailMessage): Promise<void> {
        const { message } = emailMessage;
        console.log(message, "succesfully sent email");
    }
}
