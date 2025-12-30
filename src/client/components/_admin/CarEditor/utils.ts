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

    const { width, height } = canvas;

    /* 1️⃣ Белый фон */
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    /* 2️⃣ Рисуем исходное изображение */
    ctx.drawImage(img, 0, 0, width, height);

    /* 3️⃣ Затемнение снизу (1/3 высоты) */
    const darkGradient = ctx.createLinearGradient(
        0,
        height * 0.65,
        0,
        height
    );
    darkGradient.addColorStop(0, 'rgba(0,0,0,0)');
    darkGradient.addColorStop(1, 'rgba(0,0,0,0.25)');

    ctx.fillStyle = darkGradient;
    ctx.fillRect(0, height * 0.65, width, height * 0.35);

    /* 4️⃣ Глянцевый блик сверху */
    const glossGradient = ctx.createLinearGradient(0, 0, 0, height * 0.4);
    glossGradient.addColorStop(0, 'rgba(255,255,255,0.45)');
    glossGradient.addColorStop(0.4, 'rgba(255,255,255,0.15)');
    glossGradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = glossGradient;
    ctx.fillRect(0, 0, width, height * 0.4);

    URL.revokeObjectURL(url);

    /* 5️⃣ Экспорт */
    return new Promise<Blob>((resolve) => {
        canvas.toBlob((result) => resolve(result!), outputType, 0.95);
    });
}


function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


export async function downloadAllImages(
    photoLinks: string[],
    fileNames?: string[]
) {
    for (let i = 0; i < photoLinks.length; i++) {
        const response = await fetch(photoLinks[i], { cache: 'no-store' });
        const blob = await response.blob();

        // добавляем белый фон
        const processedBlob = await addWhiteBackgroundToImage(
            blob,
            'image/jpeg'
        );

        const name = (fileNames?.[i+1] ?? `photo_${i + 1}`) + '.jpg';

        downloadBlob(processedBlob, name);

        // ⚠️ важно: небольшая задержка
        await delay(400);
    }
}