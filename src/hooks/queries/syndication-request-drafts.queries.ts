import type { SyndicationRequestDraftsAPI } from "@/controllers/syndication-request-drafts.controller"
import { apiRequest, buildQueryString } from "@/lib/apiFetch"
import { useMutation, useQuery } from "@tanstack/react-query"

type API = SyndicationRequestDraftsAPI
const apiURL = '/api/syndication-requests/drafts'

export const useCreation = () => { // <- useCarForSaleDraftCreation
    return useMutation<void, API['POST']['error'], API['POST']['payload']['query'] & { photos?: File[] }>({
        mutationFn: async (payload) => {
            const formData = new FormData();

            for (const photo of payload.photos ?? []) {
                formData.append("photos", photo);
            }

            const { photos, ...queryData } = payload

            await fetch(
                `${apiURL}${buildQueryString(queryData)}`,
                {
                    body: formData,
                    method: "POST",
                }
            );

        }
    })
}

export const useUpdate = () => { // <- useCarForSaleDraftUpdate
    return useMutation<void, API['PATCH']['error'], API['PATCH']['payload']['query'] & { photos?: File[] }>({
        mutationFn: async (payload) => {
            const formData = new FormData();

            for (const photo of payload.photos ?? []) {
                formData.append("photos", photo);
            }

            const { photos, ...queryData } = payload

            await fetch(
                `${apiURL}${buildQueryString(queryData)}`,
                {
                    body: formData,
                    method: "PATCH",
                }
            );

        }
    })
}

export const useDetails = (draftId: string | null) => { // <- useCarForSaleDraftDetail
    return useQuery<API['Details_GET']['response'], API['Details_GET']['error']>({
        queryKey: ['syndication-requests', 'drafts', 'details', draftId],
        queryFn: () => {
            return apiRequest(apiURL + '/details', 'GET')({
                query: {
                    id: draftId!
                }
            } satisfies API['Details_GET']['payload'])
        },
        enabled: !!draftId
    })
}   