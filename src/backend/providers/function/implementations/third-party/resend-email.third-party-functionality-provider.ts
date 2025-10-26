import { Interface } from "../../contracts/email.functionality-provider";
import { VO } from "@/value-objects";
import { injectable } from "inversify";
import { Resend } from "resend";


@injectable()
export class ResendEmail implements Interface {
    private sender!: Resend;

    constructor(apiKey: string) {
        this.sender = new Resend(apiKey);
    }

    send: Interface['send'] = async (payload) => {
        const { error } = await this.sender.emails.send({
            from: payload.from,
            to: payload.to,
            subject: payload.subject,
            text: payload.content
        });

        if (error) {
            throw error
        }
    }
}
