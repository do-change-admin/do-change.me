import { v4 } from "uuid";
import { CarsForSaleDataProvider } from "../../contracts";
import { generateInMemoryCRUDProvider } from "../../shared";

const CarsForSaleInMemoryDataProvider = generateInMemoryCRUDProvider<CarsForSaleDataProvider>({
    mappers: {
        createPayloadToDetail: (x) => {
            const id = v4()
            return {
                id,
                vin: x.vin,
                photoIds: x.photoIds,
                status: 'pending publisher',
                userId: x.userId,
                mileage: x.mileage,
                userMail: `${id}@test.test`,
                make: x.make,
                marketplaceLinks: [],
                model: x.model,
                price: x.price,
                year: x.year
            }
        }
    }
})


export { CarsForSaleInMemoryDataProvider }

export const carsForSaleInMemoryDataProvider = new CarsForSaleInMemoryDataProvider()