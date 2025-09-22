import { isApplicationError } from "@/lib/errors";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

type ZodObjectData = Readonly<{
    [k: string]: z.core.$ZodType<
        unknown,
        unknown,
        z.core.$ZodTypeInternals<unknown, unknown>
    >;
}>;

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

type ErrorResponse = {
    error: {
        message: string,
        details?: object
    };
    stage:
    | "query params parsing"
    | "request body parsing"
    | "result parsing"
    | "api handler executing"
    | "user obtaining";
    success: false;
};

export type ZodAPIMethod_DEPRECATED<Query, Body, Response> = {
    payload: ZodAPIPayload<Query, Body>;
    response: SuccessResponse<Response>;
    error: ErrorResponse;
};

export type ZodAPIMethod<Schemas extends { body: unknown, query: unknown, response: unknown }> = {
    payload: ZodAPIPayload<Schemas['query'], Schemas['body']>;
    response: SuccessResponse<Schemas['response']>;
    error: ErrorResponse;
}

export const zodApiMethod = <
    QueryParams extends ZodObjectData | undefined,
    BodyParams extends ZodObjectData | undefined,
    ReturnData extends ZodObjectData | undefined
>(
    schemas: {
        query: QueryParams extends ZodObjectData ? z.ZodObject<QueryParams> : undefined,
        body: BodyParams extends ZodObjectData ? z.ZodObject<BodyParams> : undefined,
        response: ReturnData extends ZodObjectData ? z.ZodObject<ReturnData> : undefined,
    },
    logic: {
        handler: (request: {
            payload: z.infer<typeof schemas.query> & z.infer<typeof schemas.body>,
            activeUser: { id: string; email: string },
            req: NextRequest
        }) => Promise<ReturnData extends ZodObjectData ? z.infer<typeof schemas.response> : void
        >,
        beforehandler?: (request: {
            payload: z.infer<typeof schemas.query> & z.infer<typeof schemas.body>,
            activeUser: { id: string; email: string },
            req: NextRequest
        }) => Promise<void>,
        onSuccess?: (data: {
            requestPayload: z.infer<typeof schemas.query> & z.infer<typeof schemas.body>,
            activeUser: { id: string; email: string },
            req: NextRequest
            result: ReturnData extends ZodObjectData ? z.infer<typeof schemas.response> : undefined
        }) => Promise<void>
    },
) => {
    return async (request: NextRequest) => {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json<ErrorResponse>({
                error: { message: "Active user was not found" },
                success: false,
                stage: "user obtaining",
            });
        }
        let resultObject = {};
        if (schemas.query) {
            const queryParamsAsObject = Object.fromEntries(
                request.nextUrl.searchParams.entries()
            );
            const queryParamsParsed =
                schemas.query.safeParse(queryParamsAsObject);
            if (!queryParamsParsed.success) {
                return NextResponse.json<ErrorResponse>(
                    {
                        error: {
                            details: z.treeifyError(queryParamsParsed.error),
                            message: queryParamsParsed.error.message
                        },
                        stage: "query params parsing",
                        success: false,
                    },
                    { status: 400 }
                );
            }
            resultObject = { ...resultObject, ...queryParamsParsed.data };
        }
        if (schemas.body) {
            const body = await request.json();
            const bodyParsed = schemas.body.safeParse(body);
            if (!bodyParsed.success) {
                return NextResponse.json<ErrorResponse>(
                    {
                        error: {
                            details: z.treeifyError(bodyParsed.error),
                            message: bodyParsed.error.message
                        },
                        stage: "request body parsing",
                        success: false,
                    },
                    { status: 400 }
                );
            }
            resultObject = { ...resultObject, ...bodyParsed.data };
        }
        try {
            if (logic.beforehandler) {
                await logic.beforehandler({
                    activeUser: user,
                    payload: resultObject as any,
                    req: request
                })
            }
            const result = await logic.handler({
                activeUser: user,
                payload: resultObject as any,
                req: request
            });
            if (schemas.response) {
                const resultParsed = schemas.response.safeParse(result);
                if (!resultParsed.success) {
                    return NextResponse.json<ErrorResponse>(
                        {
                            error: {
                                details: z.treeifyError(resultParsed.error),
                                message: resultParsed.error.message
                            },
                            stage: "result parsing",
                            success: false,
                        },
                        { status: 500 }
                    );
                }
                if (logic.onSuccess) {
                    logic.onSuccess({
                        activeUser: user,
                        req: request,
                        result: resultParsed as any,
                        requestPayload: resultObject as any,
                    })
                }
                return NextResponse.json<SuccessResponse<unknown>>(
                    resultParsed.data,
                    { status: 200 }
                );
            }

            return NextResponse.json<SuccessResponse<undefined>>(
                {},
                { status: 200 }
            );
        } catch (e) {
            if (isApplicationError(e)) {
                return NextResponse.json<ErrorResponse>({
                    error: { message: e.error.message },
                    stage: 'api handler executing',
                    success: false
                }, { status: e.error.statusCode ?? 500 })
            }
            if (typeof e === "string") {
                return NextResponse.json<ErrorResponse>(
                    {
                        error: { message: e },
                        stage: "api handler executing",
                        success: false,
                    },
                    { status: 500 }
                );
            }
            if (typeof e === "object" && e instanceof Error) {
                return NextResponse.json<ErrorResponse>(
                    {
                        error: { message: e.message },
                        stage: "api handler executing",
                        success: false,
                    },
                    { status: 500 }
                );
            }
            return NextResponse.json<ErrorResponse>(
                {
                    error: { message: "unknown error" },
                    stage: "api handler executing",
                    success: false,
                },
                { status: 500 }
            );
        }
    };
};


