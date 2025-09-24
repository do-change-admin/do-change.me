"use client";

import React, { FC } from "react";
import styles from "./CarInfo.module.css";
import {
    FaGasPump,
    FaRoad,
    FaTruck,
    FaCog,
    FaInfoCircle,
    FaShieldAlt,
    FaUserShield,
    FaShieldVirus,
    FaUserCheck,
    FaCarCrash,
} from "react-icons/fa";

export interface ICarInfo {
    Make?: string | null;
    Model?: string | null;
    Trim?: string | null;
    BodyClass?: string | null;
    ModelYear?: string | null;
    PlantCountry?: string | null;
    DisplacementL?: string | null;
    EngineCylinders?: string | null;
    Turbo?: string | null;
    DriveType?: string | null;
    GVWR?: string | null;
    BodyCabType?: string | null;
    SteeringLocation?: string | null;
    Manufacturer?: string | null;
    PlantCompanyName?: string | null;
    PlantState?: string | null;
    OtherEngineInfo?: string | null;
    AirBagLocFront?: string | null;
    AirBagLocSide?: string | null;
    SeatBeltsAll?: string | null;
    BrakeSystemType?: string | null;
}

export const CarInfo: FC<ICarInfo> = ({

    BodyClass,
    PlantCountry,
    DisplacementL,
    EngineCylinders,
    Turbo,
    DriveType,
    GVWR,
    BodyCabType,
    SteeringLocation,
    Manufacturer,
    PlantCompanyName,
    PlantState,
    OtherEngineInfo,
    AirBagLocFront,
    AirBagLocSide,
    SeatBeltsAll,
    BrakeSystemType,
}) => {
    return (
        <div id="car-specs-container" className={styles.container}>
            <div id="car-specs-card" className={styles.card}>

                {/* HEADER*/}

                {/*/!* IMAGE SECTION *!/*/}
                {/*<div id="car-image-section" className={styles.imageSection}>*/}
                {/*    <img className={styles.image} src='https://img2.carmax.com/assets/27625851/hero.jpg?width=800&height=450' alt={``} />*/}
                {/*    <div className={styles.badge}>Verified VIN</div>*/}
                {/*</div>*/}

                {/* CONTENT */}
                <div className={styles.content}>
                    {/* MAIN SPECS */}
                    <div id="main-specs" className={styles.mainSpecs}>
                        <div className={styles.specBox}>
                            <FaCog className={styles.iconBig} />
                            <div className={styles.specValue}>{DisplacementL}L</div>
                            <div className={styles.specLabel}>V{EngineCylinders} Engine</div>
                        </div>
                        <div className={styles.specBox}>
                            <FaGasPump className={styles.iconBig} />
                            <div className={styles.specValue}>Gas</div>
                            <div className={styles.specLabel}>Fuel Type</div>
                        </div>
                        <div className={styles.specBox}>
                            <FaRoad className={styles.iconBig} />
                            <div className={styles.specValue}>{DriveType}</div>
                            <div className={styles.specLabel}>Drive Type</div>
                        </div>
                        <div className={styles.specBox}>
                            <FaTruck className={styles.iconBig} />
                            <div className={styles.specValue}>{GVWR}</div>
                            <div className={styles.specLabel}>GVWR</div>
                        </div>
                    </div>

                    {/* DETAILED SPECS */}
                    <div id="detailed-specs" className={styles.detailedSpecs}>
                        <div id="engine-specs">
                            <h3 className={styles.sectionTitle}>
                                <FaCog className={styles.iconRed} /> Engine & Performance
                            </h3>
                            <div className={styles.specRow}>
                                <span>Engine</span>
                                <span>{DisplacementL}L V{EngineCylinders} Gasoline</span>
                            </div>
                            <div className={styles.specRow}>
                                <span>Cylinders</span>
                                <span>{EngineCylinders}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span>Turbo</span>
                                <span>{Turbo}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span>Drive Type</span>
                                <span>{DriveType}</span>
                            </div>
                        </div>

                        <div id="vehicle-specs">
                            <h3 className={styles.sectionTitle}>
                                <FaInfoCircle className={styles.iconRed} /> Vehicle Details
                            </h3>
                            <div className={styles.specRow}>
                                <span>Body Class</span>
                                <span>{BodyClass}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span>Cab Type</span>
                                <span>{BodyCabType}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span>GVWR</span>
                                <span>{GVWR}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span>Steering</span>
                                <span>{SteeringLocation}</span>
                            </div>
                        </div>
                    </div>

                    {/* SAFETY */}
                    <div id="safety-section" className={styles.safety}>
                        <h3 className={styles.sectionTitle}>
                            <FaShieldAlt className={styles.iconRed} /> Safety Features
                        </h3>
                        <div className={styles.safetyGrid}>
                            <div className={styles.safetyItem}>
                                <FaUserShield className={styles.iconRed} />
                                <span>{AirBagLocFront}</span>
                            </div>
                            <div className={styles.safetyItem}>
                                <FaShieldVirus className={styles.iconRed} />
                                <span>{AirBagLocSide}</span>
                            </div>
                            <div className={styles.safetyItem}>
                                <FaUserCheck className={styles.iconRed} />
                                <span>{SeatBeltsAll}</span>
                            </div>
                            <div className={styles.safetyItem}>
                                <FaCarCrash className={styles.iconRed} />
                                <span>{BrakeSystemType}</span>
                            </div>
                        </div>
                    </div>
                    {/* MANUFACTURING */}
                    <div id="manufacturing-info" className={styles.manufacturing}>
                        <h3 className={styles.manufacturingTitle}>Manufacturing Information</h3>
                        <div className={styles.manufacturingGrid}>
                            <div>
                                <span className={styles.label}>Manufacturer:</span>
                                <span className={styles.value}>{Manufacturer}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Plant:</span>
                                <span className={styles.value}>{PlantCompanyName}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Location:</span>
                                <span className={styles.value}>{PlantState}, {PlantCountry}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Sales Code:</span>
                                <span className={styles.value}>{OtherEngineInfo}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
