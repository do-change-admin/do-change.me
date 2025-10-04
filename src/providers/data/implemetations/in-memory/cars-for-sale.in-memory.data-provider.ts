import { v4 } from "uuid";
import { CarsForSaleDataProvider } from "../../contracts";
import { generateInMemoryCRUDProvider } from "../../shared";

const CarsForSaleInMemoryDataProvider = generateInMemoryCRUDProvider<CarsForSaleDataProvider>({
    mappers: {
        createPayloadToDetail: (x) => {
            return {
                id: v4(),
                licencePlate: x.licencePlate,
                photoId: x.photoId,
                status: 'review',
                userId: x.userId,
                mileage: x.mileage
            }
        }
    }
})

const carsForSaleInMemoryDataProvider = new CarsForSaleInMemoryDataProvider()

export { CarsForSaleInMemoryDataProvider, carsForSaleInMemoryDataProvider }
