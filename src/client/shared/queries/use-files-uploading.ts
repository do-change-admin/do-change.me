import { useMutation } from '@tanstack/react-query';
import type { RemotePicturesAPI } from '@/backend/controllers/remote-pictures';
import { apiRequest } from '@/client/utils/api-request.utils';

type UploadMultiple = RemotePicturesAPI['endpoints']['List_POST'];

const uploadMultipleEndpoint = '/api/remote-pictures/list';

const useMultiplePicturesUploading = () => {
    return useMutation<UploadMultiple['response'], UploadMultiple['error'], UploadMultiple['payload']>({
        mutationFn: apiRequest(uploadMultipleEndpoint, 'POST')
    });
};

export const useFilesUploading = () => {
    const { mutateAsync } = useMultiplePicturesUploading();
    return useMutation<{ uploadedFileIds: string[] }, { message: string }, File[]>({
        mutationFn: async (files) => {
            const uploadedFileIds: string[] = [];
            const { items } = await mutateAsync({ query: { count: files.length } });

            for (let i = 0; i < items.length; i++) {
                const file = files[i];
                const fileUploadInfo = items[i];

                const result = await fetch(fileUploadInfo.uploadLink, {
                    body: file,
                    method: 'PUT',
                    headers: {
                        'Content-Type': file.type
                    }
                });
                if (result.ok) {
                    uploadedFileIds.push(fileUploadInfo.id);
                }
            }

            return { uploadedFileIds };
        }
    });
};
