import { injectable } from 'inversify';
import { Resend as ResendSender } from 'resend';
import type { EmailMessage } from '@/value-objects/email-message.value-object';
import type { MailerProvider } from '../mailer.provider';

@injectable()
export class ResendMailerProvider implements MailerProvider {
    private sender!: ResendSender;

    constructor() {
        this.sender = new ResendSender(process.env.RESEND_API_KEY!);
    }

    async send(emailMessage: EmailMessage): Promise<void> {
        const { message } = emailMessage;

        const { error } = await this.sender.emails.send({
            from: message.from,
            to: message.to,
            subject: message.subject,
            html: message.content
        });

        if (error) {
            throw error;
        }
    }
}