export const zodApiMethod_DEPRECATED = <
    QueryParams extends ZodObjectData | undefined,
    BodyParams extends ZodObjectData | undefined,
    ReturnData extends ZodObjectData | undefined
>(
    queryParamsSchema: QueryParams extends ZodObjectData
        ? z.ZodObject<QueryParams>
        : undefined,
    bodyParamsSchema: BodyParams extends ZodObjectData
        ? z.ZodObject<BodyParams>
        : undefined,
    returnDataSchema: ReturnData extends ZodObjectData
        ? z.ZodObject<ReturnData>
        : undefined,
    handler: (
        payload: z.infer<typeof queryParamsSchema> &
            z.infer<typeof bodyParamsSchema> & {
                activeUser: { id: string; email: string };
            },
        req: NextRequest
    ) => Promise<
        ReturnData extends ZodObjectData
        ? z.infer<typeof returnDataSchema>
        : void
    >,
    beforeHandler?: (payload: z.infer<typeof queryParamsSchema> &
        z.infer<typeof bodyParamsSchema> & {
            activeUser: { id: string; email: string };
        }) => Promise<void>,
    onSuccess?: (payload: z.infer<typeof queryParamsSchema> &
        z.infer<typeof bodyParamsSchema> & {
            activeUser: { id: string; email: string };
        } & { result: z.infer<typeof returnDataSchema> }) => Promise<void>
) => {
    return async (request: NextRequest) => {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json<ErrorResponse>({
                error: { message: "Active user was not found" },
                success: false,
                stage: "user obtaining",
            });
        }
        let resultObject = { activeUser: user };
        if (queryParamsSchema) {
            const queryParamsAsObject = Object.fromEntries(
                request.nextUrl.searchParams.entries()
            );
            const queryParamsParsed =
                queryParamsSchema.safeParse(queryParamsAsObject);
            if (!queryParamsParsed.success) {
                return NextResponse.json<ErrorResponse>(
                    {
                        error: {
                            details: z.treeifyError(queryParamsParsed.error),
                            message: queryParamsParsed.error.message
                        },
                        stage: "query params parsing",
                        success: false,
                    },
                    { status: 400 }
                );
            }
            resultObject = { ...resultObject, ...queryParamsParsed.data };
        }
        if (bodyParamsSchema) {
            const body = await request.json();
            const bodyParsed = bodyParamsSchema.safeParse(body);
            if (!bodyParsed.success) {
                return NextResponse.json<ErrorResponse>(
                    {
                        error: {
                            details: z.treeifyError(bodyParsed.error),
                            message: bodyParsed.error.message
                        },
                        stage: "request body parsing",
                        success: false,
                    },
                    { status: 400 }
                );
            }
            resultObject = { ...resultObject, ...bodyParsed.data };
        }
        try {
            if (beforeHandler) {
                await beforeHandler(resultObject as any)
            }
            const result = await handler(
                resultObject as Parameters<typeof handler>[0],
                request
            );
            if (returnDataSchema) {
                const resultParsed = returnDataSchema.safeParse(result);
                if (!resultParsed.success) {
                    return NextResponse.json<ErrorResponse>(
                        {
                            error: {
                                details: z.treeifyError(resultParsed.error),
                                message: resultParsed.error.message
                            },
                            stage: "result parsing",
                            success: false,
                        },
                        { status: 500 }
                    );
                }
                if (onSuccess) {
                    onSuccess({ ...resultObject, result } as any)
                }
                return NextResponse.json<SuccessResponse<unknown>>(
                    resultParsed.data,
                    { status: 200 }
                );
            }

            return NextResponse.json<SuccessResponse<undefined>>(
                {},
                { status: 200 }
            );
        } catch (e) {
            if (isApplicationError(e)) {
                return NextResponse.json<ErrorResponse>({
                    error: { message: e.error.message },
                    stage: 'api handler executing',
                    success: false
                }, { status: e.error.statusCode ?? 500 })
            }
            if (typeof e === "string") {
                return NextResponse.json<ErrorResponse>(
                    {
                        error: { message: e },
                        stage: "api handler executing",
                        success: false,
                    },
                    { status: 500 }
                );
            }
            if (typeof e === "object" && e instanceof Error) {
                return NextResponse.json<ErrorResponse>(
                    {
                        error: { message: e.message },
                        stage: "api handler executing",
                        success: false,
                    },
                    { status: 500 }
                );
            }
            return NextResponse.json<ErrorResponse>(
                {
                    error: { message: "unknown error" },
                    stage: "api handler executing",
                    success: false,
                },
                { status: 500 }
            );
        }
    };
};
