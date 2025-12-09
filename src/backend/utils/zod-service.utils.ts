import type z from 'zod';
import type { ZodArray, ZodObject } from 'zod';
import { type ErrorBaseCreatingPayload, ErrorFactory, type ServiceErrorModel } from '@/backend/utils/errors.utils';

type ZodSchema = ZodObject | ZodArray;

type ZodServiceSchemas = Record<
    string,
    {
        payload: ZodSchema;
        response: ZodSchema;
    }
>;

export type ZodServiceMetadata = {
    name: string;
    schemas: ZodServiceSchemas;
};

export type ZodServiceDTOs<T extends ZodServiceMetadata> = {
    [K in keyof T['schemas'] as `${Extract<K, string>}Payload`]: z.infer<T['schemas'][K]['payload']>;
} & {
    [K in keyof T['schemas'] as `${Extract<K, string>}Response`]: z.infer<T['schemas'][K]['response']>;
};

const zodServiceMethodFactory =
    <T extends ZodServiceSchemas>(schemas: T, serviceName: string) =>
    <Method extends keyof T>(
        methodName: Method,
        logic: {
            handler: (payload: {
                payload: z.infer<T[Method]['payload']>;
                error: (payload: ErrorBaseCreatingPayload, cause?: unknown) => ServiceErrorModel;
            }) => Promise<z.infer<T[Method]['response']>>;
            onError?: (e: ServiceErrorModel) => Promise<void>;
        }
    ) => {
        return async (payload: z.infer<T[Method]['payload']>): Promise<z.infer<T[Method]['response']>> => {
            try {
                const parsedPayload = schemas[methodName].payload.parse(payload) as z.infer<T[Method]['payload']>;
                const response = await logic.handler({
                    payload: parsedPayload,
                    error: (payload, cause) =>
                        ErrorFactory.forService(serviceName)
                            .inMethod(methodName as string)
                            .newError(payload, cause)
                });
                const parsedResponse = schemas[methodName].response.parse(response) as z.infer<T[Method]['response']>;
                return parsedResponse;
            } catch (error) {
                if (ErrorFactory.isServiceError(error)) {
                    if (logic.onError) {
                        await logic.onError(error);
                    }
                    throw error;
                }

                const serviceErrorGenerator = ErrorFactory.forService(serviceName).inMethod(methodName as string);
                const serviceError = serviceErrorGenerator.newError(
                    {
                        error: 'Caught unhandled service error (see `cause` field for details)'
                    },
                    error
                );
                if (logic.onError) {
                    await logic.onError(serviceError);
                }

                throw serviceError;
            }
        };
    };

export const ZodService = <Schemas extends ZodServiceSchemas>(metadata: { name: string; schemas: Schemas }) => {
    class Service<T extends ZodServiceSchemas> {
        public constructor(
            protected readonly name: string,
            protected readonly schemas: T
        ) {}

        protected method = zodServiceMethodFactory(this.schemas, this.name);
    }

    return class extends Service<Schemas> {
        constructor() {
            super(metadata.name, metadata.schemas);
        }
    };
};
