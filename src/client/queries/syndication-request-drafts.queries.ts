import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserSyndicationRequestDraftsAPI } from '@/backend/controllers/user-syndication-request-drafts';
import { apiRequest } from '@/client/utils/api-request.utils';

type API = UserSyndicationRequestDraftsAPI['endpoints'];
const apiURL = '/api/user-syndication-requests/drafts';

export const useSyndicationRequestDraftCreation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        API['POST']['error'],
        Omit<API['POST']['payload']['body'], 'mainPhotoId' | 'additionalPhotoIds'> & { photos?: File[] }
    >({
        mutationFn: async (payload) => {
            const photoIds = [] as string[];

            for (const photo of payload.photos ?? []) {
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

            console.log({
                ...queryData
                // mainPhotoId,
                // additionalPhotoIds
            });

            await apiRequest(
                apiURL,
                'POST'
            )({
                body: {
                    ...queryData,
                    mainPhotoId,
                    additionalPhotoIds
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['syndication-requests', 'user', { status: 'draft' }]
            });
        }
    });
};

export const useSyndicationRequestDraftUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        API['PATCH']['error'],
        Omit<API['PATCH']['payload']['body'], 'mainPhotoId' | 'additionalPhotoIds'> & { photos?: File[] }
    >({
        mutationFn: async (payload) => {
            const photoIds = [] as string[];

            for (const photo of payload.photos ?? []) {
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
                'PATCH'
            )({
                body: { ...queryData, mainPhotoId, additionalPhotoIds }
            });
        },
        onSuccess: (_, payload) => {
            queryClient.invalidateQueries({
                queryKey: ['syndication-requests', 'user', { status: 'draft' }]
            });
            queryClient.invalidateQueries({
                queryKey: ['syndication-requests', 'drafts', 'details', payload.id]
            });
        }
    });
};

export const useSyndicationRequestDraftDetails = (draftId: string | null) => {
    return useQuery<API['Details_GET']['response'], API['Details_GET']['error']>({
        queryKey: ['syndication-requests', 'drafts', 'details', draftId],
        queryFn: () => {
            return apiRequest(
                `${apiURL}/details`,
                'GET'
            )({
                query: {
                    id: draftId!
                }
            } satisfies API['Details_GET']['payload']);
        },
        enabled: !!draftId
    });
};
