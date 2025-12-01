export const DIStores = {
    vehicleHistoryReports: Symbol.for('VEHICLE-HISTORY-REPORTS-DATA-PROVIDER'),
    vehicleHistoryReportsCache: Symbol.for('VEHICLE-HISTORY-REPORTS-CACHE-DATA-PROVIDER'),
    pictures: Symbol.for('PICTURES-DATA-PROVIDER'),
    reserve_pictures: Symbol(),
    syndicationRequests: Symbol.for('SYNDICATION-REQUESTS-DATA-PROVIDER'),
    syndicationRequestDrafts: Symbol.for('SYNDICATION-REQUEST-DRAFTS'),
    notifications: Symbol.for('NOTIFICATIONS-DATA-PROVIDER'),
    remotePictures: Symbol()
};

export const DIProviders = {
    mailer: Symbol.for('MAILER-FUNCTIONAL-PROVIDER'),
    logger: Symbol.for('LOGGER-FUNCTIONAL-PROVIDER'),
    s3Client: Symbol()
};

export const ServiceTokens = {
    email: Symbol.for('EMAIL-SERVICE'),
    syndicationRequestsFactory: Symbol.for('SYNDICATION-REQUESTS-SERVICE-FACTORY'),
    syndicationRequestDraftsFactory: Symbol.for('SYNDICATION-REQUEST-DRAFTS-SERVICE-FACTORY'),
    syndicationRequestManagement: Symbol.for('SYNDICATION-REQUEST-MANAGEMENT-SERVICE'),
    userNotificationsFactory: Symbol.for('USER-NOTIFICATIONS-SERVICE'),
    userNotificationsManagementFactory: Symbol.for('USER-NOTIFICATIONS-MANAGEMENT-SERVICE')
};

export const ControllerTokens = {
    syndicationRequests: Symbol.for('SYNDICATION-REQUESTS-CONTROLLER'),
    syndicationRequestDrafts: Symbol.for('SYNDICATION-REQUEST-DRAFTS-CONTROLLER'),
    syndicationRequestManagement: Symbol.for('SYNDICATION-REQUEST-MANAGEMENT-CONTROLLER'),
    userNotifications: Symbol.for('USER-NOTIFICATIONS-CONTROLLER'),
    userNotificationsManagement: Symbol.for('USER-NOTIFICATIONS-MANAGEMENT-CONTROLLER'),
    subscriptions: Symbol()
};
