import { businessError } from '@/lib-deprecated/errors';
import { Interface } from '../../contracts/vehicle-history-reports.data-provider'
import { injectable } from 'inversify';
import { ErrorFactory } from '@/value-objects/errors.value-object';

@injectable()
export class VehicleHistoryReports implements Interface {
    findOne: Interface['findOne'] = async ({ vin }) => {
        let urlRep = `${process.env.REPORTS_STABLE_ENDPOINT}/${vin}`
        try {
            // TODO - move cache logic into cache store
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
            throw ErrorFactory.forProvider('Vehicle history reports API store').inMethod('findOne').newError({
                error: 'Error on report obtaining',
                details: { ...response }
            })
        }

        const htmlMarkup = await response.text();

        // TODO - this logic must be saved in cache store, if report came from cache it's not encoded in base64
        const html = urlRep === `${process.env.REPORTS_STABLE_ENDPOINT}/${vin}` ? Buffer.from(htmlMarkup, "base64").toString("utf-8") : htmlMarkup;
        return { htmlMarkup: html }
    }

}

