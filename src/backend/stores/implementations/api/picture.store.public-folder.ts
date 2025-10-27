import { injectable } from "inversify";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { Pictures } from "../../interfaces/picture.store.interface";
import { v4 } from "uuid";

@injectable()
export class PicturesInPublicFolder implements Pictures {
    private uploadDir = path.resolve(process.cwd(), "public", "uploads");

    public constructor(
        private readonly applicationURL = 'http://localhost:3000',
    ) { }

    add: Pictures["add"] = async (file) => {
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
    findOne: Pictures["findOne"] = async (id) => {
        return {
            id,
            src: this.applicationURL + "/uploads/" + id,
        };
    };
}
