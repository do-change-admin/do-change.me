import type { UserNotificationsAPI } from "@/backend/controllers/user-notifications.controller"
import { apiRequest } from "@/client/utils/api-request.utils"
import { useQuery } from "@tanstack/react-query"
import { userNotificationsQueryKey } from "../notifications.user.feature.constants"

export type GET = UserNotificationsAPI['endpoints']['GET']
export type PATCH = UserNotificationsAPI['endpoints']['PATCH']

const endpoint = '/api/user-notifications'

export const useUserNotifications = () => {
    return useQuery<GET['response'], GET['error']>({
        queryKey: userNotificationsQueryKey,
        queryFn: () => {
            return apiRequest(endpoint, 'GET')({})
        }
    })
}

export const useUnreadNotificationsCount = () => {
    const { data, isFetching }  = useUserNotifications()

    return { isFetching, count: data?.items?.filter(x => !x.seen)?.length ?? 0 }
}