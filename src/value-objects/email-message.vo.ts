import { EmailAddress } from "./email-address.vo";

export class EmailMessage {
    private constructor(
        public readonly from: EmailAddress,
        public readonly to: EmailAddress,
        public readonly subject: string,
        public readonly html: string
    ) { }

    /**
     * Unsafe.
     */
    static create(data: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }): EmailMessage {
        try {
            const from = EmailAddress.create(data.from)
            const to = EmailAddress.create(data.to)
            return new EmailMessage(from, to, data.subject, data.html);
        } catch (e) {
            throw new Error('Error on creating email message ' + (e as Error).message)
        }
    }
}
