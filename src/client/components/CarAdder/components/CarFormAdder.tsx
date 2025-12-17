import {
    Button,
    Divider,
    FileButton,
    Grid,
    Group,
    Image,
    Modal,
    NumberInput,
    Paper,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { FaCamera, FaDollarSign, FaIdCard, FaPaperPlane, FaUpload } from 'react-icons/fa6';
import { LoadingMinute } from '@/client/components';
import styles from './CarFormAdder.module.css';

export type CarPhoto = { type: 'local'; file: File } | { type: 'remote'; url: string; id: string };

export type CarInfo = {
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    price?: number;
    photos: CarPhoto[];
};

type Mode = 'new' | 'draft';

export interface CarFormAdderProps {
    opened: boolean;
    vin?: string;
    initialCarInfo?: CarInfo;
    mode: Mode;
    onClose: () => void;
    onDraft: (values: CarInfo) => void;
    onSubmitForSyndication: (values: Required<CarInfo>) => void;
    setVin: (vin: string) => void;
    isPending: boolean;
}

export const CarFormAdder: React.FC<CarFormAdderProps> = ({
    opened,
    mode,
    vin,
    initialCarInfo,
    onDraft,
    onSubmitForSyndication,
    onClose,
    setVin,
    isPending
}) => {
    const [mileage, setMileage] = useState<number | undefined>(initialCarInfo?.mileage);
    const [price, setPrice] = useState<number | undefined>(initialCarInfo?.price);
    const [photos, setPhotos] = useState<CarPhoto[]>(initialCarInfo?.photos || []);
    const [make, setMake] = useState(initialCarInfo?.make);
    const [model, setModel] = useState(initialCarInfo?.model);
    const [year, setYear] = useState(initialCarInfo?.year);

    useEffect(() => {
        setMake(initialCarInfo?.make);
        setModel(initialCarInfo?.model);
        setYear(initialCarInfo?.year);
    }, [initialCarInfo]);

    const handleMileageChange = (val: number | string) => {
        if (typeof val === 'string' || val < 0) return;

        setMileage(val);
    };

    const handlePriceChange = (val: number | string) => {
        if (typeof val === 'string' || val < 0) return;

        setPrice(val);
    };

    const handleMakeChange = (val: string) => {
        setMake(val);
    };

    const handleModelChange = (val: string) => {
        setModel(val);
    };

    const handleYearChange = (val: string) => {
        if (val) {
            setYear(Number(val));
        }
    };

    const handleAddPhotos = (files: File[]) => {
        if (!files.length) return;
        setPhotos((prev) => {
            const free = Math.max(0, 30 - prev.length);
            return [...prev, ...files.slice(0, free).map((f) => ({ type: 'local', file: f }) as const)];
        });
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSaveAsDraft = () => {
        onDraft({ photos, make, mileage, model, price, year });
    };

    const handleSubmitForSyndication = () => {
        if (!isFormValidForSyndication) return;

        onSubmitForSyndication({ make, mileage, model, photos, price, year });
    };

    const pics = useMemo(() => {
        return (
            photos.length > 0 &&
            !isPending && (
                <Grid mt="md">
                    {photos.map((photo, idx) => (
                        <Grid.Col key={idx} span={{ base: 6, sm: 4, md: 3, lg: 2 }}>
                            <Paper className={styles.photoItem} radius="md" withBorder>
                                <Image
                                    alt={`Photo ${idx + 1}`}
                                    className={styles.photoImage}
                                    height={'100'}
                                    src={photo.type === 'local' ? URL.createObjectURL(photo.file) : photo.url}
                                    width={'100'}
                                />
                                <div className={styles.photoIndex}>{idx + 1}</div>
                                <Button
                                    color="red"
                                    onClick={() => handleRemovePhoto(idx)}
                                    size="xs"
                                    style={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4
                                    }}
                                    variant="filled"
                                >
                                    X
                                </Button>
                            </Paper>
                        </Grid.Col>
                    ))}
                </Grid>
            )
        );
    }, [photos, isPending]);

    const isFormValidForSyndication =
        vin?.length === 17 &&
        make?.length &&
        model?.length &&
        typeof mileage === 'number' &&
        mileage >= 0 &&
        typeof price === 'number' &&
        price >= 0 &&
        typeof year === 'number' &&
        photos.length > 0;

    const isFormValidForDraft = vin?.length === 17;

    if (isPending) {
        return <LoadingMinute label="Uploading images..." />;
    }

    return (
        <Modal
            className={styles.drawerWrapper}
            fullScreen
            onClose={onClose}
            opened={opened}
            overlayProps={{ blur: 2, opacity: 0.55 }}
            padding="xl"
            pos={'relative'}
            radius="xl"
            size="100%"
            zIndex={999999999}
        >
            <div>
                <Group gap="xs">
                    <FaIdCard className={styles.iconBlue} />
                    <Title order={4}>Vehicle Information</Title>
                </Group>

                <Grid>
                    <Grid.Col span={12}>
                        <TextInput
                            classNames={{
                                input: `${styles.input} ${mode === 'draft' ? styles.readonlyInput : ''}`
                            }}
                            label="VIN Number *"
                            maxLength={17}
                            onChange={(e) => setVin(e.currentTarget.value)}
                            placeholder="Enter 17-character VIN"
                            pt="lg"
                            radius="lg"
                            readOnly={mode === 'draft'}
                            value={vin}
                        />
                        <Text c="dimmed" mt={4} size="xs">
                            Vehicle details will be automatically filled once VIN is entered
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                            label="Make"
                            onChange={(e) => handleMakeChange(e.currentTarget.value)}
                            placeholder="Auto-filled from VIN"
                            radius="lg"
                            value={make}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                            label="Model"
                            onChange={(e) => handleModelChange(e.currentTarget.value)}
                            placeholder="Auto-filled from VIN"
                            radius="lg"
                            value={model}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                            label="Year"
                            min={1}
                            onChange={(e) => handleYearChange(e.currentTarget.value)}
                            placeholder="Auto-filled from VIN"
                            radius="lg"
                            type="number"
                            value={year}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <NumberInput
                            label="Mileage *"
                            min={0}
                            onChange={handleMileageChange}
                            placeholder="0"
                            radius="lg"
                            value={mileage}
                        />
                    </Grid.Col>
                </Grid>
            </div>

            <div>
                <Group gap="xs" mt="lg">
                    <FaDollarSign className={styles.iconGreen} />
                    <Title order={4}>Pricing</Title>
                </Group>

                <Grid mt="md">
                    <Grid.Col span={{ lg: 6, base: 12 }}>
                        <NumberInput
                            decimalScale={2}
                            fixedDecimalScale
                            label="Listing Price *"
                            min={0}
                            onChange={handlePriceChange}
                            placeholder="0.00"
                            radius="lg"
                            thousandSeparator=","
                            value={price}
                        />
                    </Grid.Col>
                </Grid>
            </div>

            <div>
                <Group mt="lg">
                    <Group gap="xs">
                        <FaCamera className={styles.iconPurple} />
                        <Title order={4}>Photos *</Title>
                        <Text c="dimmed" size="sm">
                            (1–30 photos)
                        </Text>
                    </Group>
                    <Text c="dimmed" size="sm">
                        {photos.length}/30
                    </Text>
                </Group>

                <Paper className={styles.uploadArea} mt="md" radius="md" withBorder>
                    <FileButton accept="image/*" disabled={photos.length >= 30} multiple onChange={handleAddPhotos}>
                        {(props) => (
                            <div {...props} className={styles.uploadContent}>
                                <FaUpload className={styles.uploadIcon} />
                                <Text fw={500} mt={8}>
                                    Drop photos here or click to browse
                                </Text>
                                <Text c="dimmed" size="sm">
                                    JPG, PNG up to 10 MB each
                                </Text>
                            </div>
                        )}
                    </FileButton>
                </Paper>

                {pics}
            </div>

            <Divider mt="lg" />

            <Group mt="lg">
                <Group>
                    <Button
                        disabled={!isFormValidForDraft}
                        leftSection={<FaSave />}
                        onClick={handleSaveAsDraft}
                        radius="lg"
                        variant="outline"
                    >
                        Save as Draft
                    </Button>
                    <Button
                        color="blue"
                        disabled={!isFormValidForSyndication}
                        leftSection={<FaPaperPlane />}
                        onClick={handleSubmitForSyndication}
                        radius="lg"
                    >
                        Submit for Syndication
                    </Button>
                </Group>
            </Group>
        </Modal>
    );
};
