import {
    Button,
    Divider, Drawer,
    FileButton,
    Grid,
    Group,
    Modal,
    NumberInput,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";

import styles from "./CarFormAdder.module.css";
import {
    FaCamera,
    FaDollarSign,
    FaIdCard,
    FaPaperPlane,
    FaUpload,
    FaXmark,
} from "react-icons/fa6";
import { FaSave } from "react-icons/fa";

export type CarPhoto =
    | { type: "local"; file: File }
    | { type: "remote"; url: string; id: string };

export type CarInfo = {
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    price?: number;
    photos: CarPhoto[];
};

type Mode = "new" | "draft";

export interface CarFormAdderProps {
    opened: boolean;
    vin?: string;
    initialCarInfo?: CarInfo;
    mode: Mode;
    onClose: () => void;
    onDraft: (values: CarInfo) => void;
    onSubmitForSyndication: (values: Required<CarInfo>) => void;
    setVin: (vin: string) => void;
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
}) => {
    const [mileage, setMileage] = useState<number | undefined>(
        initialCarInfo?.mileage
    );
    const [price, setPrice] = useState<number | undefined>(
        initialCarInfo?.price
    );
    const [photos, setPhotos] = useState<CarPhoto[]>(
        initialCarInfo?.photos || []
    );
    const [make, setMake] = useState(initialCarInfo?.make);
    const [model, setModel] = useState(initialCarInfo?.model);
    const [year, setYear] = useState(initialCarInfo?.year);

    useEffect(() => {
        setMake(initialCarInfo?.make);
        setModel(initialCarInfo?.model);
        setYear(initialCarInfo?.year);
    }, [initialCarInfo]);

    const handleMileageChange = (val: number | string) => {
        if (typeof val === "string" || val < 0) return;

        setMileage(val);
    };

    const handlePriceChange = (val: number | string) => {
        if (typeof val === "string" || val < 0) return;

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
            return [
                ...prev,
                ...files
                    .slice(0, free)
                    .map((f) => ({ type: "local", file: f } as const)),
            ];
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

    const isFormValidForSyndication =
        vin?.length === 17 &&
        make?.length &&
        model?.length &&
        typeof mileage === "number" &&
        mileage >= 0 &&
        typeof price === "number" &&
        price >= 0 &&
        typeof year === "number" &&
        photos.length > 0;

    const isFormValidForDraft = vin?.length === 17;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            fullScreen
            padding="xl"
            overlayProps={{ blur: 2, opacity: 0.55 }}
            size="100%"
            radius="xl"
            zIndex={999999999}
            className={styles.drawerWrapper}
        >
                <div>
                    <Group gap="xs">
                        <FaIdCard className={styles.iconBlue} />
                        <Title order={4}>Vehicle Information</Title>
                    </Group>

                    <Grid>
                        <Grid.Col span={12}>
                            <TextInput
                                radius="lg"
                                pt="lg"
                                label="VIN Number *"
                                placeholder="Enter 17-character VIN"
                                maxLength={17}
                                classNames={{
                                    input: `${styles.input} ${
                                        mode === "draft"
                                            ? styles.readonlyInput
                                            : ""
                                    }`,
                                }}
                                value={vin}
                                onChange={(e) => setVin(e.currentTarget.value)}
                                readOnly={mode === "draft"}
                            />
                            <Text size="xs" c="dimmed" mt={4}>
                                Vehicle details will be automatically filled
                                once VIN is entered
                            </Text>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                radius="lg"
                                label="Make"
                                placeholder="Auto-filled from VIN"
                                value={make}
                                onChange={(e) =>
                                    handleMakeChange(e.currentTarget.value)
                                }
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                radius="lg"
                                label="Model"
                                placeholder="Auto-filled from VIN"
                                value={model}
                                onChange={(e) =>
                                    handleModelChange(e.currentTarget.value)
                                }
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                radius="lg"
                                label="Year"
                                placeholder="Auto-filled from VIN"
                                value={year}
                                type="number"
                                min={1}
                                onChange={(e) =>
                                    handleYearChange(e.currentTarget.value)
                                }
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <NumberInput
                                radius="lg"
                                label="Mileage *"
                                placeholder="0"
                                min={0}
                                onChange={handleMileageChange}
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
                                radius="lg"
                                label="Listing Price *"
                                placeholder="0.00"
                                min={0}
                                onChange={handlePriceChange}
                                value={price}
                                decimalScale={2}
                                fixedDecimalScale
                                thousandSeparator=","
                            />
                        </Grid.Col>
                    </Grid>
                </div>

                <div>
                    <Group mt="lg">
                        <Group gap="xs">
                            <FaCamera className={styles.iconPurple} />
                            <Title order={4}>Photos *</Title>
                            <Text size="sm" c="dimmed">
                                (1–30 photos)
                            </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                            {photos.length}/30
                        </Text>
                    </Group>

                    <Paper
                        withBorder
                        className={styles.uploadArea}
                        mt="md"
                        radius="md"
                    >
                        <FileButton
                            multiple
                            onChange={handleAddPhotos}
                            accept="image/*"
                            disabled={photos.length >= 30}
                        >
                            {(props) => (
                                <div
                                    {...props}
                                    className={styles.uploadContent}
                                >
                                    <FaUpload className={styles.uploadIcon} />
                                    <Text fw={500} mt={8}>
                                        Drop photos here or click to browse
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        JPG, PNG up to 10 MB each
                                    </Text>
                                </div>
                            )}
                        </FileButton>
                    </Paper>

                    {photos.length > 0 && (
                        <Grid mt="md">
                            {photos.map((photo, idx) => (
                                <Grid.Col
                                    key={idx}
                                    span={{ base: 6, sm: 4, md: 3, lg: 2 }}
                                >
                                    <Paper
                                        withBorder
                                        radius="md"
                                        className={styles.photoItem}
                                    >
                                        <img
                                            src={
                                                photo.type === "local"
                                                    ? URL.createObjectURL(
                                                          photo.file
                                                      )
                                                    : photo.url
                                            }
                                            alt={`Photo ${idx + 1}`}
                                            className={styles.photoImage}
                                        />
                                        <div className={styles.photoIndex}>
                                            {idx + 1}
                                        </div>
                                        <Button
                                            size="xs"
                                            variant="filled"
                                            color="red"
                                            onClick={() =>
                                                handleRemovePhoto(idx)
                                            }
                                            style={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                            }}
                                        >
                                            X
                                        </Button>
                                    </Paper>
                                </Grid.Col>
                            ))}
                        </Grid>
                    )}
                </div>

            <Divider mt="lg" />

            <Group mt="lg">
                <Group>
                    <Button
                        radius="lg"
                        variant="outline"
                        leftSection={<FaSave />}
                        disabled={!isFormValidForDraft}
                        onClick={handleSaveAsDraft}
                    >
                        Save as Draft
                    </Button>
                    <Button
                        radius="lg"
                        color="blue"
                        leftSection={<FaPaperPlane />}
                        disabled={!isFormValidForSyndication}
                        onClick={handleSubmitForSyndication}
                    >
                        Submit for Syndication
                    </Button>
                </Group>
            </Group>
        </Modal>
    );
};
