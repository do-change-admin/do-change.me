import { AuctionAccessRequestAdminCountAPI } from "@/app/api/admin/auction-access-requests/count/route"
import { AuctionAccessRequestsDetailsAdminAPI } from "@/app/api/admin/auction-access-requests/details/route"
import { AuctionAccessRequestsAdminAPI } from "@/app/api/admin/auction-access-requests/route"
import { AuctionAccessRequestsSetStatusAdminAPI } from "@/app/api/admin/auction-access-requests/set-status/route"
import { apiRequest } from "@/lib/apiFetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useAdminAuctionAccessRequests = (query: AuctionAccessRequestsAdminAPI['GET']['payload']['query']) => {
    return useQuery<AuctionAccessRequestsAdminAPI['GET']['response'], AuctionAccessRequestsAdminAPI['GET']['error']>({
        queryKey: ['auction-access-requests', query.status, query.skip, query.take],
        queryFn: () => {
            return apiRequest('/api/admin/auction-access-requests', 'GET')({ query })
        }
    })
}

export const useAdminAuctionAccessRequest = (query: AuctionAccessRequestsDetailsAdminAPI['GET']['payload']['query']) => {
    return useQuery<AuctionAccessRequestsDetailsAdminAPI['GET']['response'], AuctionAccessRequestsDetailsAdminAPI['GET']['error']>({
        queryKey: ['auction-access-requests', 'full', query.id],
        queryFn: () => {
            return apiRequest('/api/admin/auction-access-requests/details', 'GET')({ query })
        }
    })
}

export const useAdminAuctionAccessRequestUpdate = () => {
    const client = useQueryClient()

    return useMutation<AuctionAccessRequestsAdminAPI['PATCH']['response'], AuctionAccessRequestsAdminAPI['PATCH']['error'], AuctionAccessRequestsAdminAPI['PATCH']['payload']>({
        mutationFn: apiRequest('/api/admin/auction-access-requests', 'PATCH'),
        onSuccess: (s, { body: { id } }) => {
            client.invalidateQueries({ queryKey: ['auction-access-requests', 'full', id] })
            client.invalidateQueries({ queryKey: ['auction-access-requests', 'count'] })
        }
    })
}

export const useAdminAuctionAccessStatusSetting = () => {
    const client = useQueryClient()

    return useMutation<AuctionAccessRequestsSetStatusAdminAPI['PATCH']["response"], AuctionAccessRequestsSetStatusAdminAPI['PATCH']["error"], AuctionAccessRequestsSetStatusAdminAPI['PATCH']["payload"]>({
        mutationFn: apiRequest('/api/admin/auction-access-requests/set-status', 'PATCH'),
        onSuccess: (s, { query: { id } }) => {
            client.invalidateQueries({ queryKey: ['auction-access-requests', 'full', id] })
            client.invalidateQueries({ queryKey: ['auction-access-requests', 'count'] })
        }
    })
}

export const useAdminAuctionAccessFinalizing = () => {
    const client = useQueryClient()

    return useMutation<void, void, { id: string, qr: File, auctionAccessNumber: string }>({
        mutationFn: async (payload) => {
            const formData = new FormData()
            formData.set("qr", payload.qr)
            formData.set("number", payload.auctionAccessNumber)
            await fetch('/api/admin/auction-access-requests/finalize?id=' + payload.id, {
                body: formData,
                method: "POST"
            })
        },
        onSuccess: (s, { id }) => {
            client.invalidateQueries({ queryKey: ['auction-access-requests', 'full', id] })
            client.invalidateQueries({ queryKey: ['auction-access-requests', 'count'] })
        }
    })
}

export const useAdminAuctionAccessCount = () => {
    return useQuery<AuctionAccessRequestAdminCountAPI['GET']['response'], AuctionAccessRequestAdminCountAPI['GET']['error']>({
        queryKey: ['auction-access-requests', 'count'],
        queryFn: () => {
            return apiRequest('/api/admin/auction-access-requests/count', 'GET')({})
        }
    })
}