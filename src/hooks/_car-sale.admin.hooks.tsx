import { CarSaleSellsDetailAPI } from "@/app/api/car-sale/admin/details/route";
import { CarSaleSellsAPI } from "@/app/api/car-sale/admin/route";
import { apiRequest } from "@/lib/apiFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type API = CarSaleSellsAPI;
type DetailsAPI = CarSaleSellsDetailAPI;

const apiURL = "/api/car-sale/admin";
const detailsApiURL = "/api/car-sale/admin/details";

export const useCarsForSaleAdminList = (
    queryPayload: API["GET"]["payload"]["query"]
) => {
    return useQuery<API["GET"]["response"], API["GET"]["error"]>({
        queryKey: [
            "cars-for-sale",
            "sells",
            "list",
            queryPayload.status || "all",
            queryPayload,
        ],
        queryFn: () => {
            return apiRequest(
                apiURL,
                "GET"
            )({
                query: queryPayload,
            });
        },
    });
};

export const useCarForSaleAdminDetail = (id: string, userId: string) => {
    return useQuery<DetailsAPI["GET"]["response"], DetailsAPI["GET"]["error"]>({
        queryKey: ["cars-for-sale", "sells", "details", id],
        queryFn: () => {
            return apiRequest(
                detailsApiURL,
                "GET"
            )({
                query: {
                    id,
                    userId,
                },
            } satisfies DetailsAPI["GET"]["payload"]);
        },
    });
};

export const useCarsForSaleAdminFilters = () => {
    return {
        data: { models: ["Mustang", "F-100"], makes: ["BMW", "Audi"] },
        isLoading: false,
        isFetching: false,
    };
};

export const useCarForSaleUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation<
        API["PATCH"]["response"],
        API["PATCH"]["error"],
        API["PATCH"]["payload"]
    >({
        mutationFn: apiRequest(apiURL, "PATCH"),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cars-for-sale", "sells"],
            });
        },
    });
};
