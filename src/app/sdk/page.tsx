"use client";

import { useState } from "react";
import { type CarSaleStatus } from "@/entities";
import {
    Button,
    Tabs,
    TextInput,
    Select,
    Card,
    Badge,
    Group,
    Text,
    Stack,
    Image,
} from "@mantine/core";
import {
    FaPlus,
    FaSearch,
    FaLink,
    FaTimes,
    FaChevronDown,
} from "react-icons/fa";
import styles from "./page.module.css";
import {
    getColorByCarSaleStatus,
    getVisualDataByCarSaleMarketplaceLink,
} from "./sdk.utils";
import { useCarsForSaleUserFilters, useCarsForSaleUserList } from "@/hooks";
import { CarAdder } from "@/components/CarAdder/CarAdder";
import { useDisclosure } from "@mantine/hooks";
import Sell from "@/app/sdk/plug";

const isDEV = process.env.NODE_ENV === "development";

export default function VehiclesPage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [vin, setVin] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [editingId, setEditingId] = useState<string | undefined>();
    const [activeTab, setActiveTab] = useState<CarSaleStatus>("active");

    const { data } = useCarsForSaleUserList({
        pageSize: 10,
        zeroBasedIndex: 0,
        make,
        model,
        status: activeTab,
        vin,
    });

    const { data: filters } = useCarsForSaleUserFilters();

    const vehicles = data?.items ?? [];

    const handleEdit = (id: string) => {
        setEditingId(id);
        open();
    };

    const handleClose = () => {
        setEditingId(undefined);
        close();
    };

    if (isDEV) {
        return (
            <div className={styles.container}>
                <Sell/>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* Add Vehicle Button */}
            <Group mb="lg">
                <Button
                    leftSection={<FaPlus />}
                    color="blue"
                    radius="md"
                    className={styles.addButton}
                    onClick={open}
                >
                    Add Vehicle
                </Button>
            </Group>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value as any)}
                mb="lg"
            >
                <Tabs.List>
                    <Tabs.Tab value="draft">
                        Draft{" "}
                        <Badge color="blue" variant="light" ml={5}>
                            {/*vehicles.filter(v => v.status === 'Active').length*/}
                        </Badge>
                    </Tabs.Tab>
                    <Tabs.Tab value="pending publisher">
                        Pending Publisher{" "}
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

            {/* Filters */}
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
                            // @ts-ignore
                            onChange={setMake}
                            data={filters?.makes}
                            rightSection={<FaChevronDown />}
                        />
                        <Select
                            label="Models"
                            placeholder="All Models"
                            value={model}
                            // @ts-ignore
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
                            onClick={() => {
                                setVin("");
                                setMake("");
                                setModel("");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Group>
                </Stack>
            </Card>

            {/* Vehicles Grid */}
            <div className={styles.vehicleGrid}>
                {(vehicles ?? []).map((v) => (
                    <Card
                        shadow="sm"
                        radius="md"
                        withBorder
                        className={styles.vehicleCard}
                    >
                        <Card.Section style={{ position: "relative" }}>
                            {[v?.photoLinks].map((src) => {
                                return (
                                    <Image
                                        key={`car-photo-${src}`}
                                        src={src}
                                        alt={"Car photo"}
                                        className={styles.vehicleImg}
                                    />
                                );
                            })}
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
                            <Stack>
                                {v.status === "draft" && (
                                    <Button onClick={() => handleEdit(v.id)}>
                                        Edit
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </Card>
                ))}
            </div>

            {opened && (
                <CarAdder
                    draftId={editingId}
                    opened={opened}
                    onClose={handleClose}
                />
            )}
        </div>
    );
}
