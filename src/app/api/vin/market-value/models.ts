export type PricesResultDTO = {
    market_prices: {
        average: number;
        below: number;
        above: number;
        distribution: {
            group: {
                count: number,
                max: number,
                min: number
            }
        }[];
    }
}

