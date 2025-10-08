import { DataProviders } from '@/providers'
import { Container } from 'inversify'
import { CarSaleUserServiceFactory, DataProviderTokens, FunctionalProviderTokens, ServiceTokens } from './tokens.di-container'
import { FileSystemProvider } from '@/providers/contracts'
import { Services } from '@/services'
import { VercelBlobFileSystemProvider } from '@/providers/implementations'

const container = new Container()

const registerDataProviders = () => {
    const carsForSaleInMemoryDataProvider = new DataProviders.Implementations.InMemory.CarsForSale()

    container
        .bind<DataProviders.CarsForSale.Interface>(DataProviderTokens.carsForSale)
        .toConstantValue(carsForSaleInMemoryDataProvider)

    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(DataProviderTokens.vehicleHistoryReports)
        .to(DataProviders.Implementations.Mock.VehicleHistoryReports)

    container
        .bind<DataProviders.Pictures.Interface>(DataProviderTokens.pictures)
        .to(DataProviders.Implementations.API.PicturesInVercelBlob)
}

const registerFunctionalProviders = () => {
    container
        .bind<FileSystemProvider>(FunctionalProviderTokens.fileSystem)
        .to(VercelBlobFileSystemProvider)
}

const registerServices = () => {
    container.
        bind<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)
        .toFactory(ctx => {
            return (userId) => {
                const dataProvider = ctx.get<DataProviders.CarsForSale.Interface>(DataProviderTokens.carsForSale)
                const picturesDataProvider = ctx.get<DataProviders.Pictures.Interface>(FunctionalProviderTokens.fileSystem)
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
