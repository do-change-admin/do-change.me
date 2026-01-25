import { injectable } from 'inversify';
import type { CarStickerProvider } from './car-sticker.provider';

@injectable()
export class CarStickerAPIProvider implements CarStickerProvider {
    pdfBuffer: CarStickerProvider['pdfBuffer'] = async (vin) => {
        const url = `${process.env.STICKER_ENDPOINT}/${vin}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'API-KEY': process.env.REPORTS_STABLE_API_KEY || '',
                'API-SECRET': process.env.REPORTS_STABLE_API_SECRET || ''
            }
        });
        console.log(url);
        console.log(response);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const base64Pdf = await response.text();

        const pdfBuffer = Buffer.from(base64Pdf, 'base64');

        return pdfBuffer;
    };
}
