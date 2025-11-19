import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { VehicleBaseInfoDTO } from "@/app/api/vin/base-info/models";
import { ActionsHistoryService } from "@/backend/services";
import { CachedData_GET_Response } from "@/app/api/vin/cached-data/models";
import { MarketValueAPI } from "@/app/api/vin/market-value/route";
import { apiRequest } from "@/client/utils/api-request.utils";
import { ReportsAPI } from "@/app/api/vin/report/route";
import { SalvageAPI } from "@/app/api/vin/salvage/route";
import { VIN } from "@/value-objects/vin.value-object";

const VIN_LENGTH = 17;

export const useBaseInfoByVIN = (vin: string | null) => {
    const isEnabled = VIN.schema.safeParse(vin).success;

    return useQuery<VehicleBaseInfoDTO>({
        queryKey: ["vinCheck", vin],
        queryFn: async () => {
            if (!vin) {
                throw new Error("VIN was not provided");
            }
            if (vin.length !== VIN_LENGTH) {
                throw new Error("VIN length must be 17 symbols");
            }

            const response = await fetch(`/api/vin/base-info?vin=${vin}`);
            if (!response.ok) {
                throw new Error(
                    `Request failed with status ${response.status}`
                );
            }

            return await response.json();
        },
        enabled: isEnabled,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};

export const useMileagePriceQuery = (
    vin: string | null,
    mileage: number | undefined
) => {
    return useQuery<
        MarketValueAPI["GET"]["response"],
        MarketValueAPI["GET"]["error"]
    >({
        queryKey: ["mileagePrice", vin, mileage],
        queryFn: () =>
            apiRequest(
                "/api/vin/market-value",
                "GET"
            )({ query: { vin, mileage } }),
        enabled: () => {
            if (!mileage) {
                return false
            }
            const { success } = VIN.schema.safeParse(vin);
            if (!success) {
                return false;
            }

            return true;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
};



export const useMarketCheckPriceQuery = (
    vin: string | null,
    mileage: number | string
) => {

    return useQuery({
        queryKey: ["marketcheckPrice", vin, mileage],

        queryFn: async () => {
            const url = new URL(
                "https://api.marketcheck.com/v2/predict/car/us/marketcheck_price/comparables/decode"
            );

            url.searchParams.set("api_key", "JHyfx78TdLsZLcoQaJEUBuAADcGhJfAS");
            url.searchParams.set("vin", vin || "");
            url.searchParams.set("miles", String(mileage));
            url.searchParams.set("dealer_type", "independent");
            url.searchParams.set("zip", "77007");
            url.searchParams.set("is_certified", "false");

            const res = await fetch(url.toString(), {
                method: "GET",
                headers: { Accept: "application/json" },
                cache: "no-cache" // важно!
            });

            if (!res.ok) {
                throw new Error(`MarketCheck Error: ${res.status}`);
            }

            return res.json();
        },

        enabled: () => {
            if (!vin) return false;
            if (!mileage) return false;

            // Простая и надёжная валидация VIN
            const isValidVin = /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
            if (!isValidVin) return false;

            return true;
        },

        staleTime: 5 * 60 * 1000, // 5 минут кэш
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
};


export const useActionsHistory = () => {
    return useQuery<ActionsHistoryService.VinAnalysisResult>({
        queryKey: ["actions-history", 0, 1000],
        queryFn: async () => {
            const response = await fetch(
                `/api/actions-history`
            );
            const json = await response.json();
            return json.data as ActionsHistoryService.VinAnalysisResult;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
    });
};

export function usePhotoHook(vin: string) {
    return useQuery({
        queryKey: ["photos", vin],
        queryFn: async () => {
            const res = await fetch(`/api/vin/photos?vin=${vin}`);
            if (!res.ok) throw new Error("Failed to fetch photos");
            return res.json();
        },
        enabled: () => {
            const { success } = VIN.schema.safeParse(vin);
            return success;
        },
    });
}

export const useSalvageCheck = (vin: string | null) => {
    return useQuery<SalvageAPI["GET"]["response"], SalvageAPI["GET"]["error"]>({
        queryKey: ["salvage", vin],
        queryFn: () => {
            return apiRequest(
                "/api/vin/salvage",
                "GET"
            )({ query: { vin } } as SalvageAPI["GET"]["payload"]);
        },
        enabled: () => {
            const { success } = VIN.schema.safeParse(vin);
            return success;
        },
    });
};

export const useCachedInfo = (vin: string | null) => {
    return useQuery<CachedData_GET_Response>({
        queryKey: ["cached-data", vin],
        queryFn: async () => {
            const res = await fetch("/api/vin/cached-data?vin=" + vin);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData?.message);
            }
            return res.json();
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
        enabled: () => {
            const { success } = VIN.schema.safeParse(vin);
            return success;
        },
    });
};

export const useReport = () => {
    const router = useRouter();

    return useMutation<
        ReportsAPI["GET"]["response"],
        ReportsAPI["GET"]["error"],
        ReportsAPI["GET"]["payload"]
    >({
        mutationFn: apiRequest("/api/vin/report", "GET"),
        onSuccess: ({ htmlMarkup }, { query }) => {
            sessionStorage.setItem("report", htmlMarkup);
            router.push(`/report/${query.vin}`);
        },
    });
};

export interface StatsResponse {
    hourly_usage_24h: {
        hour: string;
        requests: number;
    }[];
    rate_limits: {
        remaining_this_hour: number;
        remaining_today: number;
        requests_per_day: number;
        requests_per_hour: number;
        requests_this_hour: number;
        requests_today: number;
    };
    recent_requests: {
        created_at: string;
        endpoint: string;
        error_message: string | null;
        method: string;
        response_time_ms: number;
        search_type: string | null;
        search_value: string | null;
        status_code: number;
    }[];
    usage_statistics: {
        last_30_days: {
            avg_response_time_ms: string;
            failed_requests: number;
            plate_searches: number;
            success_rate: number;
            successful_requests: number;
            total_requests: number;
            vin_searches: number;
        };
        today: {
            avg_response_time_ms: string;
            failed_requests: number;
            success_rate: number;
            successful_requests: number;
            total_requests: number;
        };
        total_requests_all_time: number;
    };
    user: {
        active: boolean;
        created_at: string;
        email: string;
        last_request_at: string;
        plan: string;
    };
}


export const useStats = () => {
    return useQuery<StatsResponse, Error>({
        queryKey: ["stats"],
        queryFn: async () => {
            const res = await fetch("/api/vin/stats");
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        }
    });
}


async function fetchOdometer(vin: string) {
    const res = await fetch(`/api/odometer?vin=${vin}`)
    if (!res.ok) throw new Error('Failed to fetch vehicle history')
    return res.json()
}

export function useOdometer(vin: string | null) {
    return useQuery({
        queryKey: ['odometer', vin],
        queryFn: () => {
            return fetchOdometer(vin!)
        },
        enabled: () => {
            const { success } = VIN.schema.safeParse(vin);
            return success;
        },
    })
}
