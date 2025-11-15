import type { Interface, Item } from "../../contracts/pictures.data-provider";
import { PicturesInPublicFolder } from "./pictures.public-folder-data-provider";
import { PicturesInVercelBlob } from "./pictures.vercel-blob-data-provider";


export class PictureCombinedDataProvider implements Interface {
    private readonly publicFolder = new PicturesInPublicFolder()
    private readonly vercelBlob = new PicturesInVercelBlob()

    add: Interface['add'] = async (file) => {
        const vercelBlobAdding = await this.vercelBlob.add(file)
        if (vercelBlobAdding.success) {
            return vercelBlobAdding
        }

        return await this.publicFolder.add(file)
    };

    findOne: Interface['findOne'] = async (id) => {
        try {
            return await this.vercelBlob.findOne(id)
        } catch {
            return await this.publicFolder.findOne(id)
        }
    };
}