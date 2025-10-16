import { DataProviders, DataProvidersImplemetations } from '@/providers'
import { Container } from 'inversify'
import { CarSaleUserServiceFactory, DataProviderTokens, ServiceTokens } from './tokens.di-container'
import { Services } from '@/services'

const container = new Container()

const registerDataProviders = () => {
    const carsForSaleInMemoryDataProvider = new DataProvidersImplemetations.InMemory.CarsForSale()

    container
        .bind<DataProviders.CarsForSale.Interface>(DataProviderTokens.carsForSale)
        .toConstantValue(carsForSaleInMemoryDataProvider)

    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(DataProviderTokens.vehicleHistoryReports)
        .to(DataProvidersImplemetations.API.VehicleHistoryReports)

    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(DataProviderTokens.vehicleHistoryReportsCache)
        .to(DataProvidersImplemetations.Prisma.VehicleHistoryReportsCache)

    container
        .bind<DataProviders.Pictures.Interface>(DataProviderTokens.pictures)
        .to(DataProvidersImplemetations.API.PicturesInVercelBlob)
}

const registerFunctionalProviders = () => {

}

const registerServices = () => {
    container.
        bind<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)
        .toFactory(ctx => {
            return (userId) => {
                const dataProvider = ctx.get<DataProviders.CarsForSale.Interface>(DataProviderTokens.carsForSale)
                const picturesDataProvider = ctx.get<DataProviders.Pictures.Interface>(DataProviderTokens.pictures)
                return new Services.CarSaleUser.Instance(
                    dataProvider,
                    picturesDataProvider,
                    userId
                )
            }
        })
    container
        .bind<Services.CarSaleAdmin.Instance>(ServiceTokens.carSaleAdmin)
        .to(Services.CarSaleAdmin.Instance)
}

registerDataProviders()
registerFunctionalProviders()
registerServices()

export { container as stageContainer }
