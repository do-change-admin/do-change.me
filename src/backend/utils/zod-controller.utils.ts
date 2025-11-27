import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { ControllerErrorModel, ErrorBaseCreatingPayload, ErrorFactory } from "@/value-objects/errors.value-object";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodObject } from "zod";
import { DIContainer } from "../di-containers";
import { FunctionProviders } from "../providers";
import { DIProviders } from "../di-containers/tokens.di-container";

async function getCurrentUser() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return null;
    }

    return {
        id: session.user.id,
        email: session.user.email,
    };
}

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

type SuccessResponse<ResponseZodSchema> = ResponseZodSchema extends undefined
    ? {}
    : z.infer<ResponseZodSchema>;


type ZodAPISchemas = {
    body: ZodObject | undefined,
    query: ZodObject | undefined,
    response: ZodObject | undefined
}

type ErrorResponse = {
    message: string;
    details?: any
}

type Id = { id: string }


type ZodAPIMethod<Schemas extends { body: unknown, query: unknown, response: unknown }> = {
    payload: ZodAPIPayload<Schemas['query'], Schemas['body']>;
    response: SuccessResponse<Schemas['response']>;
    error: Pick<ControllerErrorModel, 'message' | 'details'>;
}

const getUserId = async () => {
    const user = await getCurrentUser()
    if (!user) {
        return undefined
    }
    return user.id
}

type Codes = 'Request parsing' | 'Response parsing'

type EndpointLogic<T extends ZodAPISchemas> = {
    handler: (request: {
        payload: (T['query'] extends ZodObject ? z.infer<T['query']> : {}) & (T['body'] extends ZodObject ? z.infer<T['body']> : {}),
        activeUser: Id,
        req: NextRequest,
        flags: Record<string, boolean>,
        endpointError: (payload: ErrorBaseCreatingPayload & { statusCode: number }, cause?: unknown) => ControllerErrorModel
    }) => Promise<T['response'] extends ZodObject ? z.infer<T['response']> : void>,

    beforehandler?: (request: {
        payload: (T['query'] extends ZodObject ? z.infer<T['query']> : {}) & (T['body'] extends ZodObject ? z.infer<T['body']> : {}),
        activeUser: Id,
        req: NextRequest,
        endpointError: (payload: ErrorBaseCreatingPayload & { statusCode: number }, cause?: unknown) => ControllerErrorModel
    }) => Promise<void>,

    onSuccess?: (data: {
        requestPayload: (T['query'] extends ZodObject ? z.infer<T['query']> : {}) & (T['body'] extends ZodObject ? z.infer<T['body']> : {}),
        activeUser: Id,
        req: NextRequest
        result: T['response'] extends ZodObject ? z.infer<T['response']> : undefined,
        flags: Record<string, boolean>,
    }) => Promise<void>,

    onError?: (request: {
        error: ControllerErrorModel,
        req: NextRequest
    }) => Promise<void>,

    ignoreBeforeHandler?: (request: {
        payload: (T['query'] extends ZodObject ? z.infer<T['query']> : {}) & (T['body'] extends ZodObject ? z.infer<T['body']> : {}),
        activeUser: Id,
        req: NextRequest
    }) => Promise<boolean>,

    passUnathorized?: boolean,
}

