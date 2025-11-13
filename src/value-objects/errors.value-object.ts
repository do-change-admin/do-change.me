export type ErrorBaseCreatingPayload = {
    error: unknown,
    code?: string,
    details?: any
}

export type ErrorBaseModel = {
    name: string;
    message: string;
    code: string;
    timestamp: number;
    details: any | null;
}

export type ProviderErrorModel = ErrorBaseModel & {
    module: string;
    method: string;
    source: "provider";
    cause: ErrorBaseModel | null
}

export type ServiceErrorModel = ErrorBaseModel & {
    module: string;
    method: string;
    source: "service";
    cause: ProviderErrorModel | ErrorBaseModel | null
}

export type ControllerErrorModel = ErrorBaseModel & {
    module: string;
    method: string;
    source: "controller";
    cause: ServiceErrorModel | ProviderErrorModel | ErrorBaseModel | null;
    statusCode: number;
}


export class ErrorFactory {
    static isControllerError = (error: unknown): error is ControllerErrorModel => {
        if (!error || typeof error !== 'object') {
            return false
        }
        const argKeys = Object.keys(error)
        const requiredKeys = ['name', 'message', 'code', 'module', 'method', 'source', 'timestamp', 'statusCode']
        if (!requiredKeys.every(x => argKeys.includes(x))) {
            return false
        }

        // @ts-ignore
        const source = error['source'];
        return source === 'controller'
    }

    static isServiceError = (arg: any): arg is ServiceErrorModel => {
        if (typeof arg !== 'object' || !arg) {
            return false
        }
        const argKeys = Object.keys(arg)
        const requiredKeys = ['name', 'message', 'code', 'module', 'method', 'source', 'timestamp']
        if (!requiredKeys.every(x => argKeys.includes(x))) {
            return false
        }

        // @ts-ignore
        const source = arg['source'];
        return source === 'service'
    }

    static isProviderError = (arg: any): arg is ProviderErrorModel => {
        if (typeof arg !== 'object' || !arg) {
            return false
        }
        const argKeys = Object.keys(arg)
        const requiredKeys = ['name', 'message', 'code', 'module', 'method', 'source', 'timestamp']
        if (!requiredKeys.every(x => argKeys.includes(x))) {
            return false
        }

        // @ts-ignore
        const source = arg['source'];
        return source === 'provider'
    }

    private static base = ({ error, code, details }: ErrorBaseCreatingPayload): ErrorBaseModel => {
        let err: Error = error instanceof Error ? error : new Error('unknown error');

        if (typeof error === 'string' || typeof error === 'number') {
            err = new Error(error?.toString())
        }

        if (typeof error === 'object' && error !== null) {
            const jsonRepresentation = JSON.stringify(error)
            err = new Error(jsonRepresentation)
        }

        return {
            message: err.message,
            name: err.name,
            timestamp: Date.now(),
            code: code || err.name,
            details: details || null
        }
    }

    static forProvider = (providerName: string) => {
        return {
            inMethod: (methodName: string) => {
                return {
                    newError: (payload: ErrorBaseCreatingPayload, cause?: unknown): ProviderErrorModel => {
                        const errorBase = ErrorFactory.base(payload)
                        return {
                            ...errorBase,
                            module: providerName,
                            method: methodName,
                            source: 'provider',
                            cause: cause ? ErrorFactory.fromUnknownError(cause) : null
                        }
                    }
                }
            },
        }
    }

    static forService = (serviceName: string) => {
        return {
            inMethod: (methodName: string) => {
                return {
                    newError: (payload: ErrorBaseCreatingPayload, cause?: unknown): ServiceErrorModel => {
                        const errorBase = ErrorFactory.base(payload)
                        return {
                            ...errorBase,
                            cause: cause ? ErrorFactory.fromUnknownError(cause) : null,
                            module: serviceName,
                            method: methodName,
                            source: 'service'
                        }
                    }
                }
            }
        }
    }

    static forController = (controllerName: string) => {
        return {
            inMethod: (methodName: string) => {
                return {
                    newError: (payload: ErrorBaseCreatingPayload & { statusCode: number }, cause?: unknown): ControllerErrorModel => {
                        const errorBase = ErrorFactory.base(payload)
                        return {
                            ...errorBase,
                            cause: cause ? ErrorFactory.fromUnknownError(cause) : null,
                            module: controllerName,
                            method: methodName,
                            source: 'controller',
                            statusCode: payload.statusCode
                        }
                    }
                }
            }
        }
    }

    static fromUnknownError = (error: unknown): ErrorBaseModel | ProviderErrorModel | ServiceErrorModel => {
        const isErrorBase = (arg: any): arg is ErrorBaseModel => {
            if (typeof arg !== 'object' || !arg) {
                return false
            }
            const argKeys = Object.keys(arg)
            const requiredKeys = ['name', 'message', 'code', 'timestamp']
            return requiredKeys.every(x => argKeys.includes(x))
        }

        if (isErrorBase(error)) {
            return error as ErrorBaseModel
        }

        if (ErrorFactory.isProviderError(error)) {
            return error as ProviderErrorModel
        }

        if (ErrorFactory.isServiceError(error)) {
            return error as ServiceErrorModel
        }


        return ErrorFactory.base({ error })
    }
}

