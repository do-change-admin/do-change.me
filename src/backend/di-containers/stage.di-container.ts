import { DataProviders, DataProvidersImplemetations, FunctionProviders, FunctionProvidersImplementations } from '@/backend/providers'
import { Container } from 'inversify'
import { StoreTokens, ProviderTokens } from './tokens.di-container'
import { registerServices } from './register-services'
import { registerControllers } from './register-controllers'
import { NotificationStore } from '../stores/notification/notification.store'
import { NotificationInMemoryStore } from '../stores/notification/notification.in-memory-store'

const container = new Container()

const registerDataProviders = () => {
    container
        .bind<DataProviders.SyndicationRequests.Interface>(StoreTokens.syndicationRequests)
        .to(DataProvidersImplemetations.Prisma.SyndicationRequests)
    container
        .bind<DataProviders.SyndicationRequestDrafts.Interface>(StoreTokens.syndicationRequestDrafts)
        .to(DataProvidersImplemetations.Prisma.SyndicationRequestDrafts)
    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(StoreTokens.vehicleHistoryReports)
        .to(DataProvidersImplemetations.API.VehicleHistoryReports)
    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(StoreTokens.vehicleHistoryReportsCache)
        .to(DataProvidersImplemetations.Prisma.VehicleHistoryReportsCache)
    container
        .bind<DataProviders.Pictures.Interface>(StoreTokens.pictures)
        .to(DataProvidersImplemetations.API.PicturesInVercelBlob)
    container
        .bind<NotificationStore>(StoreTokens.notifications)
        .to(NotificationInMemoryStore).inSingletonScope()
}

const registerFunctionProviders = () => {
    container
        .bind<FunctionProviders.Email.Interface>(ProviderTokens.email)
        .to(FunctionProvidersImplementations.Mock.Email)

    container
        .bind<FunctionProviders.Logger.Interface>(ProviderTokens.logger)
        .to(FunctionProvidersImplementations.Mock.Logger)

}


registerDataProviders()
registerFunctionProviders()
registerServices(container)
registerControllers(container)


export { container as stageContainer }
