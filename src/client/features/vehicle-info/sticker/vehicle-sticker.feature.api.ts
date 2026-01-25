import { useMutation } from '@tanstack/react-query';
import type { VehicleInfoAPI } from '@/backend/controllers/vehicle-info';
import { apiRequest } from '@/client/utils/api-request.utils';

type Method = VehicleInfoAPI['endpoints']['sticker_GET'];
const endpoint = '/api/vehicle-info/sticker';

export const useSticker = () => {
    return useMutation<Method['response'], Method['error'], Method['payload']>({
        mutationFn: apiRequest(endpoint, 'GET')
    });
};
