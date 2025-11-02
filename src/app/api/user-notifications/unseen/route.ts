import { DIContainer } from "@/backend/di-containers"

const controller = DIContainer().UserNotificationsController()

export const GET = controller.Unseen_GET