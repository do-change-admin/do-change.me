import { DataProviders, DataProvidersImplemetations, FunctionProviders, FunctionProvidersImplementations } from '@/backend/providers'
import { Container } from 'inversify'
import { DIStores, DIProviders } from './tokens.di-container'
import { registerServices } from './register-services'
import { registerControllers } from './register-controllers'
import { NotificationStore } from '../stores/interfaces/notification.store'
import { NotificationInMemoryStore } from '../stores/implementations/in-memory/notification.in-memory-store'
import { PicturesS3DataProvider } from '../providers/data/implemetations/api/pictures.s3-data-provider'
import { RemotePicturesStore } from '../stores/remote-pictures/remote-pictures.store'
import { RemotePicturesS3ClientStore } from '../stores/remote-pictures/remote-pictures.store.s3-client'
import { S3Client } from '../providers/s3-client/s3-client.provider'
import { S3ClientAWSSDK } from '../providers/s3-client/s3-client.provider.aws-sdk'

const container = new Container()

const registerDataProviders = () => {
    container
        .bind<DataProviders.SyndicationRequests.Interface>(DIStores.syndicationRequests)
        .to(DataProvidersImplemetations.Prisma.SyndicationRequests)
    container
        .bind<DataProviders.SyndicationRequestDrafts.Interface>(DIStores.syndicationRequestDrafts)
        .to(DataProvidersImplemetations.Prisma.SyndicationRequestDrafts)
    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(DIStores.vehicleHistoryReports)
        .to(DataProvidersImplemetations.API.VehicleHistoryReports)
    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(DIStores.vehicleHistoryReportsCache)
        .to(DataProvidersImplemetations.Prisma.VehicleHistoryReportsCache)
    container
        .bind<DataProviders.Pictures.Interface>(DIStores.pictures)
        .to(DataProvidersImplemetations.API.PicturesInVercelBlob)
    container
        .bind<NotificationStore>(DIStores.notifications)
        .to(NotificationInMemoryStore).inSingletonScope()
    container
        .bind<DataProviders.Pictures.Interface>(DIStores.reserve_pictures)
        .to(PicturesS3DataProvider)

    container.bind<RemotePicturesStore>(DIStores.remotePictures)
        .to(RemotePicturesS3ClientStore)
    
}

const registerFunctionProviders = () => {
    container
        .bind<FunctionProviders.Email.Interface>(DIProviders.email)
        .to(FunctionProvidersImplementations.Mock.Email)

    container
        .bind<FunctionProviders.Logger.Interface>(DIProviders.logger)
        .to(FunctionProvidersImplementations.Mock.Logger)

    container
        .bind<S3Client>(DIProviders.s3Client)
        .to(S3ClientAWSSDK)
}


registerDataProviders()
registerFunctionProviders()
registerServices(container)
registerControllers(container)


export { container as stageContainer }
