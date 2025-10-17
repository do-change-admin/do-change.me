import { Container } from "inversify"
import { DataProviderTokens, ServiceTokens } from "./tokens.di-container"
import { DataProviders } from "@/providers"
import { Services } from "@/services"

export type CarSaleUserServiceFactory = (userId: string) => Services.CarSaleUser.Instance

export const registerServices = (container: Container) => {
    container.
        bind<CarSaleUserServiceFactory>(ServiceTokens.carSaleUserFactory)
        .toFactory(ctx => {
            return (userId) => {
                const dataProvider = ctx.get<DataProviders.CarsForSale.Interface>(DataProviderTokens.carsForSale)
                const picturesDataProvider = ctx.get<DataProviders.Pictures.Interface>(DataProviderTokens.pictures)
                return new Services.CarSaleUser.Instance(
                    dataProvider,
                    picturesDataProvider,
                    userId
                )
            }
        })
    container
        .bind<Services.CarSaleAdmin.Instance>(ServiceTokens.carSaleAdmin)
        .to(Services.CarSaleAdmin.Instance)
    container
        .bind<Services.Email.Instance>(ServiceTokens.email)
        .to(Services.Email.Instance)
}
