"use client";

import React, {FC} from "react";
import styles from "./Salvage.module.css";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import cn from "classnames";

export interface ISalvage {
    hasSalvage: boolean;
    isPending: boolean;
}

export const Salvage:FC<ISalvage> = ({hasSalvage, isPending}) => {


    return (
        <div className={styles.container}>
            {isPending ? (
                <div className={styles.skeleton}></div>
            ) : (
                <div className={cn(styles.wrapper, {
                    [styles.red]: hasSalvage,
                    [styles.green]: !hasSalvage,
                })}>
                    <span className={styles.text}>
                        {hasSalvage
                        ? "Salvage or Total loss"
                        : "Clean VIN, no salvage reported"}
                    </span>
                    <span className={styles.icon}>
            {hasSalvage ? <AiOutlineClose size={18} /> : <AiOutlineCheck size={18} />}
          </span>
                </div>
            )}
        </div>
    );
};
