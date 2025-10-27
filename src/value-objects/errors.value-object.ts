type ErrorBaseCreatingPayload = {
    error: unknown,
    code?: string,
    details?: Record<string, string>
}

export type ErrorBaseModel = {
    name: string;
    message: string;
    code: string;
    stack: string | null;
    timestamp: number;
    details: Record<string, string> | null;
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
    cause: ServiceErrorModel | ProviderErrorModel | ErrorBaseModel | null
}


export class ErrorFactory {
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
            stack: err.stack || null,
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
                    newError: (payload: ErrorBaseCreatingPayload, cause?: unknown): ControllerErrorModel => {
                        const errorBase = ErrorFactory.base(payload)
                        return {
                            ...errorBase,
                            cause: cause ? ErrorFactory.fromUnknownError(cause) : null,
                            module: controllerName,
                            method: methodName,
                            source: 'controller'
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

        const isProviderError = (arg: any): arg is ProviderErrorModel => {
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

        const isServiceError = (arg: any): arg is ServiceErrorModel => {
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

        if (isErrorBase(error)) {
            return error as ErrorBaseModel
        }

        if (isProviderError(error)) {
            return error as ProviderErrorModel
        }

        if (isServiceError(error)) {
            return error as ServiceErrorModel
        }


        return ErrorFactory.base({ error })
    }
}

