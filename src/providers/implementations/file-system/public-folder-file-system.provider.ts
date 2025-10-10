import { ProvidesFileLink, ProvidesFileUploading } from '../../contracts'
import { access, mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export class PublicFolderFileSystemProvider implements ProvidesFileLink, ProvidesFileUploading {
    private uploadDir = path.resolve(process.cwd(), 'public', 'uploads');

    async upload(file: File, id: string, originalFileName: string): Promise<{ success: boolean }> {
        try {
            if (!existsSync(this.uploadDir)) {
                await mkdir(this.uploadDir, { recursive: true });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const filePath = path.join(this.uploadDir, id);
            await writeFile(filePath, buffer);

            return { success: true };

        }
        catch (e) {
            return { success: false }
        }
    }

    async obtainDownloadLink(id: string): Promise<string | null> {
        const filePath = path.join(this.uploadDir, id);

        try {
            await access(filePath);
            return 'http://localhost:3000/uploads/' + id;
        } catch (err) {
            return null;
        }
    }

}


