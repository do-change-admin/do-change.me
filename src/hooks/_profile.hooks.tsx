import { Profile_GET_Response, Profile_PATCH_Payload } from "@/app/api/profile/models"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useProfile = () => {
    return useQuery<Profile_GET_Response>({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await fetch('/api/profile');
            if (!res.ok) {
                throw await res.json();
            }
            return await res.json();
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
    });
};


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