import { Interface } from "../../contracts/email.functionality-provider";
import { VO } from "@/value-objects";
import { injectable } from "inversify";
import { Resend } from "resend";

const errorGenerator = VO.Errors.InProvider('email (resend)', 'backend functionality provider')

@injectable()
export class ResendEmail implements Interface {
    private sender!: Resend;

    constructor(apiKey: string) {
        this.sender = new Resend(apiKey);
    }

    send: Interface['send'] = async (payload) => {
        const getError = errorGenerator('send')

        try {
            const { error } = await this.sender.emails.send({
                from: payload.from,
                to: payload.to,
                subject: payload.subject,
                text: payload.content
            });
            if (error) {
                const errorToThrow = new Error(error.message)
                errorToThrow.name = error.name
                throw errorToThrow
            }
        }
        catch (error) {
            return {
                success: false,
                error: getError({
                    error,
                    code: 'third party service error',
                    side: 'module'
                })
            }
        }

        return {
            success: true,
            response: undefined
        }
    }
}
