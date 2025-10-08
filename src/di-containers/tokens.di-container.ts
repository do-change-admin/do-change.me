import type { Services } from '@/services'

export const DataProviderTokens = {
    carsForSale: Symbol.for("CARS-FOR-SALE-DATA-PROVIDER"),
    vehicleHistoryReports: Symbol.for("VEHICLE-HISTORY-REPORTS-DATA-PROVIDER"),
    pictures: Symbol.for("PICTURES-DATA-PROVIDER")
}

export const FunctionalProviderTokens = {
    email: Symbol.for("EMAIL-FUNCTIONAL-PROVIDER")
}

export const ServiceTokens = {
    carSaleUserFactory: Symbol.for('CAR-SALE-USER-SERVICE-FACTORY'),
    carSaleAdmin: Symbol.for('CAR-SALE-ADMIN-SERVICE')
}

export type CarSaleUserServiceFactory = (userId: string) => Services.CarSaleUser.Instance
