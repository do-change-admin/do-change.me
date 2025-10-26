import { injectable } from 'inversify'
import { Interface } from '../../contracts/syndication-request-drafts.data-provider'
import { generateInMemoryCRUDProvider } from '../../shared/in-memory.data-provider'

const CRUD = generateInMemoryCRUDProvider<
    Interface
>()

@injectable()
export class SyndicationRequestDrafts extends CRUD implements Interface {
    filtersData: Interface['filtersData'] = async (userId) => {
        const data = this.data.filter(x => x.userId === userId)
        const models = data.map(x => x.model).filter(x => typeof x === 'string')
        const makes = data.map(x => x.make).filter(x => typeof x === 'string')

        return {
            models: [...new Set(models)],
            makes: [...new Set(makes)]
        }
    }
}
