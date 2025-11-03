import { Container } from 'inversify';
import {
    type DataProviders,
    DataProvidersImplemetations,
    type FunctionProviders,
    FunctionProvidersImplementations
} from '@/backend/providers';
import type { S3Client } from '../providers/s3-client/s3-client.provider';
import { S3ClientAWSSDK } from '../providers/s3-client/s3-client.provider.aws-sdk';
import { NotificationRAMStore } from '../stores/notification/notification.ram.store';
import type { NotificationStore } from '../stores/notification/notification.store';
import type { RemotePicturesStore } from '../stores/remote-pictures/remote-pictures.store';
import { RemotePicturesS3ClientStore } from '../stores/remote-pictures/remote-pictures.store.s3-client';
import { registerControllers } from './register-controllers';
import { registerServices } from './register-services';
import { DIProviders, DIStores } from './tokens.di-container';

const container = new Container();

const registerDataProviders = () => {
    container
        .bind<DataProviders.SyndicationRequests.Interface>(DIStores.syndicationRequests)
        .to(DataProvidersImplemetations.InMemory.SyndicationRequests)
        .inSingletonScope();
    container
        .bind<DataProviders.SyndicationRequestDrafts.Interface>(DIStores.syndicationRequestDrafts)
        .to(DataProvidersImplemetations.InMemory.SyndicationRequestDrafts)
        .inSingletonScope();
    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(DIStores.vehicleHistoryReports)
        .to(DataProvidersImplemetations.Mock.VehicleHistoryReports);
    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(DIStores.vehicleHistoryReportsCache)
        .to(DataProvidersImplemetations.InMemory.VehicleHistoryReportsCache)
        .inSingletonScope();
    container.bind<DataProviders.Pictures.Interface>(DIStores.pictures).to(DataProvidersImplemetations.Mock.Pictures);
    container.bind<DataProviders.Pictures.Interface>(DIStores.reserve_pictures).to(DataProvidersImplemetations.Mock.Pictures);

    container.bind<NotificationStore>(DIStores.notifications).to(NotificationRAMStore).inSingletonScope();

    container.bind<RemotePicturesStore>(DIStores.remotePictures).to(RemotePicturesS3ClientStore);

    container.bind<NotificationStore>(DIStores.notifications).to(NotificationRAMStore).inSingletonScope();
};

const registerFunctionProviders = () => {
    container.bind<FunctionProviders.Email.Interface>(DIProviders.email).to(FunctionProvidersImplementations.Mock.Email);

    container.bind<FunctionProviders.Logger.Interface>(DIProviders.logger).to(FunctionProvidersImplementations.Mock.Logger);

    container.bind<S3Client>(DIProviders.s3Client).to(S3ClientAWSSDK);
};

registerDataProviders();
registerFunctionProviders();
registerServices(container);
registerControllers(container);

export { container as testContainer };
