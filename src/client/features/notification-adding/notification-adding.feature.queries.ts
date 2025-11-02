import type { UserNotificationsManagementAPI } from "@/backend/controllers/user-notifications-management.controller";
import { apiRequest } from "@/client/utils/api-request.utils";
import { useMutation } from "@tanstack/react-query";

type POST = UserNotificationsManagementAPI['POST']
const endpoint = '/api/user-notifications/management'

export const useNotificationAdding = () => {
    return useMutation<POST['response'], POST['error'], POST['payload']>({
        mutationFn: apiRequest(endpoint, 'POST')
    })
}