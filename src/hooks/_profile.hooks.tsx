import { Profile_GET_Response, Profile_PATCH_Payload } from "@/app/api/profile/models"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useProfile = () => {
    return useQuery<Profile_GET_Response>({
        queryKey: ['profile'],
        queryFn: async () => {
            const data = await fetch('/api/profile')
            if (!data.ok) {
                throw await data.json()
            }
            return await data.json()
        }
    })
}

export const useProfileModifying = () => {
    const client = useQueryClient()
    return useMutation<void, Error, Profile_PATCH_Payload>({
        mutationFn: async (payload) => {
            const result = await fetch('/api/profile', {
                method: "PATCH",
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
            })
            if (!result.ok) {
                throw  await result.json()
            }
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['profile'] })
        }
    })
}