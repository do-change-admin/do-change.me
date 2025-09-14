import { ProfileAPI } from "@/app/api/profile/route"
import { apiRequest } from "@/lib/apiFetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useProfile = () => {
    return useQuery<ProfileAPI['GET']['response'], ProfileAPI['GET']['error']>({
        queryKey: ['profile'],
        queryFn: () => {
            return apiRequest('/api/profile', 'GET')({})
        }
    })
}

export const useProfileModifying = () => {
    const client = useQueryClient()
    return useMutation<ProfileAPI['PATCH']['response'], ProfileAPI['PATCH']['error'], ProfileAPI['PATCH']['payload']>({
        mutationFn: apiRequest('/api/profile', 'PATCH'),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['profile'] })
        }
    })
}