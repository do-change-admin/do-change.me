import { DataProviders, DataProvidersImplemetations, FunctionalityProviders, FunctionalityProvidersImplementations } from '@/providers'
import { Container } from 'inversify'
import { DataProviderTokens, FunctionalProviderTokens } from './tokens.di-container'
import { registerServices } from './register-services'

const container = new Container()

const registerDataProviders = () => {
    const carsForSaleInMemoryDataProvider = new DataProvidersImplemetations.InMemory.CarsForSale()

    container
        .bind<DataProviders.CarsForSale.Interface>(DataProviderTokens.carsForSale)
        .toConstantValue(carsForSaleInMemoryDataProvider)

    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(DataProviderTokens.vehicleHistoryReports)
        .to(DataProvidersImplemetations.Mock.VehicleHistoryReports)

    container
        .bind<DataProviders.Pictures.Interface>(DataProviderTokens.pictures)
        .to(DataProvidersImplemetations.API.PicturesInPublicFolder)
}

const registerFunctionalProviders = () => {
    container
        .bind<FunctionalityProviders.Email.Interface>(FunctionalProviderTokens.email)
        .to(FunctionalityProvidersImplementations.Mock.Email)
}

registerDataProviders()
registerFunctionalProviders()
registerServices(container)

export { container as devContainer }
