import type {UserNotificationsAPI} from "@/backend/controllers/user-notifications.controller";
import {useQuery} from "@tanstack/react-query";
import {apiRequest} from "@/client/utils/api-request.utils";

export type GET = UserNotificationsAPI['endpoints']['GET']
export type PATCH = UserNotificationsAPI['endpoints']['PATCH']

const endpoint = '/api/user-notifications'

export const useUnreadNotificationsCount = () => {
    const resp = useQuery<GET['response'], GET['error']>({
        queryKey: [endpoint],
        queryFn: () => {
            return apiRequest(endpoint, 'GET')({})
        }
    })

    const count = resp.data?.items.filter((notification) => !notification.seen).length ?? 0
    return {count, isFetching: resp.isFetching}
}
