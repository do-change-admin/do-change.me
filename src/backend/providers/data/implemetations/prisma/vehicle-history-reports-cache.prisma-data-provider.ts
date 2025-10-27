import { prismaClient } from '@/backend/infrastructure'
import { CacheInterface } from '../../contracts/vehicle-history-reports.data-provider'

export class VehicleHistoryReportsCache implements CacheInterface {
    create: CacheInterface['create'] = async (vin, report) => {
        await prismaClient.carReport.create({
            data: {
                source: 'CARFAX',
                data: report,
                generatedAt: new Date(),
                type: 'html',
                vin
            }
        })
    };
    find: CacheInterface['find'] = async (vin) => {
        const data = await prismaClient.carReport.findFirst({
            where: {
                vin
            }
        })

        if (!data) {
            return null
        }

        return {
            cachedAt: data.generatedAt,
            report: data.data
        }
    };
};