import { useMutation } from '@tanstack/react-query';
import type { RemotePicturesAPI } from '@/backend/controllers/remote-pictures';
import { apiRequest } from '@/client/utils/api-request.utils';

type RemoveBackground = RemotePicturesAPI['endpoints']['WithoutBackground_POST'];

export const usePictureBackgroundRemoving = () => {
    return useMutation<RemoveBackground['response'], RemoveBackground['error'], RemoveBackground['payload']>({
        mutationFn: apiRequest('/api/remote-pictures/without-background', 'POST')
    });
};
