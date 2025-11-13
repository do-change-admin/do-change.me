import { ErrorBaseCreatingPayload, ErrorFactory, ServiceErrorModel } from "@/value-objects/errors.value-object"
import z, { ZodArray, ZodObject } from "zod"

type ZodSchema = ZodObject | ZodArray

export type ZodServiceSchemas = Record<string, {
    payload: ZodSchema,
    response: ZodSchema
}>

const zodServiceMethodFactory = <T extends ZodServiceSchemas>(schemas: T, serviceName: string) => <Method extends keyof T>(
    methodName: Method,
    logic: {
        handler: (payload: {
            payload: z.infer<T[Method]['payload']>,
            serviceError: (payload: ErrorBaseCreatingPayload, cause?: unknown) => ServiceErrorModel
        }) => Promise<z.infer<T[Method]['response']>>,
        onError?: (e: ServiceErrorModel) => Promise<void>
    }
) => {
    return async (payload: z.infer<T[Method]['payload']>): Promise<z.infer<T[Method]['response']>> => {
        try {
            const parsedPayload = schemas[methodName].payload.parse(payload) as z.infer<T[Method]['payload']>
            const response = await logic.handler({
                payload: parsedPayload,
                serviceError: (payload, cause) => ErrorFactory.forService(serviceName).inMethod(methodName as string).newError(payload, cause)
            })
            const parsedResponse = schemas[methodName].response.parse(response) as z.infer<T[Method]['response']>
            return parsedResponse
        } catch (error) {
            if (ErrorFactory.isServiceError(error)) {
                if (logic.onError) {
                    await logic.onError(error)
                }
                throw error
            }

            const serviceErrorGenerator = ErrorFactory.forService(serviceName).inMethod(methodName as string)
            const serviceError = serviceErrorGenerator.newError(
                { error: 'Caught unhandled service error (see `cause` field for details)' },
                error
            )
            if (logic.onError) {
                await logic.onError(serviceError)
            }

            throw serviceError
        }
    }
}

export const ZodService = <Schemas extends ZodServiceSchemas>(name: string, schemas: Schemas) => {
    class Service<T extends ZodServiceSchemas> {
        public constructor(
            protected readonly name: string,
            protected readonly schemas: T
        ) { }

        protected method = zodServiceMethodFactory(this.schemas, this.name)
    }

    return class extends Service<Schemas> {
        constructor() {
            super(name, schemas);
        }
    }
}
