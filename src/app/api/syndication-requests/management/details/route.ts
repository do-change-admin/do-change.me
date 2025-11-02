import { DIContainer } from "@/backend/di-containers";

const controller = DIContainer().SyndicationRequestManagementController()

export const GET = controller.Details_GET