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
import { ConsoleMailerProvider } from "../providers/mailer/console-mailer/console-mailer.provider";
import { ILogger } from "../services/logger/logger.service";
import { ConsoleLogger } from "../services/logger/console-logger/console-logger.service";

const container = new Container();

const registerDataProviders = () => {
    container
        .bind<DataProviders.SyndicationRequests.Interface>(
            StoreTokens.syndicationRequests
        )
        .to(DataProvidersImplemetations.InMemory.SyndicationRequests)
        .inSingletonScope();
    container
        .bind<DataProviders.SyndicationRequestDrafts.Interface>(
            StoreTokens.syndicationRequestDrafts
        )
        .to(DataProvidersImplemetations.InMemory.SyndicationRequestDrafts)
        .inSingletonScope();
    container
        .bind<DataProviders.VehicleHistoryReports.Interface>(
            StoreTokens.vehicleHistoryReports
        )
        .to(DataProvidersImplemetations.Mock.VehicleHistoryReports);
    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(
            StoreTokens.vehicleHistoryReportsCache
        )
        .to(DataProvidersImplemetations.InMemory.VehicleHistoryReportsCache)
        .inSingletonScope();
    container
        .bind<DataProviders.Pictures.Interface>(StoreTokens.pictures)
        .to(DataProvidersImplemetations.Mock.Pictures);
    container
        .bind<NotificationStore>(StoreTokens.notifications)
        .to(NotificationInMemoryStore)
        .inSingletonScope();
};

const registerFunctionProviders = () => {
    container
        .bind<IMailerProvider>(ProviderTokens.mailer)
        .to(ConsoleMailerProvider);

    container.bind<ILogger>(ProviderTokens.logger).to(ConsoleLogger);
};

registerDataProviders();
registerFunctionProviders();
registerServices(container);
registerControllers(container);

export { container as testContainer };
