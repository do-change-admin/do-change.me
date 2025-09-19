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

type ErrorResponse =
    | {
        error: Object;
        stage:
        | "query params parsing"
        | "request body parsing"
        | "result parsing";
        success: false;
    }
    | {
        error: { message: string };
        stage: "api handler executing" | "user obtaining";
        success: false;
    };

export type ZodAPIMethod<Query, Body, Response> = {
    payload: ZodAPIPayload<Query, Body>;
    response: SuccessResponse<Response>;
    error: ErrorResponse;
};

export const zodApiMethod = <
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
    >
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
                        error: z.treeifyError(queryParamsParsed.error),
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
                        error: z.treeifyError(bodyParsed.error),
                        stage: "request body parsing",
                        success: false,
                    },
                    { status: 400 }
                );
            }
            resultObject = { ...resultObject, ...bodyParsed.data };
        }
        try {
            const result = await handler(
                resultObject as Parameters<typeof handler>[0],
                request
            );
            if (returnDataSchema) {
                const resultParsed = returnDataSchema.safeParse(result);
                if (!resultParsed.success) {
                    return NextResponse.json<ErrorResponse>(
                        {
                            error: z.treeifyError(resultParsed.error),
                            stage: "result parsing",
                            success: false,
                        },
                        { status: 500 }
                    );
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
                console.log(e, 'err')
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
