import { type NextRequest, NextResponse } from 'next/server';
import z, { type ZodObject } from 'zod';
import { type ControllerErrorModel, type ErrorBaseCreatingPayload, ErrorFactory } from '@/backend/utils/errors.utils';
import { DIContainer } from '../di-containers';
import { DIProviders } from '../di-containers/tokens.di-container';
import type { ActiveUserInfoProvider } from '../providers/active-user-info';
import type { Logger } from '../providers/function/contracts';

type ZodAPIPayload<QueryParams, BodyParams> = (QueryParams extends undefined
    ? {}
    : {
          query: z.infer<QueryParams>;
      }) &
    (BodyParams extends undefined
        ? {}
        : {
              body: z.infer<BodyParams>;
          });

type SuccessResponse<ResponseZodSchema> = ResponseZodSchema extends undefined ? {} : z.infer<ResponseZodSchema>;

type ZodAPISchemas = {
    body?: ZodObject;
    query?: ZodObject;
    response?: ZodObject;
};

type ErrorResponse = {
    message: string;
    code?: string;
    details?: any;
};

type ZodAPIMethod<Schemas extends { body: unknown; query: unknown; response: unknown }> = {
    payload: ZodAPIPayload<Schemas['query'], Schemas['body']>;
    response: SuccessResponse<Schemas['response']>;
    error: ErrorResponse;
};

type Codes = 'Request parsing' | 'Response parsing';

type EndpointErrorGenerator = (
    payload: string | ErrorBaseCreatingPayload,
    cause?: unknown,
    errorStatus?: number
) => ControllerErrorModel;

type EndpointLogic<T extends ZodAPISchemas> = {
    handler: (
        payload: (T['query'] extends ZodObject ? z.infer<T['query']> : {}) &
            (T['body'] extends ZodObject ? z.infer<T['body']> : {}),
        request: {
            request: NextRequest;
            flags: Record<string, boolean>;
            endpointError: EndpointErrorGenerator;
        }
    ) => Promise<T['response'] extends ZodObject ? z.infer<T['response']> : void>;

    beforehandler?: (payload: { request: NextRequest; endpointError: EndpointErrorGenerator }) => Promise<void>;

    customReturnValue?: (
        req: NextRequest,
        response: T['response'] extends undefined ? undefined : z.infer<T['response']>
    ) => NextResponse;

    onSuccess?: (data: {
        requestPayload: (T['query'] extends ZodObject ? z.infer<T['query']> : {}) &
            (T['body'] extends ZodObject ? z.infer<T['body']> : {});
        request: NextRequest;
        result: T['response'] extends ZodObject ? z.infer<T['response']> : undefined;
        flags: Record<string, boolean>;
    }) => Promise<void>;

    onError?: (error: ControllerErrorModel, req: NextRequest) => Promise<{ message: string; status: number } | void>;
};

