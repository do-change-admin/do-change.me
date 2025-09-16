import { AuctionAccessRequestsAPI } from "@/app/api/auction-access-requests/route"
import { apiRequest } from "@/lib/apiFetch"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

export const useAuctionAccessRequestCreation = () => {
    const queryClient = useQueryClient()
    return useMutation<AuctionAccessRequestsAPI['POST']['response'], AuctionAccessRequestsAPI['POST']['error'], AuctionAccessRequestsAPI['POST']['payload']>({
        mutationFn: apiRequest('/api/auction-access-requests', 'POST'),
        onSuccess: () => {
            queryClient.invalidateQueries({  queryKey: ['auction-access-user-data']})
        }
    })
}

export const useAuctionAccessRequest = () => {
    return useQuery<AuctionAccessRequestsAPI['GET']['response'], AuctionAccessRequestsAPI['GET']['error']>({
        queryKey: ['auction-access-user-data'],
        queryFn: () => {
            return apiRequest('/api/auction-access-requests', 'GET')({})
        }
    })
}