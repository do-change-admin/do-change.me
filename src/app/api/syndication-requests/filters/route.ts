import { DIContainer } from "@/backend/di-containers";

const controller = DIContainer().SyndicationRequestsController()

export const GET = controller.Filters_GET