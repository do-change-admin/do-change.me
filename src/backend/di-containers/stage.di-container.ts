import {
    DataProviders,
    DataProvidersImplemetations,
    FunctionProviders,
    FunctionProvidersImplementations,
} from "@/backend/providers";
import { Container } from "inversify";
import {
    StoreTokens,
    ProviderTokens,
    ServiceTokens,
} from "./tokens.di-container";
import { registerServices } from "./register-services";
import { registerControllers } from "./register-controllers";
import { NotificationStore } from "../stores/interfaces/notification.store";
import { NotificationInMemoryStore } from "../stores/implementations/in-memory/notification.in-memory-store";
import { IMailerService } from "../services/mailer/mailer.service";
import { ResendMailerService } from "../services/mailer/resend-mailer/resend-mailer.service";

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
        .to(DataProvidersImplemetations.API.VehicleHistoryReports);
    container
        .bind<DataProviders.VehicleHistoryReports.CacheInterface>(
            StoreTokens.vehicleHistoryReportsCache
        )
        .to(DataProvidersImplemetations.Prisma.VehicleHistoryReportsCache);
    container
        .bind<DataProviders.Pictures.Interface>(StoreTokens.pictures)
        .to(DataProvidersImplemetations.API.PicturesInVercelBlob);
    container
        .bind<NotificationStore>(StoreTokens.notifications)
        .to(NotificationInMemoryStore)
        .inSingletonScope();
};

const registerFunctionProviders = () => {
    container.bind<IMailerService>(ServiceTokens.email).to(ResendMailerService);

    container
        .bind<FunctionProviders.Logger.Interface>(ProviderTokens.logger)
        .to(FunctionProvidersImplementations.Mock.Logger);
};

registerDataProviders();
registerFunctionProviders();
registerServices(container);
registerControllers(container);

export { container as stageContainer };
