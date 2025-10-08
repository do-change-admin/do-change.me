import { v4 } from 'uuid'
import type { Interface } from '../../contracts/pictures.data-provider'
import { faker } from '@faker-js/faker'
import { injectable } from 'inversify'

@injectable()
export class Pictures implements Interface {
    add: Interface['add'] = async () => {
        return { id: v4(), success: true }
    }
    findOne: Interface['findOne'] = async (id) => {
        return {
            id,
            src: faker.image.urlPicsumPhotos(),
        }
    }
}