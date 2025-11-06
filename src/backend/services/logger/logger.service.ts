import {
    ControllerErrorModel,
    ErrorBaseModel,
    ProviderErrorModel,
    ServiceErrorModel,
} from "@/value-objects/errors.value-object";

export type AnyErrorModel =
    | ErrorBaseModel
    | ProviderErrorModel
    | ServiceErrorModel
    | ControllerErrorModel;

export interface ILogger {
    info(message: string, context?: Record<string, unknown>): Promise<void>;
    warn(message: string, context?: Record<string, unknown>): Promise<void>;
    error(error: AnyErrorModel): Promise<void>;
}
