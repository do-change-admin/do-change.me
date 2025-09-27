import { FileSystemProvider } from "@/providers/contracts";
import { put, getDownloadUrl, head } from '@vercel/blob'

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
        return (await head(id)).downloadUrl || (await head(id)).url
    }

}