const zodAPIEndpointFactory = <T extends ZodControllerSchemas>(
    metadata: { schemas: T; name: string },
    sharedOnError?: (error: ControllerErrorModel, req: NextRequest) => Promise<void>,
    sharedBeforeHandler?: EndpointLogic<T>['beforehandler']
) => {
    const endpointLogic = <Method extends keyof T>(
        method: Method,
        handler: EndpointLogic<T[Method]>['handler'],
        configuration: Omit<EndpointLogic<T[Method]>, 'handler'> = {}
    ) => {
        return async (request: NextRequest /*context?: { params: Record<string, any> }*/) => {
            // if (context) {
            //     console.log(context.params.hello, 'yo ni');
            //     console.log(context, 'afsaf');
            // }
            const errorFactory = ErrorFactory.forController(metadata.name).inMethod(method as string);
            try {
                if (sharedBeforeHandler) {
                    await sharedBeforeHandler({
                        request,
                        endpointError: (payload, cause, errorStatus) => {
                            if (typeof payload === 'string') {
                                return errorFactory.newError(
                                    {
                                        statusCode: errorStatus ?? 500,
                                        code: payload,
                                        error: payload,
                                        details: requestPayload
                                    },
                                    cause
                                );
                            }

                            return errorFactory.newError({ ...payload, statusCode: errorStatus ?? 500 }, cause);
                        }
                    });
                }
                if (configuration.beforehandler) {
                    await configuration.beforehandler({
                        request,
                        endpointError: (payload, cause, errorStatus) => {
                            if (typeof payload === 'string') {
                                return errorFactory.newError(
                                    {
                                        statusCode: errorStatus ?? 500,
                                        code: payload,
                                        error: payload,
                                        details: requestPayload
                                    },
                                    cause
                                );
                            }

                            return errorFactory.newError({ ...payload, statusCode: errorStatus ?? 500 }, cause);
                        }
                    });
                }

                const endpointSchemas = metadata.schemas[method]!;

                if (!endpointSchemas) {
                    throw errorFactory.newError({
                        error: 'No schemas were found for the endpoind',
                        statusCode: 500
                    });
                }

                let requestPayload = {};

                if (endpointSchemas.query) {
                    const queryParamsAsObject = Object.fromEntries(request.nextUrl.searchParams.entries());
                    const queryParamsParsed = endpointSchemas.query.safeParse(queryParamsAsObject);
                    if (!queryParamsParsed.success) {
                        throw errorFactory.newError({
                            error: queryParamsParsed.error.message,
                            statusCode: 400,
                            code: 'Request parsing' satisfies Codes,
                            details: z.treeifyError(queryParamsParsed.error)
                        });
                    }
                    requestPayload = {
                        ...requestPayload,
                        ...queryParamsParsed.data
                    };
                }

                if (endpointSchemas.body) {
                    const body = await request.json();
                    const bodyParsed = endpointSchemas.body.safeParse(body);
                    if (!bodyParsed.success) {
                        throw errorFactory.newError({
                            error: bodyParsed.error.message,
                            statusCode: 400,
                            code: 'Request parsing' satisfies Codes,
                            details: z.treeifyError(bodyParsed.error)
                        });
                    }
                    requestPayload = { ...requestPayload, ...bodyParsed.data };
                }

                const flags: Record<string, boolean> = {};

                const result = await handler(requestPayload as any, {
                    request,
                    flags,
                    endpointError: (payload, cause, errorStatus) => {
                        if (typeof payload === 'string') {
                            return errorFactory.newError(
                                {
                                    statusCode: errorStatus ?? 500,
                                    code: payload,
                                    error: payload,
                                    details: requestPayload
                                },
                                cause
                            );
                        }

                        return errorFactory.newError({ ...payload, statusCode: errorStatus ?? 500 }, cause);
                    }
                });

                if (endpointSchemas.response) {
                    const resultParsed = endpointSchemas.response.safeParse(result);
                    if (!resultParsed.success) {
                        throw errorFactory.newError({
                            error: resultParsed.error.message,
                            statusCode: 500,
                            code: 'Response parsing' satisfies Codes,
                            details: z.treeifyError(resultParsed.error)
                        });
                    }
                    if (configuration.onSuccess) {
                        configuration.onSuccess({
                            request,
                            result: resultParsed.data as any,
                            requestPayload: requestPayload as any,
                            flags
                        });
                    }
                    return configuration.customReturnValue
                        ? // @ts-expect-error
                          configuration.customReturnValue(request, resultParsed.data)
                        : NextResponse.json<SuccessResponse<unknown>>(resultParsed.data, { status: 200 });
                }

                if (configuration.onSuccess) {
                    configuration.onSuccess({
                        request,
                        result: undefined as any,
                        requestPayload: requestPayload as any,
                        flags
                    });
                }

                return configuration.customReturnValue
                    ? // @ts-expect-error
                      configuration.customReturnValue(request, {})
                    : NextResponse.json<SuccessResponse<undefined>>({}, { status: 200 });
            } catch (e) {
                let controllerError: ControllerErrorModel = e as ControllerErrorModel;

                if (!ErrorFactory.isControllerError(e)) {
                    controllerError = errorFactory.newError(
                        {
                            error: 'Internal error',
                            statusCode: 500
                        },
                        e
                    );
                }

                if (!controllerError.details || typeof controllerError.details !== 'object') {
                    controllerError.details = {};
                }

                if (configuration.onError) {
                    try {
                        const data = await configuration.onError(controllerError, request);

                        if (data) {
                            return NextResponse.json<ErrorResponse>({ message: data.message }, { status: data.status });
                        }
                    } catch (errorFromOnErrorHandler) {
                        controllerError = errorFactory.newError(
                            {
                                error: 'onError handler error',
                                statusCode: 500
                            },
                            errorFromOnErrorHandler
                        );
                    }
                }

                const errorsWithSharedDetails: Codes[] = ['Request parsing', 'Response parsing'];

                return NextResponse.json<ErrorResponse>(
                    {
                        message: controllerError.message,
                        details: errorsWithSharedDetails.includes(controllerError.code as Codes)
                            ? controllerError.details
                            : undefined,
                        code: controllerError.code
                    },
                    { status: controllerError.statusCode }
                );
            }
        };
    };

    const preparedEndpoint: typeof endpointLogic = (method, handler, config = {}) => {
        const payloadWithSharedOnError = config;
        const { onError } = config;

        payloadWithSharedOnError.onError = async (error, req) => {
            if (sharedOnError) {
                await sharedOnError(error, req);
            }
            if (onError) {
                await onError(error, req);
            }
        };

        return endpointLogic(method, handler, payloadWithSharedOnError);
    };

    return preparedEndpoint;
};

