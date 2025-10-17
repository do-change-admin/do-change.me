import z from "zod";

const codesSchema = z.enum([
    'validation',
    'third party service error',
])

const sidesSchema = z.enum([
    'client',
    'module'
])

const baseSchema = z.object({
    timestamp: z.number(),
    message: z.string().nonempty(),
    stack: z.string().nullable(),
    name: z.string().nonempty(),
    code: codesSchema,
    side: sidesSchema
})

export const providerSchema = baseSchema.extend({
    type: z.enum(['backend data provider', 'backend functionality provider']),
    provider: z.string().nonempty(),
    method: z.string().nonempty()
})

export const serviceSchema = baseSchema.extend({
    type: z.literal('backend service'),
    service: z.string().nonempty(),
    method: z.string().nonempty(),
    cause: providerSchema.nullable(),
})

export const controllerSchema = baseSchema.extend({
    statusCode: z.number().min(100).max(599),
    type: z.literal('backend controller'),
    controller: z.string().nonempty(),
    method: z.string().nonempty(),
    cause: serviceSchema.nullable(),
    userId: z.string().nullable(),
})


type BaseModel = z.infer<typeof baseSchema>
export type ProviderModel = z.infer<typeof providerSchema>
export type ServiceModel = z.infer<typeof serviceSchema>
export type ControllerModel = z.infer<typeof controllerSchema>
export type CodeModel = z.infer<typeof codesSchema>
export type SideModel = z.infer<typeof sidesSchema>

export type ErrorCreatingPayload = {
    error: unknown,
    code: CodeModel,
    side?: SideModel
    name?: string,
}

export type ServiceErrorCreatingPayload = ErrorCreatingPayload & {
    providerError?: ProviderModel
}

export type ControllerErrorCreatingPayload = ErrorCreatingPayload & {
    userId: string | null,
    statusCode: number,
    type: ControllerModel['type'],
    serviceError?: ServiceModel
}

const Base = ({ error, code, name, side }: ErrorCreatingPayload): BaseModel => {
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
        name: name || err.name,
        stack: err.stack || null,
        timestamp: Date.now(),
        code: code || null,
        side: side || 'module'
    }
}

export const InProvider = (provider: string, type: ProviderModel['type']) =>
    (method: string) => (payload: ErrorCreatingPayload): ProviderModel => {
        const baseError = Base(payload)
        return {
            code: baseError.code,
            message: baseError.message,
            method,
            name: baseError.name,
            provider,
            stack: baseError.stack,
            timestamp: baseError.timestamp,
            type: type,
            side: baseError.side
        }
    }

export const InService = (service: string) =>
    (method: string) =>
        (payload: ServiceErrorCreatingPayload): ServiceModel => {
            const baseError = Base(payload)
            return {
                cause: payload.providerError || null,
                code: baseError.code,
                message: baseError.message,
                method,
                service,
                name: baseError.name,
                stack: baseError.stack,
                timestamp: baseError.timestamp,
                type: 'backend service',
                side: baseError.side
            }
        }

export const InController = (controller: string) =>
    (method: string) =>
        (payload: ControllerErrorCreatingPayload): ControllerModel => {
            const baseError = Base(payload)
            return {
                cause: payload.serviceError || null,
                code: baseError.code,
                controller,
                message: baseError.message,
                method,
                name: baseError.name,
                stack: baseError.stack,
                statusCode: payload.statusCode,
                timestamp: baseError.timestamp,
                type: payload.type,
                userId: payload.userId,
                side: baseError.side
            }
        }