import { DIContainer } from "@/di-containers";

const controller = DIContainer().SyndicationRequestDraftsController()

export const GET = controller.Details_GET