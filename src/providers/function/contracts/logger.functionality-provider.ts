import { ValueObjects } from "@/value-objects"

type Errors = ValueObjects.Errors.ControllerModel | ValueObjects.Errors.ProviderModel | ValueObjects.Errors.ServiceModel

export type Interface = {
    error: (errorToBeLogged: Errors) => Promise<void>
}