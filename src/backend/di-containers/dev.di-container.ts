import {
    DataProviders,
    DataProvidersImplemetations,
    FunctionProviders,
    FunctionProvidersImplementations,
} from "@/backend/providers";
import { Container } from "inversify";
import { StoreTokens, ProviderTokens } from "./tokens.di-container";
import { registerServices } from "./register-services";
import { registerControllers } from "./register-controllers";
import { NotificationStore } from "../stores/interfaces/notification.store";
import { NotificationInMemoryStore } from "../stores/implementations/in-memory/notification.in-memory-store";
import { IMailerProvider } from "../providers/mailer/mailer.provider";
import { ResendMailerProvider } from "../providers/mailer/resend-mailer/resend-mailer.provider";

import { ILogger } from "../services/logger/logger.service";
import { ConsoleLogger } from "../services/logger/console-logger/console-logger.service";

const container = new Container();

const registerDataProviders = () => {
    container
        .bind<DataProviders.SyndicationRequests.Interface>(
            StoreTokens.syndicationRequests
        )
        .to(DataProvidersImplemetations.Prisma.SyndicationRequests);
    container
        .bind<DataProviders.SyndicationRequestDrafts.Interface>(
            StoreTokens.syndicationRequestDrafts
        )
        .to(DataProvidersImplemetations.Prisma.SyndicationRequestDrafts);
    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(
            StoreTokens.vehicleHistoryReports
        )
        .to(DataProvidersImplemetations.Mock.VehicleHistoryReports);
    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(
            StoreTokens.vehicleHistoryReportsCache
        )
        .to(DataProvidersImplemetations.InMemory.VehicleHistoryReportsCache);
    container
        .bind<DataProviders.Pictures.Interface>(StoreTokens.pictures)
        .to(DataProvidersImplemetations.API.PicturesInPublicFolder);
    container
        .bind<NotificationStore>(StoreTokens.notifications)
        .to(NotificationInMemoryStore)
        .inSingletonScope();
};

const registerFunctionProviders = () => {
    container.bind<ILogger>(ProviderTokens.logger).to(ConsoleLogger);

    container
        .bind<IMailerProvider>(ProviderTokens.mailer)
        .to(ResendMailerProvider);
};

registerDataProviders();
registerFunctionProviders();
registerServices(container);
registerControllers(container);

export { container as devContainer };
