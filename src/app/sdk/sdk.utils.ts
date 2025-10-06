import { CarForSaleUserListModel, CarSaleStatus } from "@/entities";
import { DefaultMantineColor } from "@mantine/core";
import { v4 } from "uuid";

export const getColorByCarSaleStatus = (status: CarSaleStatus): DefaultMantineColor => {
    switch (status) {
        case 'active':
            return 'green'
        case 'pending publisher':
            return 'orange'
        case 'pending sales':
            return 'red'
        case 'sold':
            return 'blue'
        default:
            return 'green'
    }
}

export const getVisualDataByCarSaleMarketplaceLink = (link: string): { label: string, color: DefaultMantineColor } => {
    if (link.includes('cruz.com')) {
        return { label: 'cruz.com', color: 'blue' }
    }
    if (link.includes('carsforsale.com')) {
        return { label: 'carsforsale.com', color: 'orange' }
    }
    if (link.includes('cargurus.com')) {
        return { label: 'cargurus.com', color: 'green' }
    }
    return { label: link, color: 'gray' }
}

export const mockVehiclesForSale: CarForSaleUserListModel[] = [
    {
        id: v4(),
        make: 'BMW',
        model: '3 Series',
        vin: '1HGCM82633A123456',
        status: 'active',
        photoLinks: ['https://storage.googleapis.com/uxpilot-auth.appspot.com/c75ec488ca-7683147cb5c26bb93038.png'],
        marketplaceLinks: [
            'http://localhost:3000/marketplace/blablabla'
        ],
        mileage: 10000,
        price: 241,
        year: 2000
    },

]