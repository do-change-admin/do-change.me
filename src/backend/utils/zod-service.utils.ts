import type z from 'zod';
import type { ZodType } from 'zod';
import { type ErrorBaseCreatingPayload, ErrorFactory, type ServiceErrorModel } from '@/backend/utils/errors.utils';
import { DIContainer } from '../di-containers';
import { DIProviders } from '../di-containers/tokens.di-container';
import type { ActiveUserInfoProvider } from '../providers/active-user-info';

type ZodSchema = ZodType;

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
        handler: (
            payload: z.infer<T[Method]['payload']>,
            config: {
                methodError: (payload: string | ErrorBaseCreatingPayload, cause?: unknown) => ServiceErrorModel;
            }
        ) => Promise<z.infer<T[Method]['response']>>,
        config: {
            onError?: (e: ServiceErrorModel) => Promise<void>;
        } = {}
    ) => {
        return async (payload: z.infer<T[Method]['payload']>): Promise<z.infer<T[Method]['response']>> => {
            try {
                const parsedPayload = schemas[methodName].payload.parse(payload) as z.infer<T[Method]['payload']>;
                const response = await handler(parsedPayload, {
                    methodError: (payload, cause) =>
                        ErrorFactory.forService(serviceName)
                            .inMethod(methodName as string)
                            .newError(
                                typeof payload === 'string'
                                    ? { error: payload, code: payload, details: payload }
                                    : payload,
                                cause
                            )
                });
                const parsedResponse = schemas[methodName].response.parse(response) as z.infer<T[Method]['response']>;
                return parsedResponse;
            } catch (error) {
                if (ErrorFactory.isServiceError(error)) {
                    if (config.onError) {
                        await config.onError(error);
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
                if (config.onError) {
                    await config.onError(serviceError);
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

        private activeUserInfoProvider = DIContainer()._context.get<ActiveUserInfoProvider>(DIProviders.activeUserInfo);

        protected getUserId = async () => {
            const userId = await this.activeUserInfoProvider.userId();
            if (!userId) {
                throw 'No active user was found!';
            }
            return userId;
        };

        protected method = zodServiceMethodFactory(this.schemas, this.name);
    }

    return class extends Service<Schemas> {
        constructor() {
            super(metadata.name, metadata.schemas);
        }
    };
};
