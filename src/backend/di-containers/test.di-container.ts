import { DataProviders, DataProvidersImplemetations, FunctionProviders, FunctionProvidersImplementations } from '@/backend/providers'
import { Container } from 'inversify'
import { DataProviderTokens, FunctionProviderTokens } from './tokens.di-container'
import { registerServices } from './register-services'
import { registerControllers } from './register-controllers'

const container = new Container()

const registerDataProviders = () => {
    const syndicationRequests = new DataProvidersImplemetations.InMemory.SyndicationRequests()
    const syndicationRequestDrafts = new DataProvidersImplemetations.InMemory.SyndicationRequestDrafts()

    container
        .bind<DataProviders.SyndicationRequests.Interface>(DataProviderTokens.syndicationRequests)
        .toConstantValue(syndicationRequests)

    container
        .bind<DataProviders.SyndicationRequestDrafts.Interface>(DataProviderTokens.syndicationRequestDrafts)
        .toConstantValue(syndicationRequestDrafts)
    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(DataProviderTokens.vehicleHistoryReports)
        .to(DataProvidersImplemetations.Mock.VehicleHistoryReports)

    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(DataProviderTokens.vehicleHistoryReportsCache)
        .to(DataProvidersImplemetations.InMemory.VehicleHistoryReportsCache)

    container
        .bind<DataProviders.Pictures.Interface>(DataProviderTokens.pictures)
        .to(DataProvidersImplemetations.Mock.Pictures)
}

const registerFunctionProviders = () => {
    container
        .bind<FunctionProviders.Email.Interface>(FunctionProviderTokens.email)
        .to(FunctionProvidersImplementations.Mock.Email)

    container
        .bind<FunctionProviders.Logger.Interface>(FunctionProviderTokens.logger)
        .to(FunctionProvidersImplementations.Mock.Logger)

}

registerDataProviders()
registerFunctionProviders()
registerServices(container)
registerControllers(container)

export { container as testContainer }
