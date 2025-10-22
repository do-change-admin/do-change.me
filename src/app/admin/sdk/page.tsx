"use client";

import { useState } from "react";

import styles from "./page.module.css";
import {
    Badge,
    Button,
    Card,
    Group,
    Select,
    Stack,
    Tabs,
    Text,
    TextInput,
} from "@mantine/core";
import { FaChevronDown, FaLink } from "react-icons/fa6";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Queries } from "@/hooks";
import {
    getColorByCarSaleStatus,
    getVisualDataByCarSaleMarketplaceLink,
} from "@/app/sdk/sdk.utils";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { SyndicationRequestActiveStatusNames } from "@/entities/sindycation-request-status.entity";
import { CardSlider } from "@/components";
import { CarEditor } from "@/components/_admin/CarEditor/CarEditor";

export default function VehiclesPage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [editingCarId, setEditingCarId] = useState<string | undefined>();
    const [editingUserCarId, setEditingUserCarId] = useState<
        string | undefined
    >();
    const [vin, setVin] = useState("");
    const [debouncedVin] = useDebouncedValue(vin, 500);
    const [make, setMake] = useState<null | string>(null);
    const [model, setModel] = useState<null | string>(null);
    const [activeTab, setActiveTab] =
        useState<SyndicationRequestActiveStatusNames>("active");

    const { data } = Queries.SyndicationRequestManagement.useList({
        make: make ?? "",
        model: model ?? "",
        status: activeTab,
        vin: debouncedVin,
    });

    const { data: filters } = Queries.SyndicationRequestManagement.useFilters();

    const handleClearFilters = () => {
        setVin("");
        setMake(null);
        setModel(null);
    };

    const handleClose = () => {
        setEditingCarId(undefined);
        close();
    };

    const handleEdit = (id: string, userId: string) => {
        setEditingCarId(id);
        setEditingUserCarId(userId);
        open();
    };

    const vehicles = data?.items ?? [];

    return (
        <div className={styles.container}>
            <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value as any)}
                mb="lg"
            >
                <Tabs.List>
                    <Tabs.Tab value="pending publisher">
                        Pending Review{" "}
                        <Badge color="orange" variant="light" ml={5}>
                            {/*vehicles.filter(v => v.status === 'Pending').length*/}
                        </Badge>
                    </Tabs.Tab>
                    <Tabs.Tab value="active">
                        Active{" "}
                        <Badge color="green" variant="light" ml={5}>
                            {/*vehicles.filter(v => v.status === 'Sold').length*/}
                        </Badge>
                    </Tabs.Tab>
                    <Tabs.Tab value="pending sales">
                        Pending Sales{" "}
                        <Badge color="gray" variant="light" ml={5}>
                            {/*vehicles.filter(v => v.status === 'Draft').length*/}
                        </Badge>
                    </Tabs.Tab>
                    <Tabs.Tab value="sold">
                        Sold{" "}
                        <Badge color="gray" variant="light" ml={5}>
                            {/*vehicles.filter(v => v.status === 'Draft').length*/}
                        </Badge>
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>

            <Card
                shadow="sm"
                radius="md"
                withBorder
                className={styles.filtersCard}
            >
                <Stack>
                    <TextInput
                        placeholder="Enter VIN number..."
                        label="Search by VIN Number"
                        value={vin}
                        onChange={(e) => setVin(e.currentTarget.value)}
                        leftSection={<FaSearch />}
                    />
                    <Group>
                        <Select
                            label="Makes"
                            placeholder="All Makes"
                            value={make}
                            onChange={setMake}
                            data={filters?.makes}
                            rightSection={<FaChevronDown />}
                        />
                        <Select
                            label="Models"
                            placeholder="All Models"
                            value={model}
                            onChange={setModel}
                            data={filters?.models}
                            rightSection={<FaChevronDown />}
                        />
                    </Group>
                    <Group align="right">
                        <Button
                            variant="outline"
                            color="gray"
                            leftSection={<FaTimes />}
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </Button>
                    </Group>
                </Stack>
            </Card>

            <div className={styles.vehicleGrid}>
                {vehicles.map((v) => (
                    <Card
                        shadow="sm"
                        radius="md"
                        withBorder
                        className={styles.vehicleCard}
                        onClick={() => handleEdit(v.id, v.userId)}
                    >
                        <Card.Section style={{ position: "relative" }}>
                            {v.photoLinks.length > 0 ? (
                                <CardSlider images={v.photoLinks} />
                            ) : null}
                            <Badge
                                color={getColorByCarSaleStatus(v.status)}
                                className={styles.statusBadge}
                            >
                                {v.status}
                            </Badge>
                        </Card.Section>
                        <Stack mt="sm">
                            <Text fw={600}>{v.make}</Text>
                            <Text size="sm" c="dimmed">
                                {v.model} ({v.year})
                            </Text>
                            <Text
                                size="xs"
                                c="dimmed"
                                style={{ fontFamily: "monospace" }}
                            >
                                VIN: {v.vin}
                            </Text>
                            <Stack gap="xs" mt="xs">
                                {v.marketplaceLinks.map((link) => {
                                    const { color, label } =
                                        getVisualDataByCarSaleMarketplaceLink(
                                            link
                                        );
                                    return (
                                        <Button
                                            key={link}
                                            variant="light"
                                            color={color}
                                            fullWidth
                                            rightSection={<FaLink />}
                                            styles={{
                                                root: {
                                                    justifyContent:
                                                        "space-between",
                                                },
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    </Card>
                ))}
            </div>
            {opened && editingCarId && editingUserCarId && (
                <CarEditor
                    carId={editingCarId}
                    opened={opened}
                    onClose={handleClose}
                    userId={editingUserCarId}
                />
            )}
        </div>
    );
}
