import { Container } from 'inversify';
import {
    type DataProviders,
    DataProvidersImplemetations,
    type FunctionProviders,
    FunctionProvidersImplementations
} from '@/backend/providers';
import { type ActiveUserInfoProvider, MockActiveUserInfoProvider } from '../providers/active-user-info';
import { CarStickerAPIProvider, type CarStickerProvider } from '../providers/car-sticker';
import { ConsoleMailerProvider } from '../providers/mailer/console-mailer/console-mailer.provider';
import type { IMailerProvider } from '../providers/mailer/mailer.provider';
import type { S3Client } from '../providers/s3-client/s3-client.provider';
import { S3ClientAWSSDK } from '../providers/s3-client/s3-client.provider.aws-sdk';
import { FeatureUsageRAMStore, type FeatureUsageStore } from '../stores/feature-usage';
import { NotificationRAMStore } from '../stores/notification/notification.ram.store';
import type { NotificationStore } from '../stores/notification/notification.store';
import type { RemotePicturesStore } from '../stores/remote-pictures/remote-pictures.store';
import { RemotePicturesS3ClientStore } from '../stores/remote-pictures/remote-pictures.store.s3-client';
import { UserRAMStore, type UserStore } from '../stores/user';
import { UserSyndicationRequestRAMStore, type UserSyndicationRequestStore } from '../stores/user-syndication-request';
import {
    UserSyndicationRequestDraftRAMStore,
    type UserSyndicationRequestDraftStore
} from '../stores/user-syndication-request-draft';
import { registerControllers } from './register-controllers';
import { registerServices } from './register-services';
import { DIProviders, DIStores } from './tokens.di-container';

const container = new Container();

const registerDataProviders = () => {
    container
        .bind<UserSyndicationRequestStore>(DIStores.syndicationRequests)
        .to(UserSyndicationRequestRAMStore)
        .inSingletonScope();
    container
        .bind<UserSyndicationRequestDraftStore>(DIStores.syndicationRequestDrafts)
        .to(UserSyndicationRequestDraftRAMStore)
        .inSingletonScope();
    container.bind<UserStore>(DIStores.users).to(UserRAMStore).inSingletonScope();
    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(DIStores.vehicleHistoryReports)
        .to(DataProvidersImplemetations.Mock.VehicleHistoryReports);
    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(DIStores.vehicleHistoryReportsCache)
        .to(DataProvidersImplemetations.InMemory.VehicleHistoryReportsCache)
        .inSingletonScope();
    container.bind<DataProviders.Pictures.Interface>(DIStores.pictures).to(DataProvidersImplemetations.Mock.Pictures);
    container
        .bind<DataProviders.Pictures.Interface>(DIStores.reserve_pictures)
        .to(DataProvidersImplemetations.Mock.Pictures);

    container.bind<NotificationStore>(DIStores.notifications).to(NotificationRAMStore).inSingletonScope();

    container.bind<RemotePicturesStore>(DIStores.remotePictures).to(RemotePicturesS3ClientStore);

    container.bind<NotificationStore>(DIStores.notifications).to(NotificationRAMStore).inSingletonScope();
    container.bind<FeatureUsageStore>(DIStores.featureUsage).to(FeatureUsageRAMStore);
};

const registerFunctionProviders = () => {
    container.bind<IMailerProvider>(DIProviders.mailer).to(ConsoleMailerProvider);

    container
        .bind<FunctionProviders.Logger.Interface>(DIProviders.logger)
        .to(FunctionProvidersImplementations.Mock.Logger);

    container.bind<S3Client>(DIProviders.s3Client).to(S3ClientAWSSDK);
    container.bind<ActiveUserInfoProvider>(DIProviders.activeUserInfo).to(MockActiveUserInfoProvider);
    container.bind<CarStickerProvider>(DIProviders.carSticker).to(CarStickerAPIProvider);
};

registerDataProviders();
registerFunctionProviders();
registerServices(container);
registerControllers(container);

export { container as testContainer };
