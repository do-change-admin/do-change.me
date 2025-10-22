import type { SyndicationRequestManagementAPI } from "@/controllers/syndication-request-management.controller";
import { apiRequest } from "@/lib/apiFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type API = SyndicationRequestManagementAPI;
const apiURL = "/api/syndication-requests/management";

export const useList = (query: API["GET"]["payload"]["query"]) => {
    return useQuery<API["GET"]["response"], API["GET"]["error"]>({
        queryKey: ["syndication-requests", "management", query],
        queryFn: () => {
            return apiRequest(apiURL, "GET")({ query });
        },
    });
};

export const useDetails = (query: API["Details_GET"]["payload"]["query"]) => {
    return useQuery<
        API["Details_GET"]["response"],
        API["Details_GET"]["error"]
    >({
        queryKey: ["syndication-requests", "management", "details", query],
        queryFn: () => {
            return apiRequest(apiURL + "/details", "GET")({ query });
        },
        enabled: !!query.id,
    });
};

export const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation<
        API["PATCH"]["response"],
        API["PATCH"]["error"],
        API["PATCH"]["payload"]
    >({
        mutationFn: apiRequest(apiURL, "PATCH"),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["syndication-requests"],
            });
        },
    });
};

export const useFilters = () => {
    return useQuery<
        API["Filters_GET"]["response"],
        API["Filters_GET"]["error"]
    >({
        queryKey: ["syndication-requests", "management", "filters"],
        queryFn: () => {
            return apiRequest(apiURL + "/filters", "GET")({});
        },
    });
};
