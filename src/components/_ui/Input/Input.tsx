'use client'

import React, {DetailedHTMLProps, FC, InputHTMLAttributes, ReactNode} from 'react';
import styles from "./Input.module.css";

export interface IInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    icon?: ReactNode;
    label?: string;
}

export const Input: FC<IInputProps> = ({label, icon, ...props}) => {
    return (
        <div className={styles.container}>
            {label && (
                <label  className={styles.label}>{label}</label>
            )}
            <div className={styles.inputWrapper}>
                <input {...props}/>
                {icon && (
                    <div className={styles.inputButtons}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};