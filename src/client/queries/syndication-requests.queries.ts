import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserSyndicationRequestDraftsAPI } from '@/backend/controllers/user-syndication-request-drafts';
import type { UserSyndicationRequestsAPI } from '@/backend/controllers/user-syndication-requests';
import { apiRequest } from '@/client/utils/api-request.utils';
import type { SyndicationRequestStatus } from '@/entities/syndication-request';

type API = UserSyndicationRequestsAPI['endpoints'];
const apiURL = '/api/user-syndication-requests';

export const useSyndicationRequests = (
    query: Omit<API['GET']['payload']['query'], 'status'> & {
        status: SyndicationRequestStatus | 'draft' | 'all active';
    }
) => {
    return useQuery<API['GET']['response'], API['GET']['error']>({
        queryKey: ['syndication-requests', 'user', query],
        queryFn: async () => {
            if (query.status === 'draft') {
                type DraftsAPI = UserSyndicationRequestDraftsAPI['endpoints'];
                const draftsApiURL = '/api/user-syndication-requests/drafts';

                const data: DraftsAPI['GET']['response'] = await apiRequest(draftsApiURL, 'GET')({ query });
                const mapper = (
                    data: DraftsAPI['GET']['response']['items'][number]
                ): API['GET']['response']['items'][number] => {
                    return {
                        additionalPhotoLinks: data.currentPhotos?.map((x) => x.url),
                        id: data.id,
                        mainPhotoLink: data.mainPhotoLink ?? '',
                        make: data.make ?? '',
                        marketplaceLinks: [],
                        mileage: data.mileage ?? 0,
                        model: data.model ?? '',
                        price: data.price ?? 0,
                        // @ts-expect-error status draft
                        status: 'draft',
                        userId: data.userId,
                        userMail: '',
                        vin: data.vin ?? '',
                        year: data.year ?? 0
                    };
                };
                return { items: data.items.map(mapper) };
            }

            return apiRequest(
                apiURL,
                'GET'
            )({
                query: {
                    ...query,
                    status: query.status === 'all active' ? undefined : query.status
                }
            });
        }
    });
};

export const useSyndicationRequestManualPosting = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void,
        API['POST']['error'],
        Omit<API['POST']['payload']['body'], 'mainPhotoId' | 'additionalPhotoIds'> & { photos: File[] }
    >({
        mutationFn: async (payload) => {
            const photoIds: string[] = [];
            for (const photo of payload.photos) {
                try {
                    const result = await fetch('/api/remote-pictures', {
                        method: 'POST'
                    });

                    const { id, uploadLink } = (await result.json()) as { id: string; uploadLink: string };

                    await fetch(uploadLink, {
                        body: photo,
                        method: 'PUT',
                        headers: {
                            'Content-Type': photo.type
                        }
                    });

                    photoIds.push(id);
                } catch (e) {
                    console.log(e);
                }
            }

            const { photos: _, ...queryData } = payload;

            const [mainPhotoId, ...additionalPhotoIds] = photoIds;

            await apiRequest(
                apiURL,
                'POST'
            )({
                body: {
                    ...queryData,
                    mainPhotoId: mainPhotoId || 'failed to upload',
                    additionalPhotoIds: additionalPhotoIds.filter((x) => typeof x === 'string') || []
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['syndication-requests', 'user']
            });
        }
    });
};

export const useSyndicationRequestPostingFromDraft = () => {
    const queryClient = useQueryClient();

    return useMutation<
        API['FromDraft_POST']['response'],
        API['FromDraft_POST']['error'],
        API['FromDraft_POST']['payload']
    >({
        mutationFn: apiRequest(`${apiURL}/create-from-draft`, 'POST'),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['syndication-requests', 'user']
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
