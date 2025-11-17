import { businessError } from '@/lib-deprecated/errors';
import { Interface } from '../../contracts/vehicle-history-reports.data-provider'
import { injectable } from 'inversify';

@injectable()
export class VehicleHistoryReports implements Interface {
    findOne: Interface['findOne'] = async ({ vin }) => {
        try {
            const url = `${process.env.REPORT_ENDPOINT}/vhr/${vin}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "X-API-Key": process.env.REPORT_KEY!,
                },
            });

            if (!response.ok) {
                throw businessError('Error on report obtaining')
            }

            const htmlMarkup = await response.text();

            return { htmlMarkup, source: 'first' }
        } catch (e) {
            let urlRep = `${process.env.REPORTS_STABLE_ENDPOINT}/${vin}`
            try {
                const url = `${process.env.REPORTS_STABLE_CACHE_ENDPOINT}/${vin}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "API-KEY": process.env.REPORTS_STABLE_API_KEY || '',
                        "API-SECRET": process.env.REPORTS_STABLE_API_SECRET || '',
                    },
                });
                const [cache] = await response.json()
                if (!cache || !cache.carfax) {
                    throw ''
                }
                urlRep = cache.carfax
            } catch { }
            const response = await fetch(urlRep, {
                method: "GET",
                headers: {
                    "API-KEY": process.env.REPORTS_STABLE_API_KEY || '',
                    "API-SECRET": process.env.REPORTS_STABLE_API_SECRET || '',
                },
            });

            if (!response.ok) {
                throw businessError('Error on report obtaining')
            }

            const htmlMarkup = await response.text();

            const html = urlRep === `${process.env.REPORTS_STABLE_ENDPOINT}/${vin}` ? Buffer.from(htmlMarkup, "base64").toString("utf-8") : htmlMarkup;
            return { htmlMarkup: html, source: 'stable' }

        }

    }

}

