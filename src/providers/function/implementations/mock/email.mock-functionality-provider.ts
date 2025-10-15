import { ValueObjects } from "@/value-objects";
import { Interface } from "../../contracts/email.functionality-provider";
import { injectable } from "inversify";

const errorGenerator = ValueObjects.Errors.InProvider('email (mock)', 'backend functionality provider')

@injectable()
export class Email implements Interface {
    send: Interface['send'] = async (email) => {
        const getError = errorGenerator('send')
        try {
            ValueObjects.EmailMessage.schema.parse(email)
        }
        catch (error) {
            return {
                error: getError({
                    code: 'validation',
                    error,
                    side: 'client'
                }),
                success: false
            }
        }
        console.log(email, 'succesfully sent email')
        return {
            success: true,
            response: undefined
        }
    }

}