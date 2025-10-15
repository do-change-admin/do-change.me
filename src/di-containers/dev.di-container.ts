import { DataProviders, DataProvidersImplemetations, FunctionProviders, FunctionProvidersImplementations } from '@/providers'
import { Container } from 'inversify'
import { DataProviderTokens, FunctionProviderTokens } from './tokens.di-container'
import { registerServices } from './register-services'
import { registerControllers } from './register-controllers'

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

const registerFunctionProviders = () => {
    container
        .bind<FunctionProviders.Email.Interface>(FunctionProviderTokens.email)
        .to(FunctionProvidersImplementations.Mock.Email)
}

registerDataProviders()
registerFunctionProviders()
registerServices(container)
registerControllers(container)

export { container as devContainer }
