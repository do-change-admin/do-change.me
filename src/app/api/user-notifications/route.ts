import { DIContainer } from "@/backend/di-containers";

const controller = DIContainer().UserNotificationsController()

export const GET = controller.GET
export const PATCH = controller.PATCH