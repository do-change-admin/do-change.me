import { DIContainer } from "@/backend/di-containers";

const controller = DIContainer().SyndicationRequestManagementController()

export const GET = controller.Filters_GET