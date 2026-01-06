'use client'

import { useQuery } from '@tanstack/react-query'

export interface IVehiclePriceResponse {
    status: boolean
    code: number
    message: string
    data: VehiclePriceData
}

export interface VehiclePriceData {
    vin: string
    success: boolean
    id: string
    vehicle: string
    mean: number
    stdev: number
    count: number
    mileage: number
    certainty: number
    period: string[]
    prices: {
        above: number
        average: number
        below: number
        distribution: PriceDistributionGroup[]
    }
    adjustments: {
        mileage: AdjustmentMileage
        history: AdjustmentHistory
        condition: AdjustmentOptional
        known_damage: AdjustmentOptional
    }
    type: string
}

export interface PriceDistributionGroup {
    group: {
        count: number
        min: number
        max: number
    }
}

export interface AdjustmentMileage {
    adjustment: number
    average: number
    input: number
}

export interface AdjustmentHistory {
    records: {type: string, date: string}[]
    adjustment: number
}

export interface AdjustmentOptional {
    input: number | null
    adjustment: number
}


interface FetchVehiclePriceParams {
    vin: string
    mileage: string
}

async function fetchVehiclePrice(
    params: FetchVehiclePriceParams,
): Promise<IVehiclePriceResponse> {
    const { vin, mileage } = params

    const url = `https://vehicle-pricing-api.p.rapidapi.com/1837/get%2Bvehicle%2Bprice%2Bdata?vin=${vin}&mileage=${mileage}`
    const apiKey = 'f83a8c6d84msh27789c1167c85b6p1eec1ajsn9b2abef80aca'

    const res = await fetch(url
        ,
        {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'vehicle-pricing-api.p.rapidapi.com',
                'x-rapidapi-key': apiKey!,
            },
            cache: 'no-store',
        },
    )

    if (!res.ok) {
        throw new Error('Failed to fetch vehicle price')
    }

    return res.json()
}


export function useVehiclePriceQuery(params: FetchVehiclePriceParams) {
    return useQuery<IVehiclePriceResponse, Error>({
        queryKey: ['vehicle-price', params.vin, params.mileage],
        queryFn: () => fetchVehiclePrice(params),
        enabled: Boolean(params.vin && params.mileage),
    })
}
