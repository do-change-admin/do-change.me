import { CarsForSaleDataProvider, CarsForSaleInMemoryDataProvider } from '@/providers'
import { Container } from 'inversify'
import { CarSaleUserServiceFactory, DataProviderTokens, FunctionalProviderTokens, ServicesTokens } from './tokens.di-container'
import { FileSystemProvider } from '@/providers/contracts'
import { PublicFolderFileSystemProvider } from '@/providers/implementations'
import { CarSaleAdminService, CarSaleUserService } from '@/services'

const container = new Container()

const registerDataProviders = () => {
    const carsForSaleInMemoryDataProvider = new CarsForSaleInMemoryDataProvider()

    container
        .bind<CarsForSaleDataProvider>(DataProviderTokens.carsForSale)
        .toConstantValue(carsForSaleInMemoryDataProvider)
}

const registerFunctionalProviders = () => {
    container
        .bind<FileSystemProvider>(FunctionalProviderTokens.fileSystem)
        .to(PublicFolderFileSystemProvider)
}

const registerServices = () => {
    container.
        bind<CarSaleUserServiceFactory>(ServicesTokens.carSaleUserFactory)
        .toFactory(ctx => {
            return (userId) => {
                const dataProvider = ctx.get<CarsForSaleDataProvider>(DataProviderTokens.carsForSale)
                const fileSystemProvider = ctx.get<FileSystemProvider>(FunctionalProviderTokens.fileSystem)
                return new CarSaleUserService(
                    dataProvider,
                    fileSystemProvider,
                    userId
                )
            }
        })
    container
        .bind<CarSaleAdminService>(ServicesTokens.carSaleAdmin)
        .to(CarSaleAdminService)
}

registerDataProviders()
registerFunctionalProviders()
registerServices()

export { container as testContainer }
