import { DIContainer } from "@/di-containers";

const controller = DIContainer().SyndicationRequestsController()

export const GET = controller.Filters_GET