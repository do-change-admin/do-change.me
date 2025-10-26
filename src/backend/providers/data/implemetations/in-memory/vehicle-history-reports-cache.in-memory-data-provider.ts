import { prismaClient } from '@/backend/infrastructure'
import { CacheInterface } from '../../contracts/vehicle-history-reports.data-provider'

export class VehicleHistoryReportsCache implements CacheInterface {
    private readonly data: { generatedAt: Date, vin: string, report: string }[] = []
    create: CacheInterface['create'] = async (vin, report) => {
        this.data.push({
            generatedAt: new Date(),
            report,
            vin
        })
    };
    find: CacheInterface['find'] = async (vin) => {
        const report = this.data.find(x => x.vin === vin)
        if (!report) {
            return null
        }
        return {
            cachedAt: report.generatedAt,
            report: report.report
        }
    };
};