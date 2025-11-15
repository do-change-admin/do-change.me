import { EmailAddress } from "./email-address.value-object";
import z from "zod";

export class EmailMessage {
    static emailMessageSchema = z.object({
        from: EmailAddress.emailAddressschema,
        to: EmailAddress.emailAddressschema,
        subject: z.string().min(1, "Subject is required"),
        content: z.string().min(1, "Content is required"),
    });

    private constructor(private readonly emailMessage: EmailMessageSchema) {}

    /**
     * Unsafe.
     */
    static create(data: EmailMessageSchema): EmailMessage {
        return new EmailMessage(EmailMessage.emailMessageSchema.parse(data));
    }

    get message(): EmailMessageSchema {
        return {
            content: this.emailMessage.content,
            from: this.emailMessage.from,
            subject: this.emailMessage.subject,
            to: this.emailMessage.to,
        };
    }
}

export type EmailMessageSchema = z.infer<
    typeof EmailMessage.emailMessageSchema
>;
