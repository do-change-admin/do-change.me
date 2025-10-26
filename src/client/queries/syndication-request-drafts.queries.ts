import type { SyndicationRequestDraftsAPI } from "@/backend/controllers/syndication-request-drafts.controller";
import { apiRequest, buildQueryString } from "@/client/utils/apiFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type API = SyndicationRequestDraftsAPI;
const apiURL = "/api/syndication-requests/drafts";

export const useSyndicationRequestDraftCreation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        API["POST"]["error"],
        API["POST"]["payload"]["query"] & { photos?: File[] }
    >({
        mutationFn: async (payload) => {
            const formData = new FormData();

            for (const photo of payload.photos ?? []) {
                formData.append("photos", photo);
            }

            const { photos, ...queryData } = payload;

            await fetch(`${apiURL}${buildQueryString(queryData)}`, {
                body: formData,
                method: "POST",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["syndication-requests", "user", { status: "draft" }],
            });
        },
    });
};

export const useSyndicationRequestDraftUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        API["PATCH"]["error"],
        API["PATCH"]["payload"]["query"] & { photos?: File[] }
    >({
        mutationFn: async (payload) => {
            const formData = new FormData();

            for (const photo of payload.photos ?? []) {
                formData.append("photos", photo);
            }

            const { photos, ...queryData } = payload;

            await fetch(`${apiURL}${buildQueryString(queryData)}`, {
                body: formData,
                method: "PATCH",
            });
        },
        onSuccess: (_, payload) => {
            queryClient.invalidateQueries({
                queryKey: ["syndication-requests", "user", { status: "draft" }],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "syndication-requests",
                    "drafts",
                    "details",
                    payload.id,
                ],
            });
        },
    });
};

export const useSyndicationRequestDraftDetails = (draftId: string | null) => {
    return useQuery<
        API["Details_GET"]["response"],
        API["Details_GET"]["error"]
    >({
        queryKey: ["syndication-requests", "drafts", "details", draftId],
        queryFn: () => {
            return apiRequest(
                apiURL + "/details",
                "GET"
            )({
                query: {
                    id: draftId!,
                },
            } satisfies API["Details_GET"]["payload"]);
        },
        enabled: !!draftId,
    });
};
