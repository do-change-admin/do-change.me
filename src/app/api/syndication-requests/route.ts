import { DIContainer } from "@/backend/di-containers";

const controller = DIContainer().SyndicationRequestsController()

export const GET = controller.GET
export const POST = controller.POST
export const PATCH = controller.PATCH