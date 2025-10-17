export const DataProviderTokens = {
    carsForSale: Symbol.for("CARS-FOR-SALE-DATA-PROVIDER"),
    vehicleHistoryReports: Symbol.for("VEHICLE-HISTORY-REPORTS-DATA-PROVIDER"),
    vehicleHistoryReportsCache: Symbol.for("VEHICLE-HISTORY-REPORTS-CACHE-DATA-PROVIDER"),
    pictures: Symbol.for("PICTURES-DATA-PROVIDER")
}

export const FunctionProviderTokens = {
    email: Symbol.for("EMAIL-FUNCTIONAL-PROVIDER")
}

export const ServiceTokens = {
    carSaleUserFactory: Symbol.for('CAR-SALE-USER-SERVICE-FACTORY'),
    carSaleAdmin: Symbol.for('CAR-SALE-ADMIN-SERVICE'),
    email: Symbol.for('EMAIL-SERVICE')
}

export const ControllerTokens = {
    carSaleUser: Symbol.for("CAR-SALE-USER-CONTROLLER")
}
