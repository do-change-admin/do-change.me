import { businessError } from '@/lib-deprecated/errors';
import { Interface } from '../../contracts/vehicle-history-reports.data-provider'
import { injectable } from 'inversify';

@injectable()
export class VehicleHistoryReports implements Interface {
    findOne: Interface['findOne'] = async ({ vin }) => {
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

        return { htmlMarkup }

    }

}