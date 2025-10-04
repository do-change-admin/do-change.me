import { CarSaleUserDetailsAPI } from "@/app/api/car-sale/user/details/route";
import { CarSaleUserAPI } from "@/app/api/car-sale/user/route";
import { CarSaleStatus } from "@/entities";
import { apiRequest } from "@/lib/apiFetch";
import { PaginationModel } from "@/value-objects";
import { useMutation, useQuery } from "@tanstack/react-query";

type API = CarSaleUserAPI
type DetailsAPI = CarSaleUserDetailsAPI

const apiURL = '/api/car-sale/user'
const detailsApiURL = '/api/car-sale/user/details'

export const useCarsForSaleUserList = (pagination: PaginationModel, status?: CarSaleStatus) => {
    return useQuery<API['GET']['response'], API['GET']['error']>({
        queryKey: ['cars-for-sale', 'user', 'list', status, pagination.zeroBasedIndex, pagination.pageSize],
        queryFn: () => {
            return apiRequest(apiURL, 'GET')({
                query: {
                    pageSize: pagination.pageSize,
                    zeroBasedIndex: pagination.zeroBasedIndex,
                    status
                }
            } satisfies API['GET']['payload'])
        }
    })
}

export const useCarForSaleUserPosting = () => {
    return useMutation<void, API['POST']['error'], {
        mileage: number;
        licencePlate: string;
        photo: File
    }>({
        mutationFn: async (payload) => {
            const formData = new FormData()

            formData.set("photo", payload.photo)

            await fetch(`${apiURL}?mileage=${payload.mileage}&licencePlatem=${payload.licencePlate}`, {
                body: formData,
                method: "POST"
            })
        }
    })
}

export const useCarForSaleUserDetail = (id: string) => {
    return useQuery<DetailsAPI['GET']['response'], DetailsAPI['GET']['error']>({
        queryKey: ['cars-for-sale', 'user', 'details', id],
        queryFn: () => {
            return apiRequest(detailsApiURL, 'GET')({
                query: {
                    id
                }
            } satisfies DetailsAPI['GET']['payload'])
        },
        enabled: !!id
    })
}
