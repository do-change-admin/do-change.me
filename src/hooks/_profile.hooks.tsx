import { ProfileAPI } from "@/app/api/profile/route"
import { apiRequest } from "@/lib/apiFetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useProfile = () => {
    return useQuery<ProfileAPI['GET']['response'], ProfileAPI['GET']['error']>({
        queryKey: ['profile'],
        queryFn: () => {
            return apiRequest('/api/profile', 'GET')({})
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
    })
}

export const useProfileModifying = () => {
    const client = useQueryClient()
    return useMutation<ProfileAPI['PATCH']['response'], ProfileAPI['PATCH']['error'], ProfileAPI['PATCH']['payload']>({
        mutationFn: apiRequest('/api/profile', 'PATCH'),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['profile'] })
        },
    })
}


export function useUploadPhoto() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async function (file: File) {
            const formData = new FormData();
            formData.set("photo", file);

            const response = await fetch("/api/profile/photo", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload photo");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}