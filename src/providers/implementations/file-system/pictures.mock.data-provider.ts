import { FileSystemProvider } from "@/providers/contracts";
import { faker } from "@faker-js/faker";

export class MockPicturesProvider implements FileSystemProvider {
    upload = async (file: File, id: string, originalFileName: string): Promise<{ success: boolean; }> => {
        return { success: true }
    }
    obtainDownloadLink = async (id: string): Promise<string | null> => {
        return faker.image.urlPicsumPhotos()
    }

}