import { injectable } from "inversify";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { Interface } from "../../contracts/pictures.data-provider";
import { v4 } from "uuid";

@injectable()
export class PicturesInPublicFolder implements Interface {
    private uploadDir = path.resolve(process.cwd(), "public", "uploads");
    private host = process.env.CURRENT_HOST || 'http://localhost:3000'
    add: Interface["add"] = async (file) => {
        try {
            const id = `${v4()}-${file.name}`;
            if (!existsSync(this.uploadDir)) {
                await mkdir(this.uploadDir, { recursive: true });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const filePath = path.join(this.uploadDir, id);
            await writeFile(filePath, buffer);

            return { id, success: true };
        } catch {
            return { id: null, success: false };
        }
    };
    findOne: Interface["findOne"] = async (id) => {
        return {
            id,
            src: this.host + '/uploads/' + id,
        };
    };
}
