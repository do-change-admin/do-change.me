import { AuctionAccessRequestsAPI } from "@/app/api/auction-access-requests/route"
import { apiRequest } from "@/lib/apiFetch"
import { useMutation } from "@tanstack/react-query"

export const useAuctionAccessRequestCreation = () => {
    return useMutation<AuctionAccessRequestsAPI['POST']['response'], AuctionAccessRequestsAPI['POST']['error'], AuctionAccessRequestsAPI['POST']['payload']>({
        mutationFn: apiRequest('/auction-access-requests', 'POST')
    })
}
