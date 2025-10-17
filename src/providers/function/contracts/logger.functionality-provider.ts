import { VO } from "@/value-objects"

type Errors = VO.Errors.ControllerModel | VO.Errors.ProviderModel | VO.Errors.ServiceModel

export type Interface = {
    error: (errorToBeLogged: Errors) => Promise<void>
}