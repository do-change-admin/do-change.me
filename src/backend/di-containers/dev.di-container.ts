import { Container } from 'inversify';
import {
    type DataProviders,
    DataProvidersImplemetations,
    type FunctionProviders,
    FunctionProvidersImplementations
} from '@/backend/providers';
import { type ActiveUserInfoProvider, NextAuthActiveUserInfoProvider } from '../providers/active-user-info';
import { PicturesS3DataProvider } from '../providers/data/implemetations/api/pictures.s3-data-provider';
import type { IMailerProvider } from '../providers/mailer/mailer.provider';
import { ResendMailerProvider } from '../providers/mailer/resend-mailer/resend-mailer.provider';
import type { S3Client } from '../providers/s3-client/s3-client.provider';
import { S3ClientAWSSDK } from '../providers/s3-client/s3-client.provider.aws-sdk';
import { FeatureUsagePrismaStore, type FeatureUsageStore } from '../stores/feature-usage';
import { NotificationPrismaStore } from '../stores/notification/notification.prisma.store';
import type { NotificationStore } from '../stores/notification/notification.store';
import type { RemotePicturesStore } from '../stores/remote-pictures/remote-pictures.store';
import { RemotePicturesS3ClientStore } from '../stores/remote-pictures/remote-pictures.store.s3-client';
import { UserPrismaStore, type UserStore } from '../stores/user';
import {
    UserSyndicationRequestPrismaStore,
    type UserSyndicationRequestStore
} from '../stores/user-syndication-request';
import {
    UserSyndicationRequestDraftPrismaStore,
    type UserSyndicationRequestDraftStore
} from '../stores/user-syndication-request-draft';
import { registerControllers } from './register-controllers';
import { registerServices } from './register-services';
import { DIProviders, DIStores } from './tokens.di-container';

const container = new Container();

const registerDataProviders = () => {
    container.bind<UserSyndicationRequestStore>(DIStores.syndicationRequests).to(UserSyndicationRequestPrismaStore);
    container
        .bind<UserSyndicationRequestDraftStore>(DIStores.syndicationRequestDrafts)
        .to(UserSyndicationRequestDraftPrismaStore);
    container.bind<UserStore>(DIStores.users).to(UserPrismaStore);
    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(DIStores.vehicleHistoryReports)
        .to(DataProvidersImplemetations.Mock.VehicleHistoryReports);
    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(DIStores.vehicleHistoryReportsCache)
        .to(DataProvidersImplemetations.InMemory.VehicleHistoryReportsCache);
    container
        .bind<DataProviders.Pictures.Interface>(DIStores.pictures)
        .to(DataProvidersImplemetations.API.PicturesInPublicFolder);
    container.bind<NotificationStore>(DIStores.notifications).to(NotificationPrismaStore).inSingletonScope();
    container.bind<DataProviders.Pictures.Interface>(DIStores.reserve_pictures).to(PicturesS3DataProvider);

    container.bind<RemotePicturesStore>(DIStores.remotePictures).to(RemotePicturesS3ClientStore);
    container.bind<FeatureUsageStore>(DIStores.featureUsage).to(FeatureUsagePrismaStore);
};

const registerFunctionProviders = () => {
    container.bind<IMailerProvider>(DIProviders.mailer).to(ResendMailerProvider);

    container
        .bind<FunctionProviders.Logger.Interface>(DIProviders.logger)
        .to(FunctionProvidersImplementations.Mock.Logger);

    container.bind<S3Client>(DIProviders.s3Client).to(S3ClientAWSSDK);
    container.bind<ActiveUserInfoProvider>(DIProviders.activeUserInfo).to(NextAuthActiveUserInfoProvider);
};

registerDataProviders();
registerFunctionProviders();
registerServices(container);
registerControllers(container);

export { container as devContainer };
