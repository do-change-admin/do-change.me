import type { MutationStatus } from '@tanstack/react-query';
import type { FC } from 'react';
import { useSticker } from './vehicle-sticker.feature.api';

export type VehicleStickerProps = {
    views: {
        Layout: FC<{
            downloadSticker: Function;
            status: MutationStatus;
        }>;
    };
    vin: string;
};

export const VehicleSticker: FC<VehicleStickerProps> = ({ views, vin }) => {
    const { Layout } = views;

    const { mutate, status } = useSticker();

    const downloadSticker = () => {
        mutate({ query: { vin } });
    };

    return <Layout downloadSticker={downloadSticker} status={status} />;
};
