import { SyndicationRequestDraftsAPI } from "@/controllers/syndication-request-drafts.controller";
import type { SyndicationRequestsAPI } from "@/controllers/syndication-requests.controller";
import { SyndicationRequestStatusNames } from "@/entities/sindycation-request-status.entity";
import { apiRequest, buildQueryString } from "@/lib/apiFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type API = SyndicationRequestsAPI;
const apiURL = '/api/syndication-requests';


export const useList = (
    query: Omit<API["GET"]["payload"]["query"], 'status'> & { status: SyndicationRequestStatusNames }
) => {
    return useQuery<API["GET"]["response"], API["GET"]["error"]>({
        queryKey: [
            "syndication-requests",
            "user",
            query
        ],
        queryFn: async () => {
            if (query.status === 'draft') {
                type DraftsAPI = SyndicationRequestDraftsAPI;
                const draftsApiURL = '/api/syndication-requests/drafts'

                const data: DraftsAPI['GET']['response'] = await apiRequest(draftsApiURL, 'GET')({ query })
                const mapper = (data: DraftsAPI['GET']['response']): API['GET']['response'] => {
                    return {
                        items: data.items.map((x) => {
                            return {
                                id: x.id,
                                make: x.make || "",
                                marketplaceLinks: [],
                                mileage: x.mileage || 0,
                                model: x.model || "",
                                photoLinks: x.currentPhotos?.map(x => x.id) ?? [],
                                price: x.price || 0,
                                vin: x.vin || '',
                                year: x.year || 0,
                                status: 'draft'
                            }
                        })
                    }
                }
                return mapper(data)
            }

            return apiRequest(apiURL, "GET")({ query });
        },
    });
};

export const useManualPosting = () => {
    const queryClient = useQueryClient()
    return useMutation<void, API['POST']['error'], API['POST']['payload']['query'] & { photos: File[] }>({
        mutationFn: async (payload) => {
            const formData = new FormData();

            for (const photo of payload.photos) {
                formData.append("photos", photo);
            }

            const { photos, ...queryData } = payload;
            await fetch(
                `${apiURL}${buildQueryString(queryData)}`,
                {
                    body: formData,
                    method: "POST",
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['syndication-requests'],
            })
        }
    })
}

export const usePostingFromDraft = () => {
    const queryClient = useQueryClient()

    return useMutation<API['FromDraft_POST']['response'], API['FromDraft_POST']['error'], API['FromDraft_POST']['payload']>({
        mutationFn: apiRequest(apiURL + '/from-draft', 'POST'),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['syndication-requests']
            })
        }
    })
}

export const useFilters = () => {
    return useQuery<API['Filters_GET']['response'], API['Filters_GET']['error']>({
        queryKey: ['syndication-requests', 'filters'],
        queryFn: () => {
            return apiRequest(apiURL + '/filters', 'GET')({})
        }
    })
}