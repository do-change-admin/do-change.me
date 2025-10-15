import { FunctionProviderTokens } from "@/di-containers/tokens.di-container";
import type { FunctionProviders } from "@/providers";
import { VO } from "@/value-objects";
import { inject, injectable } from "inversify";

const errorGenerator = VO.Errors.InService("email")

@injectable()
export class Instance {
    constructor(@inject(FunctionProviderTokens.email) private readonly mailProvider: FunctionProviders.Email.Interface) { }

    sendEmail = async (payload: VO.EmailMessage.Model): VO.Response.Service => {
        const getError = errorGenerator("sendEmail")

        try {
            VO.EmailMessage.schema.parse(payload)
        }
        catch (error) {
            return {
                success: false,
                error: getError({
                    side: 'client',
                    code: 'validation',
                    error
                })
            }
        }

        const sendResult = await this.mailProvider.send(payload);

        if (!sendResult.success) {
            return {
                success: false,
                error: getError({
                    code: 'third party service error',
                    error: new Error('Failed to send email'),
                    providerError: sendResult.error
                })
            }
        }

        return {
            success: true,
            response: undefined
        }
    };
}
