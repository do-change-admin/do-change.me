import {
    ActionIcon,
    Button,
    Divider,
    Grid,
    Group,
    Image,
    Modal,
    NumberInput,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
    UnstyledButton
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { FaCamera, FaDollarSign, FaIdCard, FaLink, FaTrash, FaXmark } from 'react-icons/fa6';
import { z } from 'zod';
import { downloadAllImages } from '@/client/components/_admin/CarEditor/utils';
import {
    useAdminSyndicationRequestDetails,
    useAdminSyndicationRequestUpdate
} from '@/client/queries/syndication-request-management.queries';
import styles from './CarEditor.module.css';

export interface CarEditorProps {
    opened: boolean;
    carId: string;
    onClose: () => void;
}

export const CarEditor: React.FC<CarEditorProps> = ({ onClose, opened, carId }) => {
    const [status, setStatus] = useState<'pending publisher' | 'active' | 'pending sales' | 'sold' | null>(null);
    const [marketplaceLinks, setMarketplaceLinks] = useState<string[]>([]);
    const [addLinkModalOpened, setAddLinkModalOpened] = useState(false);
    const [newLinkError, setNewLinkError] = useState<string | null>(null);
    const [newLinkValue, setNewLinkValue] = useState('');

    const { data: car } = useAdminSyndicationRequestDetails({ id: carId });
    const { mutateAsync: updateCar } = useAdminSyndicationRequestUpdate();

    useEffect(() => {
        if (car) {
            setStatus(car.status ?? null);
            setMarketplaceLinks(car.marketplaceLinks ?? []);
        }
    }, [car?.id]);

    const statusOptions = useMemo(() => {
        return [
            { label: 'Pending publisher', value: 'pending publisher' },
            { label: 'Active', value: 'active' },
            { label: 'Pending sales', value: 'pending sales' },
            { label: 'Sold', value: 'sold' }
        ];
    }, []);

    const handleDeleteLink = (index: number) => {
        setMarketplaceLinks((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddNewLink = () => {
        setNewLinkError(null);

        const parsed = z.url().safeParse(newLinkValue?.trim());
        if (!parsed.success) {
            setNewLinkError('Please enter a valid URL.');
            return;
        }

        setMarketplaceLinks((prev) => [...prev, parsed.data]);
        setNewLinkValue('');
        setAddLinkModalOpened(false);
    };

    const handleSave = async () => {
        await updateCar({
            body: {
                id: carId,
                marketplaceLinks: marketplaceLinks.length ? marketplaceLinks : undefined,
                status: status ?? undefined
            }
        });

        onClose();
    };

    const photoLinks = [car?.mainPhotoLink, ...(car?.additionalPhotoLinks ?? [])].filter((x) => typeof x === 'string');

    return (
        <>
            <Modal
                centered
                classNames={{
                    content: styles.modalContent,
                    body: styles.modalBody,
                    header: styles.modalHeader
                }}
                closeButtonProps={{ icon: <FaXmark /> }}
                onClose={onClose}
                opened={opened}
                overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
                radius="lg"
                size="70%"
                title={
                    <div>
                        <Title order={2}>Edit Car</Title>
                        <Text c="dimmed" size="sm">
                            Fill in the details to list your car for sale
                        </Text>
                    </div>
                }
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
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`
                                    }}
                                    label="VIN Number *"
                                    maxLength={17}
                                    placeholder="Enter 17-character VIN"
                                    readOnly
                                    value={car?.vin}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`
                                    }}
                                    label="Make"
                                    readOnly
                                    value={car?.make}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`
                                    }}
                                    label="Model"
                                    readOnly
                                    value={car?.model}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`
                                    }}
                                    label="Year"
                                    min={1}
                                    readOnly
                                    type="number"
                                    value={car?.year}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <NumberInput
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`
                                    }}
                                    label="Mileage *"
                                    min={0}
                                    placeholder="0"
                                    value={car?.mileage}
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
                                    classNames={{
                                        input: `${styles.input} ${styles.readonlyInput}`
                                    }}
                                    label="Listing Price *"
                                    min={0}
                                    placeholder="0.00"
                                    readOnly
                                    value={car?.price}
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
                                <Text c="dimmed" size="sm">
                                    (1–30 photos)
                                </Text>
                            </Group>
                            <Text c="dimmed" size="sm">
                                {photoLinks.length}/30
                            </Text>
                        </Group>

                        {photoLinks?.length && photoLinks.length > 0 && (
                            <Grid mt="md">
                                {photoLinks.map((photo, idx) => (
                                    <Grid.Col
                                        key={idx}
                                        span={{
                                            base: 6,
                                            sm: 4,
                                            md: 3,
                                            lg: 2
                                        }}
                                    >
                                        <Paper className={styles.photoItem} radius="md" withBorder>
                                            <Image alt={`Photo ${idx + 1}`} className={styles.photoImage} src={photo} />
                                            <div className={styles.photoIndex}>{idx + 1}</div>
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

                        <Group justify="space-between" mb="sm" mt="md">
                            <Text fw={600}>Photos</Text>
                            <Button color="blue" onClick={() => downloadAllImages(photoLinks || [])} variant="light">
                                Car Photos (.zip)
                            </Button>
                        </Group>

                        <Grid mt="md">
                            <Grid.Col span={{ lg: 6, base: 12 }}>
                                <Select
                                    data={statusOptions}
                                    label="Status"
                                    // @ts-expect-error
                                    onChange={setStatus}
                                    placeholder="Select status"
                                    styles={{
                                        input: { minWidth: 220 }
                                    }}
                                    value={status}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ lg: 6, base: 12 }}>
                                <Text mb={4} size="md">
                                    Marketplace links
                                </Text>
                                <Button onClick={() => setAddLinkModalOpened(true)} size="xs" variant="outline">
                                    Add new marketplace link
                                </Button>

                                {marketplaceLinks.length === 0 ? (
                                    <Text c="dimmed" mt={6} size="sm">
                                        No marketplace links added yet.
                                    </Text>
                                ) : (
                                    <Stack gap={6} mt={6}>
                                        {marketplaceLinks.map((lnk, idx) => (
                                            <Group
                                                key={`${lnk}-${idx}`}
                                                style={{
                                                    background: '#fafafa',
                                                    padding: 8,
                                                    borderRadius: 8,
                                                    border: '1px solid rgba(0,0,0,0.04)'
                                                }}
                                            >
                                                <Text
                                                    size="sm"
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: 'calc(100% - 40px)'
                                                    }}
                                                    title={lnk}
                                                >
                                                    {lnk}
                                                </Text>
                                                <Group>
                                                    <ActionIcon
                                                        aria-label="Open marketplace link"
                                                        onClick={() => {
                                                            // открыть ссылку в новой вкладке
                                                            window.open(lnk, '_blank', 'noopener');
                                                        }}
                                                        size="sm"
                                                        variant="light"
                                                    >
                                                        <FaLink />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        aria-label="Delete marketplace link"
                                                        color="red"
                                                        onClick={() => handleDeleteLink(idx)}
                                                        size="sm"
                                                        variant="light"
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
                        <Button leftSection={<FaSave />} onClick={handleSave} variant="outline">
                            Save
                        </Button>
                    </Group>
                </Group>
            </Modal>

            <Modal
                centered
                onClose={() => {
                    setAddLinkModalOpened(false);
                    setNewLinkError(null);
                    setNewLinkValue('');
                }}
                opened={addLinkModalOpened}
                size="lg"
                title="Add marketplace link"
            >
                <Stack gap={6}>
                    <TextInput
                        error={newLinkError ?? undefined}
                        label="Marketplace URL"
                        onChange={(e) => setNewLinkValue(e.currentTarget.value)}
                        placeholder="https://example.com/your-listing"
                        rightSection={
                            <UnstyledButton
                                onClick={() => {
                                    if (navigator.clipboard) {
                                        navigator.clipboard.readText().then((text) => {
                                            setNewLinkValue(text);
                                        });
                                    }
                                }}
                                style={{ padding: 6 }}
                                title="Paste from clipboard"
                            >
                                <FaLink />
                            </UnstyledButton>
                        }
                        value={newLinkValue}
                    />

                    <Group>
                        <Button
                            onClick={() => {
                                setAddLinkModalOpened(false);
                                setNewLinkError(null);
                                setNewLinkValue('');
                            }}
                            variant="outline"
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
