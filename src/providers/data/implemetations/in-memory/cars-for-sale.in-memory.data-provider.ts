import { v4 } from "uuid";
import { CarsForSaleDataProvider } from "../../contracts";
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

// const getInitialData = (userId: string) => {
//     faker.
//         return[
//         {
//             id: v4(),
//             make: 'BMW',
//             model: '3 Series',
//             vin: '1HGCM82633A123456',
//             status: 'active' as const,
//             photoIds: [],
//             marketplaceLinks: [
//                 'http://localhost:3000/marketplace/blablabla'
//             ],
//             mileage: 10000,
//             price: 241,
//             year: 2000,
//             userId,
//             userMail: 'test-user@mail.mail'
//         },
//         {
//             id: v4(),
//             make: 'BMW',
//             model: '3 Series',
//             vin: '1HGCM82633A123456',
//             status: 'draft' as const,
//             photoIds: [],
//             marketplaceLinks: [
//                 'http://localhost:3000/marketplace/blablabla'
//             ],
//             mileage: 10000,
//             price: 241,
//             year: 2000,
//             userId,
//             userMail: 'test-user@mail.mail'
//         },
//         {
//             id: v4(),
//             make: 'BMW',
//             model: '3 Series',
//             vin: '1HGCM82633A123456',
//             status: 'pending publisher' as const,
//             photoIds: [],
//             marketplaceLinks: [
//                 'http://localhost:3000/marketplace/blablabla'
//             ],
//             mileage: 1242142,
//             price: 241,
//             year: 2000,
//             userId,
//             userMail: 'test-user@mail.mail'
//         },
//         {
//             id: v4(),
//             make: 'BMW',
//             model: '3 Series',
//             vin: '1HGCM82633A123456',
//             status: 'pending sales' as const,
//             photoIds: [],
//             marketplaceLinks: [
//                 'http://localhost:3000/marketplace/blablabla'
//             ],
//             mileage: 10000,
//             price: 2412,
//             year: 1990,
//             userId,
//             userMail: 'test-user@mail.mail'
//         },
//     ]
// }

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
        },
    },
    initialData: faker.helpers.multiple(getFakeCarForSale, { count: 1000 })
})


export { CarsForSaleInMemoryDataProvider }

export const carsForSaleInMemoryDataProvider = new CarsForSaleInMemoryDataProvider()