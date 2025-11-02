import { injectable } from "inversify";
import { Interface } from '../../contracts/logger.functionality-provider'

@injectable()
export class Logger implements Interface {
    error: Interface['error'] = async (error) => {
        console.error('ERROR FROM LOGGER')
        console.error('-------------------------------')
        console.error(error)
        console.error('-------------------------------')
    };

}