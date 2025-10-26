import { SubscriptionsAPI } from "@/app/api/subscriptions/route";
import { apiRequest } from "@/client/utils/apiFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type API = SubscriptionsAPI

export const useSubscriptionCreation = () => {
    const queryClient = useQueryClient()
    return useMutation<API['POST']['response'], API['POST']['error'], API['POST']['payload']>({
        mutationFn: apiRequest('/api/subscriptions', 'POST'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        }
    })
}

export const useSubscriptionDeletion = () => {
    const queryClient = useQueryClient()
    return useMutation<API['DELETE']['response'], API['DELETE']['error'], API['DELETE']['payload']>({
        mutationFn: apiRequest('/api/subscriptions', 'DELETE'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        }
    })

}