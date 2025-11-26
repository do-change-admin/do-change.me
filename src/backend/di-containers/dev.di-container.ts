import { Container } from 'inversify';
import {
    type DataProviders,
    DataProvidersImplemetations,
    type FunctionProviders,
    FunctionProvidersImplementations
} from '@/backend/providers';
import { NotificationPrismaStore } from '../stores/notification/notification.prisma.store';
import type { NotificationStore } from '../stores/notification/notification.store';
import { registerControllers } from './register-controllers';
import { registerServices } from './register-services';
import { ProviderTokens, StoreTokens } from './tokens.di-container';

const container = new Container();

const registerDataProviders = () => {
    container
        .bind<DataProviders.SyndicationRequests.Interface>(StoreTokens.syndicationRequests)
        .to(DataProvidersImplemetations.Prisma.SyndicationRequests);
    container
        .bind<DataProviders.SyndicationRequestDrafts.Interface>(StoreTokens.syndicationRequestDrafts)
        .to(DataProvidersImplemetations.Prisma.SyndicationRequestDrafts);
    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(StoreTokens.vehicleHistoryReports)
        .to(DataProvidersImplemetations.Mock.VehicleHistoryReports);
    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(StoreTokens.vehicleHistoryReportsCache)
        .to(DataProvidersImplemetations.InMemory.VehicleHistoryReportsCache);
    container.bind<DataProviders.Pictures.Interface>(StoreTokens.pictures).to(DataProvidersImplemetations.API.PicturesInPublicFolder);
    container.bind<NotificationStore>(StoreTokens.notifications).to(NotificationPrismaStore);
};

const registerFunctionProviders = () => {
    container.bind<FunctionProviders.Email.Interface>(ProviderTokens.email).to(FunctionProvidersImplementations.Mock.Email);

    container.bind<FunctionProviders.Logger.Interface>(ProviderTokens.logger).to(FunctionProvidersImplementations.Mock.Logger);
};

registerDataProviders();
registerFunctionProviders();
registerServices(container);
registerControllers(container);

export { container as devContainer };
