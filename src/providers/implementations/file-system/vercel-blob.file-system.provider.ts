import { type FileSystemProvider } from "@/providers/contracts";
import { put, head } from '@vercel/blob'
import { injectable } from "inversify";

@injectable()
export class VercelBlobFileSystemProvider implements FileSystemProvider {
    async upload(file: File, id: string, originalFileName: string): Promise<{ success: boolean; }> {
        try {
            await put(id, file, { access: 'public' })
            return { success: true }
        }
        catch {
            return { success: false }
        }
    }
    async obtainDownloadLink(id: string): Promise<string | null> {
        return (await head(id)).url || (await head(id)).downloadUrl
    }

}