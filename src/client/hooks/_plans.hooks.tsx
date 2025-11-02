import { PlansAPI } from "@/app/api/plans/route";
import { apiRequest } from "@/client/utils/api-request.utils";
import { useQuery } from "@tanstack/react-query";

type API = PlansAPI

export const usePlans = () => {
    return useQuery<API['GET']['response'], API['GET']['error']>({
        queryKey: ['subscription', 'plans'],
        queryFn: () => apiRequest('/api/plans', "GET")({})
    })
}