import { DIContainer } from "@/di-containers";

const controller = DIContainer().SyndicationRequestManagementController()

export const GET = controller.GET
export const PATCH = controller.PATCH