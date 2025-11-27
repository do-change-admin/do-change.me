import type { UserNotificationsManagementAPI } from "@/backend/controllers/user-notifications-management.controller";
import { apiRequest } from "@/client/utils/api-request.utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { allNotificationsListQueryKey } from "../notifications.management.feature.constants";

type POST = UserNotificationsManagementAPI['endpoints']['POST']
const endpoint = '/api/user-notifications/management'

export const useNotificationAdding = () => {
    const queryClient = useQueryClient()
    return useMutation<POST['response'], POST['error'], POST['payload']>({
        mutationFn: apiRequest(endpoint, 'POST'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: allNotificationsListQueryKey })
        }
    })
}

type Users_GET = UserNotificationsManagementAPI['endpoints']['AvailableUsers_GET']
const usersEndpoint = '/api/user-notifications/management/available-users'

export const useAvailableUsers = () => {
    return useQuery<Users_GET['response'], Users_GET['error']>({
        queryKey: [usersEndpoint],
        queryFn: () => {
            return apiRequest(usersEndpoint, 'GET')({})
        }
    })
}

export type NotificationDTO = UserNotificationsManagementAPI['DTOs']['Notification']