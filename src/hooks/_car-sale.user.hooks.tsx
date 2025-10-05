import { CarSaleUserAPI } from "@/app/api/car-sale/user/route";
import { CarSaleStatus } from "@/entities";
import { apiRequest, buildQueryString } from "@/lib/apiFetch";
import { PostCarForSaleUserServicePayload } from "@/services";
import { PaginationModel } from "@/value-objects";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type API = CarSaleUserAPI

const apiURL = '/api/car-sale/user'

export const useCarsForSaleUserList = (queryPayload: API['GET']['payload']['query']) => {
    return useQuery<API['GET']['response'], API['GET']['error']>({
        queryKey: ['cars-for-sale', 'user', 'list', queryPayload.status || 'all', queryPayload],
        queryFn: () => {
            return apiRequest(apiURL, 'GET')({
                query: queryPayload
            } satisfies API['GET']['payload'])
        }
    })
}

export const useCarForSaleUserPosting = () => {
    const queryClient = useQueryClient()
    return useMutation<void, API['POST']['error'], PostCarForSaleUserServicePayload>({
        mutationFn: async (payload) => {
            const formData = new FormData()

            for (const photo of payload.photos) {
                formData.append('photos', photo)
            }

            const { make, mileage, model, price, vin, year } = payload
            await fetch(`${apiURL}${buildQueryString({ make, mileage, model, price, vin, year })}`, {
                body: formData,
                method: "POST"
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['cars-for-sale', 'user']
            })
        }
    })
}