import { v4 } from 'uuid';
import type { Interface } from '../../contracts/pictures.data-provider'
import { put, head } from '@vercel/blob'
import { injectable } from "inversify";

@injectable()
export class PicturesInVercelBlob implements Interface {
    add: Interface['add'] = async (file) => {
        const id = v4()
        try {
            await put(id, file, { access: 'public' })
            return { id, success: true }
        }
        catch {
            return { id: null, success: false }
        }
    };

    findOne: Interface['findOne'] = async (id) => {
        try {
            const url = (await head(id)).url

            return {
                id,
                src: url
            }

        } catch {
            return {
                id,
                src: 'https://do-change.com/'
            }
        }
    };
}