const zodAPIEndpointFactory = <T extends ZodControllerSchemas>(
    schemas: T,
    controller: string,
    sharedOnError?: (request: {
        error: ControllerErrorModel,
        req: NextRequest
    }) => Promise<void>,
) => {
    const endpointLogic = <Method extends keyof T>(method: Method, logic: EndpointLogic<T[Method]>) => {
        return async (request: NextRequest) => {
            const errorFactory = ErrorFactory.forController(controller).inMethod(method as string)
            try {
                const endpointSchemas = schemas[method]!

                if (!endpointSchemas) {
                    throw errorFactory.newError({
                        error: 'No schemas were found for the endpoind',
                        statusCode: 500
                    })
                }

                const userId = await getUserId();
                if (!userId && !logic.passUnathorized) {
                    throw errorFactory.newError({
                        error: 'No authenticated error was found',
                        statusCode: 401,
                    })
                }
                const activeUser: Id = { id: userId || '' }

                let requestPayload = {};

                if (endpointSchemas.query) {
                    const queryParamsAsObject = Object.fromEntries(
                        request.nextUrl.searchParams.entries()
                    );
                    const queryParamsParsed =
                        endpointSchemas.query.safeParse(queryParamsAsObject);
                    if (!queryParamsParsed.success) {
                        throw errorFactory.newError({
                            error: queryParamsParsed.error.message,
                            statusCode: 400,
                            code: 'Request parsing' satisfies Codes,
                            details: z.treeifyError(queryParamsParsed.error)
                        })
                    }
                    requestPayload = { ...requestPayload, ...queryParamsParsed.data };
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
                        })
                    }
                    requestPayload = { ...requestPayload, ...bodyParsed.data };
                }

                if (logic.beforehandler) {
                    let ignoreBeforeHandler = false
                    if (logic.ignoreBeforeHandler) {
                        ignoreBeforeHandler = await logic.ignoreBeforeHandler({
                            activeUser,
                            payload: requestPayload as any,
                            req: request,
                        })
                    }
                    if (!ignoreBeforeHandler) {
                        await logic.beforehandler({
                            activeUser,
                            payload: requestPayload as any,
                            req: request,
                            endpointError: errorFactory.newError
                        })
                    }
                }

                let flags: Record<string, boolean> = {}

                const result = await logic.handler({
                    activeUser,
                    payload: requestPayload as any,
                    req: request,
                    flags,
                    endpointError: errorFactory.newError
                });

                if (endpointSchemas.response) {
                    const resultParsed = endpointSchemas.response.safeParse(result);
                    if (!resultParsed.success) {
                        throw errorFactory.newError({
                            error: resultParsed.error.message,
                            statusCode: 500,
                            code: 'Response parsing' satisfies Codes,
                            details: z.treeifyError(resultParsed.error)
                        })
                    }
                    if (logic.onSuccess) {
                        logic.onSuccess({
                            activeUser,
                            req: request,
                            result: resultParsed.data as any,
                            requestPayload: requestPayload as any,
                            flags,

                        })
                    }
                    return NextResponse.json<SuccessResponse<unknown>>(
                        resultParsed.data,
                        { status: 200 }
                    );
                }

                if (logic.onSuccess) {
                    logic.onSuccess({
                        activeUser,
                        req: request,
                        result: undefined as any,
                        requestPayload: requestPayload as any,
                        flags
                    })
                }

                return NextResponse.json<SuccessResponse<undefined>>(
                    {},
                    { status: 200 }
                );

            }
            catch (e) {
                let controllerError: ControllerErrorModel = e as ControllerErrorModel

                if (!ErrorFactory.isControllerError(e)) {
                    controllerError = errorFactory.newError({
                        error: 'Unhandled controller error',
                        statusCode: 500,
                    }, e)
                }

                if (logic.onError) {
                    try {
                        await logic.onError({
                            error: controllerError,
                            req: request
                        })
                    } catch (errorFromOnErrorHandler) {
                        controllerError = errorFactory.newError({
                            error: 'onError handler error',
                            statusCode: 500,
                        }, errorFromOnErrorHandler)
                    }
                }

                const errorsWithSharedDetails: Codes[] = ['Request parsing', 'Response parsing']

                return NextResponse.json<ErrorResponse>({
                    message: controllerError.message,
                    details: errorsWithSharedDetails.includes(controllerError.code as Codes) ? controllerError.details : undefined
                }, { status: controllerError.statusCode })
            }
        }
    }


    const preparedEndpoint: typeof endpointLogic = (method, payload) => {
        let payloadWithSharedOnError = payload;
        const { onError } = payload

        payloadWithSharedOnError.onError = async ({ error, req }) => {
            if (sharedOnError) {
                await sharedOnError({ error, req })
            }
            if (onError) {
                await onError({ error, req })
            }
        }

        return endpointLogic(method, payloadWithSharedOnError)
    }

    return preparedEndpoint
}


export type ZodControllerSchemas = Record<string, ZodAPISchemas>

export type ZodControllerAPI<
    Schemas extends Record<string, { body: unknown, query: unknown, response: unknown }>,
    DTOs extends Record<string, unknown> | undefined = undefined
> = {
    endpoints: { [k in keyof Schemas]: ZodAPIMethod<Schemas[k]> },
    DTOs: DTOs extends undefined ? {} : DTOs
}

export function ZodController<T extends ZodControllerSchemas>(
    name: string,
    schemas: T
) {
    class ZODController<T extends ZodControllerSchemas> {
        public constructor(
            protected readonly name: string,
            protected readonly schemas: T
        ) { }

        protected logger = DIContainer()._context.get<FunctionProviders.Logger.Interface>(DIProviders.logger)

        protected loggedEndpoint = zodAPIEndpointFactory(this.schemas, this.name, async ({ error }) => { await this.logger.error(error) })

        protected endpoint = zodAPIEndpointFactory(this.schemas, this.name)
    }

    return class extends ZODController<T> {
        constructor() {
            super(name, schemas);
        }
    }
}
