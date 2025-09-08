"use client";

import { useQuery } from "@tanstack/react-query";

const API_URL = "https://api.marketcheck.com/v2/search/car/auction/active?radius=20";
const API_KEY = process.env.NEXT_PUBLIC_MARKETCHECK_API_KEY;

export interface AuctionParams {
    city?: string;
    state?: string;
    make?: string;
    model?: string;
    price_range?: string;
    stats?: string;
    rows?: number;
    start?: number;
}

export function useAuctionListings(params: AuctionParams) {
    return useQuery({
        queryKey: ["auctionListings", params],
        queryFn: async () => {
            if (!API_KEY) {
                throw new Error("");
            }

            const url = new URL(API_URL);
            url.searchParams.append("api_key", API_KEY);

            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            });

            const res = await fetch(url.toString(), { method: "GET" });

            if (!res.ok) {
                throw new Error(`Error fetching auctions: ${res.status}`);
            }

            return res.json();
        },
    });
}
