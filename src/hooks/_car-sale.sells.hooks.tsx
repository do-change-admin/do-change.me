import { CarSaleSellsDetailAPI } from "@/app/api/car-sale/sells/details/route";
import { CarSaleSellsAPI } from "@/app/api/car-sale/sells/route";
import { CarSaleStatus } from "@/entities";
import { apiRequest } from "@/lib/apiFetch";
import { PaginationModel } from "@/value-objects";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type API = CarSaleSellsAPI
type DetailsAPI = CarSaleSellsDetailAPI

const apiURL = '/api/car-sale/sells'
const detailsApiURL = '/api/car-sale/sells/details'

export const useCarsForSaleSellsList = (pagination: PaginationModel, filters?: {
    userId?: string, status?: CarSaleStatus
}) => {
    return useQuery<API['GET']['response'], API['GET']['error']>({
        queryKey: ['cars-for-sale', 'sells', 'list'],
        queryFn: () => {
            return apiRequest(apiURL, 'GET')({
                query: {
                    pageSize: pagination.pageSize,
                    zeroBasedIndex: pagination.zeroBasedIndex,
                    status: filters?.status,
                    userId: filters?.userId
                }
            } satisfies API['GET']['payload'])
        }
    })
}

export const useCarForSaleSellsDetail = (id: string, userId: string) => {
    return useQuery<DetailsAPI['GET']['response'], DetailsAPI['GET']['error']>({
        queryKey: ['cars-for-sale', 'sells', 'details', id],
        queryFn: () => {
            return apiRequest(detailsApiURL, 'GET')({
                query: {
                    id,
                    userId
                }
            } satisfies DetailsAPI['GET']['payload'])
        }
    })
}

export const useCarSaleStatusChange = () => {
    const queryClient = useQueryClient()

    return useMutation<API['PATCH']['response'], API['PATCH']['error'], API['PATCH']['payload']>({
        mutationFn: apiRequest(apiURL, 'PATCH'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars-for-sale', 'sells'] })
        }
    })
}