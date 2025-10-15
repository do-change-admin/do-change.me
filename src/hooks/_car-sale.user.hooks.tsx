import type { CarSaleUserDraftDetailsAPI } from "@/app/api/car-sale/user/drafts/route";
import type { Controllers } from "@/controllers";
import { apiRequest, buildQueryString } from "@/lib/apiFetch";
import type { Services } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type API = Controllers.CarSale.User.API;
type DraftsAPI = CarSaleUserDraftDetailsAPI;

const apiURL = "/api/car-sale/user";
const draftsApiURL = "/api/car-sale/user/drafts";

export const useCarsForSaleUserList = (
    queryPayload: API["GET"]["payload"]["query"]
) => {
    return useQuery<API["GET"]["response"], API["GET"]["error"]>({
        queryKey: [
            "cars-for-sale",
            "user",
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
            } satisfies API["GET"]["payload"]);
        },
    });
};

export const useCarForSaleUserPosting = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void,
        API["POST"]["error"],
        Services.CarSaleUser.PostCarPayload
    >({
        mutationFn: async (payload) => {
            const formData = new FormData();

            for (const photo of payload.photos) {
                formData.append("photos", photo);
            }

            const { make, mileage, model, price, vin, year } = payload;
            await fetch(
                `${apiURL}${buildQueryString({
                    make,
                    mileage,
                    model,
                    price,
                    vin,
                    year,
                })}`,
                {
                    body: formData,
                    method: "POST",
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cars-for-sale", "user"],
            });
        },
    });
};

export const useCarsForSaleUserFilters = () => {
    return {
        data: { models: ["Mustang", "F-100"], makes: ["BMW", "Audi"] },
        isLoading: false,
        isFetching: false,
    };
};

export const useCarForSaleDraftDetail = (
    query: DraftsAPI["GET"]["payload"]["query"]
) => {
    return useQuery<DraftsAPI["GET"]["response"], DraftsAPI["GET"]["error"]>({
        queryKey: ["cars-for-sale", "user", "drafts", query.id],
        queryFn: () => {
            return apiRequest(draftsApiURL, "GET")({ query });
        },
        enabled: () => {
            return !!query.id;
        },
    });
};

export const useCarForSaleDraftCreation = () => {
    return useMutation<
        void,
        DraftsAPI["POST"]["error"],
        Services.CarSaleUser.CreateDraftPayload
    >({
        mutationFn: async (variables) => {
            const formData = new FormData();

            if (variables.photos && variables.photos.length) {
                for (const photo of variables.photos) {
                    formData.append("photos", photo);
                }
            }

            const { make, mileage, model, price, vin, year } = variables;
            await fetch(
                `${draftsApiURL}${buildQueryString({
                    make,
                    mileage,
                    model,
                    price,
                    vin,
                    year,
                })}`,
                {
                    body: formData,
                    method: "POST",
                }
            );
        },
    });
};

export const useCarForSaleDraftUpdate = () => {
    return useMutation<
        void,
        DraftsAPI["PATCH"]["error"],
        Services.CarSaleUser.UpdateDraftPayload
    >({
        mutationFn: async (variables) => {
            const formData = new FormData();

            if (variables.newPhotos && variables.newPhotos.length) {
                for (const photo of variables.newPhotos) {
                    formData.append("photos", photo);
                }
            }

            console.log("variables", variables);

            const {
                make,
                mileage,
                model,
                price,
                vin,
                year,
                removedPhotoIds,
                id,
            } = variables;
            await fetch(
                `${draftsApiURL}${buildQueryString({
                    make,
                    mileage,
                    model,
                    price,
                    vin,
                    year,
                    removedPhotoIds,
                    id,
                })}`,
                {
                    body: formData,
                    method: "PATCH",
                }
            );
        },
    });
};
