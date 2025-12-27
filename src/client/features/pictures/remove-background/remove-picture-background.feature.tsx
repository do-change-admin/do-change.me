import type { MutationStatus } from '@tanstack/react-query';
import { type FC, useState } from 'react';
import { useFilesUploading } from '@/client/shared/queries';
import { usePictureBackgroundRemoving } from './remove-picture-background.feature.api';

export type RemovePictureBackgroundProps = {
    views: {
        Layout: FC<{
            selectedFiles: File[];
            selectFiles: (data: File[]) => void;
            selectBackground: (data: File) => void;
            removeBackground: Function;
            fileUploadingStatus: MutationStatus;
            backgroundRemovingStatus: MutationStatus;
        }>;
    };
};

/**
 * TODO - заменить логику в page на виджет + фичу. В прекрасном будущем, не сейчас.
 */

export const RemovePictureBackground: FC<RemovePictureBackgroundProps> = ({ views }) => {
    const { Layout } = views;

    const [files, setFiles] = useState<File[]>([]);
    const [background, setBackground] = useState<File>();

    let backgroundId: string | undefined;

    const { mutateAsync: uploadFiles, status: fileUploadingStatus } = useFilesUploading();
    const { mutate: removeBackground, status: backgroundRemovingStatus } = usePictureBackgroundRemoving();

    const setNewBackground = async () => {
        const { uploadedFileIds } = await uploadFiles(files);
        if (background) {
            const {
                uploadedFileIds: [uploadedBackgroundId]
            } = await uploadFiles([background]);
            backgroundId = uploadedBackgroundId;
        }
        removeBackground({ body: { pictureIds: uploadedFileIds, backgroundImageId: backgroundId } });
    };

    return (
        <Layout
            backgroundRemovingStatus={backgroundRemovingStatus}
            fileUploadingStatus={fileUploadingStatus}
            removeBackground={setNewBackground}
            selectBackground={setBackground}
            selectedFiles={files}
            selectFiles={setFiles}
        />
    );
};
