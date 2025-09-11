import { ProfileAPI, profileAPIEndpoint } from "@/app/api/profile/route"
import { apiRequest } from "@/lib/apiFetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useProfile = () => {
    return useQuery<ProfileAPI['GET']['response'], ProfileAPI['GET']['error']>({
        queryKey: ['profile'],
        queryFn: () => {
            return apiRequest(profileAPIEndpoint, 'GET')({})
        }
    })
}

export const useProfileModifying = () => {
    const client = useQueryClient()
    return useMutation<ProfileAPI['PATCH']['response'], ProfileAPI['PATCH']['error'], ProfileAPI['PATCH']['payload']>({
        mutationFn: apiRequest(profileAPIEndpoint, 'PATCH'),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['profile'] })
        }
    })
}