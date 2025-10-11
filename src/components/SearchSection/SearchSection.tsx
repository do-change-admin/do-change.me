'use client'

import React, {FC, useState} from "react";
import styles from "./SearchSection.module.css";
import { SearchHistory } from "./SearchHistory/SearchHistory";
import { SampleResults } from "./SampleResults/SampleResults";
import { LoadingMinute, Salvage } from "@/components";
import { useSearchParams } from "next/navigation";
import { useBaseInfoByVIN, useActionsHistory, useSalvageCheck, useProfile } from "@/hooks";
import { VinSearch } from "./VinSearch/VinSearch";
import cn from "classnames";
import {FaCar, FaHashtag} from "react-icons/fa";

interface SearchSectionProps {
    openSubscription?: () => void
}

export const SearchSection: FC<SearchSectionProps> = ({ openSubscription }) => {
    const searchParams = useSearchParams();
    const { data: profileData } = useProfile()
    const vin = searchParams.get("vin") || '1C6RD6FT1CS310366';
    const [activeTab, setActiveTab] = useState<"vin" | "plate">("vin");

    const actionsHistoryResponse = useActionsHistory({ skip: 0, take: 10 })

    const { data: baseInfo, isLoading } = useBaseInfoByVIN(vin);
    const { data: salvageInfo, isLoading: salvageIsLoading } = useSalvageCheck(vin);

    return (
        <section className={styles.searchSection}>
            <div className={styles.container}>
                <div className={cn(styles.glass, {
                    [styles.bgClean]: !salvageInfo?.salvageWasFound,
                    [styles.bgSalvage]: salvageInfo?.salvageWasFound,
                })}>
                    <div className={styles.searchSectionHeader}>
                        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                    <Salvage hasSalvage={salvageInfo?.salvageWasFound ?? false} isPending={salvageIsLoading} />
                    {(isLoading || salvageIsLoading) && <LoadingMinute label="We’re compiling the Vehicle History Report" />}
                    <div className={styles.searchSectionHeader}>
                        <div className={styles.header}>
                            <div className={styles.headerFlex}>
                                <div>
                                    <h1 className={styles.title}>{baseInfo?.Make} {baseInfo?.Model} {baseInfo?.Trim}</h1>
                                    <p className={styles.subtitle}>{baseInfo?.BodyClass} {baseInfo?.ModelYear}</p>
                                </div>
                                <div className={styles.textRight}>
                                    <div className={styles.vin}>VIN: {baseInfo?.VIN}</div>
                                    <div className={styles.country}>Made in {baseInfo?.PlantCountry}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <VinSearch openSubscription={openSubscription} />
                </div>
                <SampleResults baseInfo={baseInfo} reportsLeft={profileData?.subscriptionDetails.reportsLeft ?? 0} vin={vin} />
                <SearchHistory searches={actionsHistoryResponse.data} isLoading={actionsHistoryResponse.isFetching || actionsHistoryResponse.isLoading} />
            </div>
        </section>
    );
}

function Tabs({
                  activeTab,
                  setActiveTab,
              }: {
    activeTab: "vin" | "plate";
    setActiveTab: (tab: "vin" | "plate") => void;
}) {
    return (
        <div className={styles.tabs}>
            <button
                className={`${styles.tabButton} ${activeTab === "vin" ? styles.active : ""}`}
                onClick={() => setActiveTab("vin")}
            >
                <FaHashtag className={styles.icon} /> VIN Number
            </button>
            {/*<button*/}
            {/*    className={`${styles.tabButton} ${activeTab === "plate" ? styles.active : ""}`}*/}
            {/*    onClick={() => setActiveTab("plate")}*/}
            {/*>*/}
            {/*    <FaCar className={styles.icon} /> License Plate*/}
            {/*</button>*/}
        </div>
    );
}

