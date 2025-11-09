import type { UserNotificationsAPI } from "@/backend/controllers/user-notifications.controller"
import { apiRequest } from "@/client/utils/api-request.utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export type GET = UserNotificationsAPI['endpoints']['GET']
export type PATCH = UserNotificationsAPI['endpoints']['PATCH']

const endpoint = '/api/user-notifications'

export const useUserNotifications = () => {
    return useQuery<GET['response'], GET['error']>({
        queryKey: [endpoint],
        queryFn: () => {
            return apiRequest(endpoint, 'GET')({})
        }
    })
}

export const userUserNotificationReading = () => {
    const queryClient = useQueryClient()

    return useMutation<PATCH['response'], PATCH['error'], PATCH['payload']>({
        mutationFn: apiRequest(endpoint, 'PATCH'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [endpoint] })
        }
    })
}

export type UserNotificationDTO = UserNotificationsAPI['DTOs']['Notification']