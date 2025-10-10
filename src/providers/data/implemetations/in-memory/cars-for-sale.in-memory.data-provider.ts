import { v4 } from "uuid";
import type { Interface } from "../../contracts/cars-for-sale.data-provider";
import { generateInMemoryCRUDProvider } from "../../shared";
import { faker } from '@faker-js/faker';
import { CarSaleStatus } from "@/entities";

const userId = '7fe2bdf5-e449-4691-b5c1-51de46c1952c'

const getFakeCarForSale = () => {
    return {
        id: v4(),
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        marketplaceLinks: faker.helpers.arrayElements(faker.helpers.uniqueArray(faker.internet.url, 5), { max: 3, min: 0 }),
        status: faker.helpers.arrayElement(['active', 'draft', 'pending publisher', 'pending sales', 'sold'] as CarSaleStatus[]),
        mileage: faker.number.int({ min: 200, max: 10000 }),
        photoIds: faker.helpers.multiple(() => ' ', { count: { max: 3, min: 1 } }),
        price: faker.number.int({ min: 500, max: 5000 }),
        vin: faker.vehicle.vin(),
        userId,
        userMail: 'test-user@mail.mail',
        year: faker.number.int({ min: 1990, max: 2025 })
    }
}

const CarsForSale = generateInMemoryCRUDProvider<Interface>({
    mappers: {
        createPayloadToDetail: (x) => {
            const id = v4()
            return {
                id,
                vin: x.vin,
                photoIds: x.photoIds,
                status: x.status,
                userId: x.userId,
                mileage: x.mileage,
                userMail: `${id}@test.test`,
                make: x.make,
                marketplaceLinks: [],
                model: x.model,
                price: x.price,
                year: x.year
            }
        },
    },
    initialData: faker.helpers.multiple(getFakeCarForSale, { count: 1000 })
})


export { CarsForSale }