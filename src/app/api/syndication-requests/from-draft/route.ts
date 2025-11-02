import { DIContainer } from "@/backend/di-containers";

const controller = DIContainer().SyndicationRequestsController()

export const POST = controller.FromDraft_POST