import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SyndicationRequestDraftsAPI } from '@/backend/controllers/syndication-request-drafts.controller';
import type { SyndicationRequestsAPI } from '@/backend/controllers/syndication-requests.controller';
import { apiRequest } from '@/client/utils/api-request.utils';
import type { SyndicationRequestStatusNames } from '@/entities/sindycation-request-status.entity';

type API = SyndicationRequestsAPI;
const apiURL = '/api/syndication-requests';

export const useSyndicationRequests = (
    query: Omit<API['GET']['payload']['query'], 'status'> & {
        status: SyndicationRequestStatusNames;
    }
) => {
    return useQuery<API['GET']['response'], API['GET']['error']>({
        queryKey: ['syndication-requests', 'user', query],
        queryFn: async () => {
            if (query.status === 'draft') {
                type DraftsAPI = SyndicationRequestDraftsAPI;
                const draftsApiURL = '/api/syndication-requests/drafts';

                const data: DraftsAPI['GET']['response'] = await apiRequest(draftsApiURL, 'GET')({ query });
                const mapper = (data: DraftsAPI['GET']['response']): API['GET']['response'] => {
                    return {
                        items: data.items.map((x) => {
                            return {
                                id: x.id,
                                make: x.make || '',
                                marketplaceLinks: [],
                                mileage: x.mileage || 0,
                                model: x.model || '',
                                photoLinks: x.currentPhotos?.map((x) => x.url) ?? [],
                                price: x.price || 0,
                                vin: x.vin || '',
                                year: x.year || 0,
                                status: 'draft',
                                createdAt: x.createdAt,
                                updatedAt: x.updatedAt
                            };
                        })
                    };
                };
                return mapper(data);
            }

            return apiRequest(apiURL, 'GET')({ query });
        }
    });
};

export const useSyndicationRequestManualPosting = () => {
    const queryClient = useQueryClient();
    return useMutation<void, API['POST']['error'], Omit<API['POST']['payload']['body'], 'photoIds'> & { photos: File[] }>({
        mutationFn: async (payload) => {
            const photoIds: string[] = [];
            for (const photo of payload.photos) {
                try {
                    const fileName = photo.name;
                    const fileType = photo.type;

                    const result = await fetch(apiURL, {
                        body: JSON.stringify({ fileName, fileType }),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'PATCH'
                    });

                    const { id, uploadUrl } = (await result.json()) as { id: string; uploadUrl: string };

                    const data = await fetch(uploadUrl, {
                        body: photo,
                        method: 'PUT',
                        headers: {
                            'Content-Type': photo.type
                        }
                    });

                    console.log(data);

                    photoIds.push(id);
                } catch (e) {
                    console.log(e);
                }
            }

            const {
                photos: [],
                ...queryData
            } = payload;

            await fetch(apiURL, {
                body: JSON.stringify({ ...queryData, photoIds }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['syndication-requests', 'user', { status: 'pending publisher' }]
            });
        }
    });
};

export const useSyndicationRequestPostingFromDraft = () => {
    const queryClient = useQueryClient();

    return useMutation<API['FromDraft_POST']['response'], API['FromDraft_POST']['error'], API['FromDraft_POST']['payload']>({
        mutationFn: apiRequest(`${apiURL}/from-draft`, 'POST'),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['syndication-requests', 'user', { status: 'pending publisher' }]
            });
            queryClient.invalidateQueries({
                queryKey: ['syndication-requests', 'user', { status: 'draft' }]
            });
        }
    });
};

export const useSyndicationRequestFilters = () => {
    return useQuery<API['Filters_GET']['response'], API['Filters_GET']['error']>({
        queryKey: ['syndication-requests', 'filters'],
        queryFn: () => {
            return apiRequest(`${apiURL}/filters`, 'GET')({});
        }
    });
};
