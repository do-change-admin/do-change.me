import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { VehicleBaseInfoDTO } from "@/app/api/vin/base-info/models";
import { ActionsHistoryService } from "@/services";
import { PaginationSchemaType, VinSchema } from "@/schemas";
import { CachedData_GET_Response } from "@/app/api/vin/cached-data/models";
import { MarketValueAPI } from "@/app/api/vin/market-value/route";
import { apiRequest } from "@/lib/apiFetch";
import { ReportsAPI } from "@/app/api/vin/report/route";
import { SalvageAPI } from "@/app/api/vin/salvage/route";

const VIN_LENGTH = 17;

export const useBaseInfoByVIN = (vin: string | null) => {
    const isEnabled = VinSchema.safeParse(vin).success;

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
                return false;
            }

            const { success } = VinSchema.safeParse(vin);
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

export function useCheckRecords(vin: string) {
    const router = useRouter();

    return useMutation({
        mutationFn: async (service: string) => {
            const res = await fetch(
                `/api/checkrecords?vin=${vin}&service=${service}`
            );
            const data = await res.json();

            if (data.error) {
                throw new Error(data.message || "Unknown error");
            }

            if (data.type === "html") {
                sessionStorage.setItem("report", data.data);
                router.push("/report");
            } else {
                throw new Error("Unexpected response type");
            }

            return data;
        },
    });
}

export const useActionsHistory = (pagination: PaginationSchemaType) => {
    return useQuery<ActionsHistoryService.VinAnalysisResult>({
        queryKey: ["actions-history", pagination.skip, pagination.take],
        queryFn: async () => {
            const response = await fetch(
                `/api/actions-history?skip=${pagination.skip}&take=${pagination.take}`
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
            const { success } = VinSchema.safeParse(vin);
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
            const { success } = VinSchema.safeParse(vin);
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
            const { success } = VinSchema.safeParse(vin);
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
        onSuccess: ({ htmlMarkup }) => {
            sessionStorage.setItem("report", htmlMarkup);
            router.push("/report");
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


export const useStats= () => {
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

export function useOdometer(vin?: string) {
    return useQuery({
        queryKey: ['odometer', vin],
        queryFn: () => {
            if (!vin) throw new Error('VIN is required')
            return fetchOdometer(vin)
        },
        enabled: () => {
            const { success } = VinSchema.safeParse(vin);
            return success;
        },
    })
}
