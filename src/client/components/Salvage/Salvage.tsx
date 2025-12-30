"use client";

import React, {FC} from "react";
import styles from "./Salvage.module.css";
import {AiOutlineCheck, AiOutlineClose} from "react-icons/ai";
import cn from "classnames";

export interface ISalvage {
    hasSalvage: boolean;
    isPending: boolean;
}

export const Salvage: FC<ISalvage> = ({hasSalvage, isPending}) => {


    return (
        <div className={styles.container}>
            <div className={cn(styles.wrapper, {
                [styles.red]: hasSalvage,
                [styles.green]: !hasSalvage,
            })}>
                    <span className={styles.text}>
                        {hasSalvage ? "Total Loss" : "No Total Loss"}
                    </span>
                <span className={styles.icon}>
          </span>
            </div>
        </div>
    );
};
