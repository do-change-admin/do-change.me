import type { EmailMessage } from '@/value-objects/email-message.value-object';

export interface MailerProvider {
    send(emailMessage: EmailMessage): Promise<void>;
}
