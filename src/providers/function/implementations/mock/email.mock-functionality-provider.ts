import { Interface } from "../../contracts/email.functionality-provider";
import { injectable } from "inversify";

@injectable()
export class Email implements Interface {
    send: Interface['send'] = async (email) => {
        console.log(email, 'succesfully sent email')

    }

}