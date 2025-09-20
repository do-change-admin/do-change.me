import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
import { PricesResultDTO } from "@/app/api/vin/market-value/models";
import { VehicleBaseInfoDTO } from '@/app/api/vin/base-info/models';
import { ActionsHistoryService } from '@/services';
import { PaginationSchemaType, VinSchema } from '@/schemas';
import { CachedData_GET_Response, CacheStatus } from '@/app/api/vin/cached-data/models';

const VIN_LENGTH = 17;

export const useBaseInfoByVIN = (
    vin: string | null,
    cacheStatus: CacheStatus | undefined,
) => {
    return useQuery<VehicleBaseInfoDTO>({
        queryKey: ['vinCheck', vin],
        queryFn: async () => {
            if (!vin) {
                throw new Error('VIN was not provided')
            }
            if (vin.length !== VIN_LENGTH) {
                throw new Error('VIN length must be 17 symbols');
            }

            const response = await fetch(`/api/vin/base-info?vin=${vin}`);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            return (await response.json());
        },
        enabled: () => {
            if (!cacheStatus || cacheStatus?.baseInfoWasFound) {
                return false
            }
            const { success } = VinSchema.safeParse(vin)
            return success
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};


export const useMileagePriceQuery = (
    vin: string | null,
    mileage: number | undefined,
    cacheStatus: CacheStatus | undefined,
) => {
    return useQuery<PricesResultDTO, Error>({
        queryKey: ['mileagePrice', vin, mileage],
        queryFn: async () => {
            if (!vin) {
                throw new Error('VIN was not provided')
            }
            if (!mileage) {
                throw new Error(`Mileage was not selected`);
            }
            const response = await fetch(`/api/vin/market-value?vin=${vin}&mileage=${mileage}`);
            if (!response.ok) {
                throw new Error(`Request finished with ${response.status} status code`);
            }
            const data: PricesResultDTO = await response.json();
            return data;
        },
        enabled: () => {
            if (!cacheStatus) {
                return false
            }

            if (!mileage) {
                return false
            }

            const { success } = VinSchema.safeParse(vin)
            if (!success) {
                return false
            }

            return !cacheStatus.marketPricesWereFound.includes(mileage)
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
            const res = await fetch(`/api/checkrecords?vin=${vin}&service=${service}`);
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
        }
    });
}

export const useActionsHistory = (pagination: PaginationSchemaType) => {
    return useQuery<ActionsHistoryService.VinAnalysisResult>({
        queryKey: ['actions-history', pagination.skip, pagination.take],
        queryFn: async () => {
            const response = await fetch(`/api/actions-history?skip=${pagination.skip}&take=${pagination.take}`)
            const json = await response.json()
            return json.data as ActionsHistoryService.VinAnalysisResult;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
    })
}

export function usePhotoHook(vin: string) {
    return useQuery({
        queryKey: ["photos", vin],
        queryFn: async () => {
            const res = await fetch(`/api/vin/photos?vin=${vin}`);
            if (!res.ok) throw new Error("Failed to fetch photos");
            return res.json();
        },
        enabled: () => {
            const { success } = VinSchema.safeParse(vin)
            return success
        }
    });
}

export const useSalvageCheck = (vin: string | null, cacheStatus?: CacheStatus) => {
    return useQuery<boolean>({
        queryKey: ["salvage", vin],
        queryFn: async () => {
            const res = await fetch(`/api/vin/salvage?vin=${vin}`);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData?.message || "error VIN");
            }
            return res.json();
        },
        enabled: () => {
            if (!cacheStatus || cacheStatus.salvageInfoWasFound) {
                return false
            }

            const { success } = VinSchema.safeParse(vin)
            return success
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCachedInfo = (vin: string | null) => {
    return useQuery<CachedData_GET_Response>({
        queryKey: ['cached-data', vin],
        queryFn: async () => {
            const res = await fetch('/api/vin/cached-data?vin=' + vin)
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData?.message);
            }
            return res.json()
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
        enabled: () => {
            const { success } = VinSchema.safeParse(vin)
            return success
        }
    })
}