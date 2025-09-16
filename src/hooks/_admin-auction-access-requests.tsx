import { AuctionAccessRequestsAdminAPI } from "@/app/api/admin/auction-access-requests/route"
import { apiRequest } from "@/lib/apiFetch"
import { useQuery } from "@tanstack/react-query"

export const useAdminAuctionAccessRequests = (query: AuctionAccessRequestsAdminAPI['GET']['payload']['query']) => {
    return useQuery<AuctionAccessRequestsAdminAPI['GET']['response'], AuctionAccessRequestsAdminAPI['GET']['error']>({
        queryKey: ['auction-access-requests', query.status, query.skip, query.take],
        queryFn: () => {
            return apiRequest('/api/admin/auction-access-requests', 'GET')({ query })
        }
    })
}