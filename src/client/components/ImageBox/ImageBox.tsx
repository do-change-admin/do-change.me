'use client';

import {useRef, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {
    FiUpload,
    FiRefreshCw,
    FiDownload,
} from 'react-icons/fi';
import styles from './ImageBox.module.css';
import {useFilesUploading} from '@/client/shared/queries';
import {
    usePictureBackgroundRemoving
} from '@/client/features/pictures/remove-background/remove-picture-background.feature.api';
import {Button, Group, Stack} from "@mantine/core";
import {downloadAllImages, downloadSingleImage} from "@/client/components/_admin/CarEditor/utils";

type Status = 'idle' | 'processing' | 'done';

export const ImageBox = () => {
    const {mutateAsync: upload} = useFilesUploading();
    const {mutateAsync: removeBg} = usePictureBackgroundRemoving();

    const inputRef = useRef<HTMLInputElement>(null);

    const [status, setStatus] = useState<Status>('idle');
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);

    const onUpload = async (file?: File) => {
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setOriginalImage(localPreview);
        setStatus('processing');

        const {uploadedFileIds} = await upload([file]);
        const {imagesWithoutBackground} = await removeBg({
            body: {pictureIds: uploadedFileIds},
        });

        setProcessedImage(imagesWithoutBackground[0]);
        setStatus('done');
    };

    const reset = () => {
        setOriginalImage(null);
        setProcessedImage(null);
        setStatus('idle');
    };

    const onDownload = async () => {
        if (!processedImage) return;
        await downloadSingleImage(processedImage, "bg_remove");
    };

    return (
        <Stack justify="center" p='lg'>
            <Button variant="outline" mt="lg"  radius="lg" color="var(--cl-fio)" leftSection={<FiUpload size={20}/>}
                    onClick={() => {
                        setOriginalImage(null);
                        setProcessedImage(null);
                        inputRef.current?.click()
                    }}
            >
                Upload image
            </Button>
            <div className={styles.wrapper}>

                <Group gap="lg" pos='absolute' top={30} style={{zIndex: 99}}>
                    {/* BOTTOM */}
                    {(status === 'done') && (
                        <Button leftSection={ <FiDownload/>} radius="lg" color="var(--cl-fio)" onClick={onDownload}>
                            Download
                        </Button>
                    )}
                </Group>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => onUpload(e.target.files?.[0])}
                />

                {/* IMAGE AREA */}
                <div className={styles.imageContainer}>

                    {/* WHITE BACKGROUND */}
                    <div className={styles.whiteBg} style={{width: (status === 'done' && processedImage) ? '100%' : 0}}/>

                    {/* ORIGINAL */}
                    {originalImage && (
                        <motion.img
                            src={originalImage}
                            className={styles.originalImage}
                            // animate={{ opacity: status === 'done' ? 0 : 1 }}
                            // transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                    )}

                    {/* RESULT — НА ТОМ ЖЕ МЕСТЕ */}
                    {processedImage && (
                        <motion.img
                            src={processedImage}
                            className={styles.image}
                        />
                    )}

                    {/* OVERLAY */}
                    {status === 'processing' && (
                        <motion.div
                            className={styles.processingOverlay}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                        >
                            <div className={styles.scan}/>
                            <span>Removing background…</span>
                        </motion.div>
                    )}
                </div>

            </div>
        </Stack>

    );
};
