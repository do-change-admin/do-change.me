import { saveAs } from 'file-saver';
import JSZip from 'jszip';

async function addWhiteBackgroundToImage(
    blob: Blob,
    outputType: 'image/jpeg' | 'image/png' = 'image/jpeg'
): Promise<Blob> {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const url = URL.createObjectURL(blob);
    img.src = url;

    await new Promise<void>((resolve) => {
        img.onload = () => resolve();
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    // 1️⃣ Белый фон
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2️⃣ PNG поверх
    ctx.drawImage(img, 0, 0);

    URL.revokeObjectURL(url);

    // 3️⃣ Экспорт
    return new Promise<Blob>((resolve) => {
        canvas.toBlob((result) => resolve(result!), outputType, 0.95);
    });
}

export async function downloadAllImages(photoLinks: string[], fileNames?: string[]) {
    const zip = new JSZip();
    const folder = zip.folder('photos')!;

    for (let i = 0; i < photoLinks.length; i++) {
        const response = await fetch(photoLinks[i], { cache: 'no-store' });
        const blob = await response.blob();

        // 🔥 добавляем белый фон
        const processedBlob = await addWhiteBackgroundToImage(
            blob,
            'image/jpeg' // ← можно 'image/png'
        );

        const name = (fileNames?.[i] ?? `photo_${i + 1}`) + '.jpg';

        folder.file(name, processedBlob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'photos.zip');
}
