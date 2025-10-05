import { type CarSaleUserService } from "@/services"

export const DataProviderTokens = {
    carsForSale: Symbol.for("CARS-FOR-SALE-DATA-PROVIDER")
}

export const FunctionalProviderTokens = {
    fileSystem: Symbol.for("FILE-SYSTEM-FUNCTIONAL-PROVIDER")
}

export const ServicesTokens = {
    carSaleUserFactory: Symbol.for('CAR-SALE-USER-SERVICE-FACTORY'),
    carSaleAdmin: Symbol.for('CAR-SALE-ADMIN-SERVICE')
}

export type CarSaleUserServiceFactory = (userId: string) => CarSaleUserService
