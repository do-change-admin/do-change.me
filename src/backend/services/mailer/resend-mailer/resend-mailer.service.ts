import { IMailerService } from "../mailer.service";
import { Resend as ResendSender } from "resend";
import { injectable } from "inversify";
import { EmailMessage } from "@/value-objects/email-message.value-object";

@injectable()
export class ResendMailerService implements IMailerService {
    private sender!: ResendSender;

    constructor() {
        console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
        this.sender = new ResendSender(process.env.RESEND_API_KEY!);
    }

    async send(emailMessage: EmailMessage): Promise<void> {
        const { message } = emailMessage;

        const { error } = await this.sender.emails.send({
            from: message.from,
            to: message.to,
            subject: message.subject,
            html: message.content,
        });

        if (error) {
            console.log("ERRORORORORORO", error);
            throw error;
        }
    }
}
