import { DIContainer } from "@/backend/di-containers";

const controller = DIContainer().UserNotificationsManagementController()

export const GET = controller.AvaliableUsers_GET