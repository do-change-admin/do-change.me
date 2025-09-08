"use client";

import styles from "./SlideMenu.module.css";
import { useSlideMenu } from "@/contexts";
import cn from "classnames";
import {FaChevronLeft } from "react-icons/fa6";
import React from "react";
import {FiX} from "react-icons/fi";

export const SlideMenu = () => {
    const { isOpen, content, toggleMenu } = useSlideMenu();

    return (
        <div className={cn(styles.subMenu, {
            [styles.subMenuOpen]: isOpen
        })}>
            {isOpen && (
                <>
                    <div className={styles.header}>
                    <button className={styles.closeButton} onClick={toggleMenu}>
                        <FiX />
                    </button>
                </div>
                    <div>{content}</div>
                    <button className={styles.toggle} onClick={toggleMenu}>
                        <FaChevronLeft/>
                    </button>
                </>
            )}

        </div>
    );
};