type ZodControllerSchemas = Record<string, ZodAPISchemas>;

export type ZodControllerMetadata<T = ZodControllerSchemas> = {
    name: string;
    schemas: T;
};

type Flatten<T extends Record<string, Record<string, any>>> = {
    [K in keyof T as keyof T[K]]: T[K][keyof T[K]];
};
type OnlyObject<T> = T extends object ? T : never;

type SchemaShape = {
    body?: unknown;
    query?: unknown;
    response?: unknown;
};

type NormalizeSchema<T extends SchemaShape> = {
    body: T extends { body: infer B } ? B : undefined;
    query: T extends { query: infer Q } ? Q : undefined;
    response: T extends { response: infer R } ? R : undefined;
};

type RequestPayload<T extends SchemaShape> = Flatten<{
    [K in Exclude<keyof NormalizeSchema<T>, 'response'> as OnlyObject<NormalizeSchema<T>[K]> extends never
        ? never
        : K]: z.infer<OnlyObject<NormalizeSchema<T>[K]>>;
}>;

type ResponsePayload<T extends SchemaShape> = T extends { response: infer R } ? z.infer<R> : never;

export type ZodControllerAPI<
    Metadata extends {
        schemas: Record<string, SchemaShape>;
    },
    CustomModels extends Record<string, unknown> | undefined = undefined
> = {
    endpoints: {
        [K in keyof Metadata['schemas']]: ZodAPIMethod<NormalizeSchema<Metadata['schemas'][K]>>;
    };

    customModels: CustomModels extends undefined ? {} : CustomModels;

    requestDTOs: {
        [K in keyof Metadata['schemas']]: RequestPayload<Metadata['schemas'][K]>;
    };

    responseDTOs: {
        [K in keyof Metadata['schemas']]: ResponsePayload<Metadata['schemas'][K]>;
    };
};

export function ZodController<T extends ZodControllerSchemas>(metadata: ZodControllerMetadata<T>) {
    class ZODController<T extends ZodControllerSchemas> {
        public constructor(
            protected readonly name: string,
            protected readonly schemas: T
        ) {}

        protected logger = DIContainer()._context.get<Logger.Interface>(DIProviders.logger);
        protected activeUserInfo = DIContainer()._context.get<ActiveUserInfoProvider>(DIProviders.activeUserInfo);

        private onlyLoggedUsers: EndpointLogic<T>['beforehandler'] = async ({ endpointError }) => {
            const isLogged = await this.activeUserInfo.isLoggedIn();

            if (!isLogged) {
                throw endpointError('User is not logged in');
            }
        };

        protected endpointWithAuth = zodAPIEndpointFactory(metadata, this.logger.error, this.onlyLoggedUsers);

        protected endpoint = zodAPIEndpointFactory(metadata, this.logger.error);
    }

    return class extends ZODController<T> {
        constructor() {
            super(metadata.name, metadata.schemas);
        }
    };
}
