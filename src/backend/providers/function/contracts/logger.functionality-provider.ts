import { ControllerErrorModel, ErrorBaseModel, ProviderErrorModel, ServiceErrorModel } from "@/value-objects/errors.value-object"

export type Interface = {
    error: (errorToBeLogged: ErrorBaseModel | ProviderErrorModel | ServiceErrorModel | ControllerErrorModel) => Promise<void>
}