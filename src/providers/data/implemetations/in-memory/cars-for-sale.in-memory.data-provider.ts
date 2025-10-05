import { v4 } from "uuid";
import { CarsForSaleDataProvider } from "../../contracts";
import { generateInMemoryCRUDProvider } from "../../shared";

const CarsForSaleInMemoryDataProvider = generateInMemoryCRUDProvider<CarsForSaleDataProvider>({
    mappers: {
        createPayloadToDetail: (x) => {
            const id = v4()
            return {
                id,
                licencePlate: x.licencePlate,
                photoId: x.photoId,
                status: 'pending publisher',
                userId: x.userId,
                mileage: x.mileage,
                userMail: `${id}@test.test`,
            }
        }
    }
})


export { CarsForSaleInMemoryDataProvider }

export const carsForSaleInMemoryDataProvider = new CarsForSaleInMemoryDataProvider()