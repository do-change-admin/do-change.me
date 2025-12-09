import { type UserNotificationsManagementAPI } from "@/backend/controllers/user-notifications-management.controller"
import { apiRequest } from "@/client/utils/api-request.utils"
import { useQuery } from "@tanstack/react-query"
import { allNotificationsListQueryKey } from "../notifications.management.feature.constants"

type GET = UserNotificationsManagementAPI['endpoints']['GET']
const endpoint = '/api/user-notifications/management'

export const useNotificationsAdminList = () => {
    return useQuery<GET['response'], GET['error']>({
        queryKey: allNotificationsListQueryKey,
        queryFn: () => {
            return apiRequest(endpoint, 'GET')({})
        }
    })
}

export type AdminNotificationDTO = UserNotificationsManagementAPI['DTOs']['Notification']