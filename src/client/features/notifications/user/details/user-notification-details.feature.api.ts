import { type UserNotificationsAPI } from "@/backend/controllers/user-notifications.controller"
import { apiRequest } from "@/client/utils/api-request.utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userNotificationsQueryKey } from "../notifications.user.feature.constants"

export type PATCH = UserNotificationsAPI['endpoints']['PATCH']

const endpoint = '/api/user-notifications'

export const useUserNotificationReading = () => {
    const queryClient = useQueryClient()

    return useMutation<PATCH['response'], PATCH['error'], PATCH['payload']>({
        mutationFn: apiRequest(endpoint, 'PATCH'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userNotificationsQueryKey })
        }
    })
}