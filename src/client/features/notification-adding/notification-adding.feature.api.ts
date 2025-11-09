import type { UserNotificationsManagementAPI } from "@/backend/controllers/user-notifications-management.controller";
import { apiRequest } from "@/client/utils/api-request.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type POST = UserNotificationsManagementAPI['endpoints']['POST']
const endpoint = '/api/user-notifications/management'

export const useNotificationAdding = () => {
    const queryClient = useQueryClient()
    return useMutation<POST['response'], POST['error'], POST['payload']>({
        mutationFn: apiRequest(endpoint, 'POST'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [endpoint] })
        }
    })
}

export type NotificationDTO = UserNotificationsManagementAPI['DTOs']['Notification']