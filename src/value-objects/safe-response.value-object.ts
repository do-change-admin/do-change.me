import z from "zod";
import * as Errors from './errors.value-object'

export const providerStatusSchema = z.union([
    z.object({ success: z.literal(true) }),
    z.object({ success: z.literal(false), error: Errors.providerSchema })
])

export const serviceStatusSchema = z.union([
    z.object({ success: z.literal(true) }),
    z.object({ success: z.literal(false), error: Errors.serviceSchema })
])

export const controllerStatusSchema = z.union([
    z.object({ success: z.literal(true) }),
    z.object({ success: z.literal(false), error: Errors.controllerSchema })
])


type ProviderStatusSchema = z.infer<typeof providerStatusSchema>
type ServiceStatusSchema = z.infer<typeof serviceStatusSchema>
type ControllerStatusSchema = z.infer<typeof controllerStatusSchema>

export type Provider<Response = undefined> =
    | (Extract<ProviderStatusSchema, { success: true }> & { response: Response })
    | Extract<ProviderStatusSchema, { success: false }>;

export type Service<Response = undefined> =
    | (Extract<ServiceStatusSchema, { success: true }> & { response: Response })
    | Extract<ServiceStatusSchema, { success: false }>;

export type Controller<Response = undefined> =
    | (Extract<ControllerStatusSchema, { success: true }> & { response: Response })
    | Extract<ControllerStatusSchema, { success: false }>;

export type ProviderAsync<Response = undefined> =
    Promise<
        | (Extract<ProviderStatusSchema, { success: true }> & { response: Response })
        | Extract<ProviderStatusSchema, { success: false }>
    >;

export type ServiceAsync<Response = undefined> =
    Promise<
        | (Extract<ServiceStatusSchema, { success: true }> & { response: Response })
        | Extract<ServiceStatusSchema, { success: false }>
    >;

export type ControllerAsync<Response = undefined> =
    Promise<
        | (Extract<ControllerStatusSchema, { success: true }> & { response: Response })
        | Extract<ControllerStatusSchema, { success: false }>
    >;
