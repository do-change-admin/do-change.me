export const DataProviderTokens = {
    vehicleHistoryReports: Symbol.for("VEHICLE-HISTORY-REPORTS-DATA-PROVIDER"),
    vehicleHistoryReportsCache: Symbol.for("VEHICLE-HISTORY-REPORTS-CACHE-DATA-PROVIDER"),
    pictures: Symbol.for("PICTURES-DATA-PROVIDER"),
    syndicationRequests: Symbol.for("SYNDICATION-REQUESTS-DATA-PROVIDER"),
    syndicationRequestDrafts: Symbol.for("SYNDICATION-REQUEST-DRAFTS")
}

export const FunctionProviderTokens = {
    email: Symbol.for("EMAIL-FUNCTIONAL-PROVIDER")
}

export const ServiceTokens = {
    email: Symbol.for('EMAIL-SERVICE'),
    syndicationRequestsFactory: Symbol.for("SYNDICATION-REQUESTS-SERVICE-FACTORY"),
    syndicationRequestDraftsFactory: Symbol.for("SYNDICATION-REQUEST-DRAFTS-SERVICE-FACTORY"),
    syndicationRequestManagement: Symbol.for("SYNDICATION-REQUEST-MANAGEMENT-SERVICE")
}

export const ControllerTokens = {
    syndicationRequests: Symbol.for("SYNDICATION-REQUESTS-CONTROLLER"),
    syndicationRequestDrafts: Symbol.for("SYNDICATION-REQUEST-DRAFTS-CONTROLLER"),
    syndicationRequestManagement: Symbol.for("SYNDICATION-REQUEST-MANAGEMENT-CONTROLLER")
}
