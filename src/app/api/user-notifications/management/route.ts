import { DIContainer } from "@/backend/di-containers";

const controller = DIContainer().UserNotificationsManagementController()

export const POST = controller.POST
export const GET = controller.GET