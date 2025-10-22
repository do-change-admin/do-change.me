import { DIContainer } from "@/di-containers";

const controller = DIContainer().SyndicationRequestManagementController()

export const GET = controller.Filters_GET