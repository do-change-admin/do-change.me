import { DIContainer } from "@/di-containers";

const controller = DIContainer().SyndicationRequestDraftsController()

export const GET = controller.GET
export const POST = controller.POST
export const PATCH = controller.PATCH