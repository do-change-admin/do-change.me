import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export async function downloadAllImages(photoLinks: string[]) {
    const zip = new JSZip();
    const folder = zip.folder('photos')!;

    for (let i = 0; i < photoLinks.length; i++) {
        const url = photoLinks[i];
        const response = await fetch(url);
        const blob = await response.blob();
        folder.file(`photo_${i + 1}.jpg`, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'photos.zip');
}
