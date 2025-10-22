import { DIContainer } from "@/di-containers";

const controller = DIContainer().SyndicationRequestsController()

export const POST = controller.FromDraft_POST