import {
    ActionIcon,
    Button,
    Divider,
    Grid,
    Group,
    Modal,
    NumberInput,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
    UnstyledButton,
} from "@mantine/core";
import styles from "./CarEditor.module.css";
import {
    FaCamera,
    FaDollarSign,
    FaIdCard,
    FaLink,
    FaPlus,
    FaTrash,
    FaXmark,
} from "react-icons/fa6";
import {
    useDetails,
    useUpdate,
} from "@/hooks/queries/syndication-request-management.queries";
import { FaSave } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

export interface CarEditorProps {
    opened: boolean;
    carId: string;
    userId: string;
    onClose: () => void;
}

export const CarEditor: React.FC<CarEditorProps> = ({
    onClose,
    opened,
    carId,
    userId,
}) => {
    const [status, setStatus] = useState<
        "pending publisher" | "active" | "pending sales" | "sold" | null
    >(null);
    const [marketplaceLinks, setMarketplaceLinks] = useState<string[]>([]);
    const [addLinkModalOpened, setAddLinkModalOpened] = useState(false);
    const [newLinkError, setNewLinkError] = useState<string | null>(null);
    const [newLinkValue, setNewLinkValue] = useState("");

    const { data: car } = useDetails({ id: carId, userId });
    const { mutateAsync: updateCar } = useUpdate();

    useEffect(() => {
        if (car) {
            setStatus(car.status ?? null);
            setMarketplaceLinks(car.marketplaceLinks ?? []);
        }
    }, [car?.id]);

    const statusOptions = useMemo(() => {
        return [
            { label: "Pending publisher", value: "pending publisher" },
            { label: "Active", value: "active" },
            { label: "Pending sales", value: "pending sales" },
            { label: "Sold", value: "sold" },
        ];
    }, []);

    const handleDeleteLink = (index: number) => {
        setMarketplaceLinks((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddNewLink = () => {
        setNewLinkError(null);

        const parsed = z.url().safeParse(newLinkValue?.trim());
        if (!parsed.success) {
            setNewLinkError("Please enter a valid URL.");
            return;
        }

        setMarketplaceLinks((prev) => [...prev, parsed.data]);
        setNewLinkValue("");
        setAddLinkModalOpened(false);
    };

    const handleSave = async () => {
        await updateCar({
            body: { marketplaceLinks: marketplaceLinks, status: status! },
            query: { id: carId, userId },
        });

        onClose();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={onClose}
                size="70%"
                radius="lg"
                centered
                classNames={{
                    content: styles.modalContent,
                    body: styles.modalBody,
                    header: styles.modalHeader,
                }}
                title={
                    <div>
                        <Title order={2}>Edit Car</Title>
                        <Text size="sm" c="dimmed">
                            Fill in the details to list your car for sale
                        </Text>
                    </div>
                }
                closeButtonProps={{ icon: <FaXmark /> }}
                overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
            >
                <Stack gap="lg">
                    <div>
                        <Group gap="xs">
                            <FaIdCard className={styles.iconBlue} />
                            <Title order={4}>Vehicle Information</Title>
                        </Group>

                        <Grid>
                            <Grid.Col span={12}>
                                <TextInput
                                    label="VIN Number *"
                                    placeholder="Enter 17-character VIN"
                                    maxLength={17}
                                    value={car?.vin}
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`,
                                    }}
                                    readOnly
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Make"
                                    value={car?.make}
                                    readOnly
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`,
                                    }}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Model"
                                    value={car?.model}
                                    readOnly
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`,
                                    }}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Year"
                                    value={car?.year}
                                    type="number"
                                    min={1}
                                    readOnly
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`,
                                    }}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <NumberInput
                                    label="Mileage *"
                                    placeholder="0"
                                    min={0}
                                    value={car?.mileage}
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`,
                                    }}
                                />
                            </Grid.Col>
                        </Grid>
                    </div>

                    <Divider />

                    <div>
                        <Group gap="xs">
                            <FaDollarSign className={styles.iconGreen} />
                            <Title order={4}>Pricing</Title>
                        </Group>

                        <Grid mt="md">
                            <Grid.Col span={{ lg: 6, base: 12 }}>
                                <NumberInput
                                    label="Listing Price *"
                                    placeholder="0.00"
                                    min={0}
                                    value={car?.price}
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`,
                                    }}
                                    readOnly
                                />
                            </Grid.Col>
                        </Grid>
                    </div>

                    <Divider />

                    <div>
                        <Group>
                            <Group gap="xs">
                                <FaCamera className={styles.iconPurple} />
                                <Title order={4}>Photos *</Title>
                                <Text size="sm" c="dimmed">
                                    (1–10 photos)
                                </Text>
                            </Group>
                            <Text size="sm" c="dimmed">
                                {car?.photoLinks.length}/10
                            </Text>
                        </Group>

                        {car?.photoLinks?.length &&
                            car.photoLinks.length > 0 && (
                                <Grid mt="md">
                                    {car.photoLinks.map((photo, idx) => (
                                        <Grid.Col
                                            key={idx}
                                            span={{
                                                base: 6,
                                                sm: 4,
                                                md: 3,
                                                lg: 2,
                                            }}
                                        >
                                            <Paper
                                                withBorder
                                                radius="md"
                                                className={styles.photoItem}
                                            >
                                                <img
                                                    src={photo}
                                                    alt={`Photo ${idx + 1}`}
                                                    className={
                                                        styles.photoImage
                                                    }
                                                />
                                                <div
                                                    className={
                                                        styles.photoIndex
                                                    }
                                                >
                                                    {idx + 1}
                                                </div>
                                            </Paper>
                                        </Grid.Col>
                                    ))}
                                </Grid>
                            )}
                    </div>

                    <Divider />

                    <div>
                        <Group gap="xs">
                            <Title order={5}>Admin actions</Title>
                        </Group>

                        <Grid mt="md">
                            <Grid.Col span={{ lg: 6, base: 12 }}>
                                <Select
                                    label="Status"
                                    data={statusOptions}
                                    placeholder="Select status"
                                    value={status}
                                    // @ts-ignore
                                    onChange={setStatus}
                                    styles={{
                                        input: { minWidth: 220 },
                                    }}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ lg: 6, base: 12 }}>
                                <Text mb={4} size="md">
                                    Marketplace links
                                </Text>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => setAddLinkModalOpened(true)}
                                >
                                    Add new marketplace link
                                </Button>

                                {marketplaceLinks.length === 0 ? (
                                    <Text size="sm" c="dimmed" mt={6}>
                                        No marketplace links added yet.
                                    </Text>
                                ) : (
                                    <Stack gap={6} mt={6}>
                                        {marketplaceLinks.map((lnk, idx) => (
                                            <Group
                                                key={`${lnk}-${idx}`}
                                                style={{
                                                    background: "#fafafa",
                                                    padding: 8,
                                                    borderRadius: 8,
                                                    border: "1px solid rgba(0,0,0,0.04)",
                                                }}
                                            >
                                                <Text
                                                    size="sm"
                                                    style={{
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth:
                                                            "calc(100% - 40px)",
                                                    }}
                                                    title={lnk}
                                                >
                                                    {lnk}
                                                </Text>
                                                <Group>
                                                    <ActionIcon
                                                        variant="light"
                                                        size="sm"
                                                        onClick={() => {
                                                            // открыть ссылку в новой вкладке
                                                            window.open(
                                                                lnk,
                                                                "_blank",
                                                                "noopener"
                                                            );
                                                        }}
                                                        aria-label="Open marketplace link"
                                                    >
                                                        <FaLink />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        color="red"
                                                        variant="light"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteLink(
                                                                idx
                                                            )
                                                        }
                                                        aria-label="Delete marketplace link"
                                                    >
                                                        <FaTrash />
                                                    </ActionIcon>
                                                </Group>
                                            </Group>
                                        ))}
                                    </Stack>
                                )}
                            </Grid.Col>
                        </Grid>
                    </div>
                </Stack>

                <Divider mt="lg" />

                <Group mt="lg">
                    <Group>
                        <Button
                            variant="outline"
                            leftSection={<FaSave />}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </Group>
                </Group>
            </Modal>

            <Modal
                opened={addLinkModalOpened}
                onClose={() => {
                    setAddLinkModalOpened(false);
                    setNewLinkError(null);
                    setNewLinkValue("");
                }}
                title="Add marketplace link"
                centered
                size="lg"
            >
                <Stack gap={6}>
                    <TextInput
                        label="Marketplace URL"
                        placeholder="https://example.com/your-listing"
                        value={newLinkValue}
                        onChange={(e) => setNewLinkValue(e.currentTarget.value)}
                        error={newLinkError ?? undefined}
                        rightSection={
                            <UnstyledButton
                                onClick={() => {
                                    if (navigator.clipboard) {
                                        navigator.clipboard
                                            .readText()
                                            .then((text) => {
                                                setNewLinkValue(text);
                                            });
                                    }
                                }}
                                title="Paste from clipboard"
                                style={{ padding: 6 }}
                            >
                                <FaLink />
                            </UnstyledButton>
                        }
                    />

                    <Group>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setAddLinkModalOpened(false);
                                setNewLinkError(null);
                                setNewLinkValue("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddNewLink}>Add link</Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
};
