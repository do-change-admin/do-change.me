'use client'

import React, { FC, useEffect, useState } from "react";
import styles from "./SearchSection.module.css";
import { SearchHistory } from "./SearchHistory/SearchHistory";
import { SampleResults } from "./SampleResults/SampleResults";
import { LoadingMinute, Salvage } from "@/client/components";
import { useSearchParams } from "next/navigation";
import { useBaseInfoByVIN, useActionsHistory, useSalvageCheck, useProfile } from "@/client/hooks";
import { VinSearch } from "./VinSearch/VinSearch";
import cn from "classnames";
import { FaHashtag} from "react-icons/fa";
import { useVINAnalysisState } from "@/client/states/vin-analysis.state";

interface SearchSectionProps {
    openSubscription?: () => void
}

export const SearchSection: FC<SearchSectionProps> = ({ openSubscription }) => {
    const searchParams = useSearchParams();
    const { data: profileData } = useProfile()
    const { data: actionsHistory, isFetching } = useActionsHistory()
    const lastCarVin = Object.keys(actionsHistory || {})?.[0]
    const initialVIN = searchParams.get("vin") || (isFetching ? null : (lastCarVin || '1C6RD6FT1CS310366'));

    const setRequestVIN = useVINAnalysisState(x => x.setRequestVIN)
    const requestVIN = useVINAnalysisState(x => x.requestVIN)

    useEffect(() => {
        if (initialVIN) {
            setRequestVIN(initialVIN)
        }
    }, [initialVIN])


    const [activeTab, setActiveTab] = useState<"vin" | "plate">("vin");
    const { data: baseInfo, isLoading } = useBaseInfoByVIN(requestVIN);
    const { data: salvageInfo, isLoading: salvageIsLoading } = useSalvageCheck(requestVIN);

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
                    {(isLoading || salvageIsLoading || isFetching) && <LoadingMinute label="" />}
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
                <SampleResults baseInfo={baseInfo} reportsLeft={profileData?.subscriptionDetails.reportsLeft ?? 0} />
                <SearchHistory searches={actionsHistory} isLoading={isFetching} />
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

