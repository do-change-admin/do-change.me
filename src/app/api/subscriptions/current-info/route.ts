import { DIContainer } from "@/backend/di-containers"

const controller = DIContainer().SubscriptionsController()

export const GET = controller.CurrentInfo_GET