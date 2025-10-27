import { DataProviders, DataProvidersImplemetations, FunctionProviders, FunctionProvidersImplementations } from '@/backend/providers'
import { Container } from 'inversify'
import { StoreTokens, ProviderTokens } from './tokens.di-container'
import { registerServices } from './register-services'
import { registerControllers } from './register-controllers'
import { Notifications } from '../stores/interfaces/notification.store.interface'
import { NotificationsFromRAM } from '../stores/implementations/ram/notification.store.ram'

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
    container.bind<Notifications>(StoreTokens.notifications).to(NotificationsFromRAM).inSingletonScope()
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
