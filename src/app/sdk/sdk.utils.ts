import type { DefaultMantineColor } from '@mantine/core';
import type { SyndicationRequestStatus } from '@/entities/syndication-request';

export const getColorByCarSaleStatus = (status: SyndicationRequestStatus): DefaultMantineColor => {
    switch (status) {
        case 'active':
            return 'green';
        case 'pending publisher':
            return 'orange';
        case 'pending sales':
            return 'red';
        case 'sold':
            return 'blue';
        default:
            return 'green';
    }
};

export const getVisualDataByCarSaleMarketplaceLink = (link: string): { label: string; color: DefaultMantineColor } => {
    if (link.includes('cruz.com')) {
        return { label: 'cruz.com', color: 'blue' };
    }
    if (link.includes('carsforsale.com')) {
        return { label: 'carsforsale.com', color: 'orange' };
    }
    if (link.includes('cargurus.com')) {
        return { label: 'cargurus.com', color: 'green' };
    }
    return { label: link, color: 'gray' };
};
