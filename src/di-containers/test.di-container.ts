import { DataProviders } from '@/providers'
import { Container } from 'inversify'
import { CarSaleUserServiceFactory, DataProviderTokens, FunctionalProviderTokens, ServiceTokens } from './tokens.di-container'
import { FileSystemProvider } from '@/providers/contracts'
import { PublicFolderFileSystemProvider } from '@/providers/implementations'
import { Services } from '@/services'

const container = new Container()

const registerDataProviders = () => {
    const carsForSaleInMemoryDataProvider = new DataProviders.Implementations.InMemory.CarsForSale()

    container
        .bind<DataProviders.CarsForSale.Interface>(DataProviderTokens.carsForSale)
        .toConstantValue(carsForSaleInMemoryDataProvider)
}

const registerFunctionalProviders = () => {
    container
        .bind<FileSystemProvider>(FunctionalProviderTokens.fileSystem)
        .to(PublicFolderFileSystemProvider)
}

const registerServices = () => {
    container.
        bind<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)
        .toFactory(ctx => {
            return (userId) => {
                const dataProvider = ctx.get<DataProviders.CarsForSale.Interface>(DataProviderTokens.carsForSale)
                const fileSystemProvider = ctx.get<FileSystemProvider>(FunctionalProviderTokens.fileSystem)
                return new Services.CarSaleUser.Instance(
                    dataProvider,
                    fileSystemProvider,
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

export { container as testContainer }
