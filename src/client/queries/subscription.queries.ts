import type { SubscriptionsAPI } from "@/backend/controllers/subscriptions.controller"
import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "../utils/api-request.utils"

type CurrentInfo_GET = SubscriptionsAPI['endpoints']['CurrentInfo_GET']

const endpoint = '/api/subscriptions/current-info'

export const useCurrentSubscriptionInfo = () => {
    return useQuery<CurrentInfo_GET['response'], CurrentInfo_GET['error']>({
        queryKey: [endpoint],
        queryFn: () => {
            return apiRequest(endpoint, 'GET')({})
        }
    })
}