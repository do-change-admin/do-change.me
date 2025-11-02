"use client";

import React, { useEffect, useState } from "react";
import styles from "./Alert.module.css";

interface AlertProps {
  message: string;
  type?: "error" | "success";
  duration?: number; // время показа в секундах
  visible: boolean; // контролируем видимость снаружи
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type = "error", duration = 5, visible, onClose }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return <div className={`${styles.alert} ${styles[type]}`}>{message}</div>;
};

export default Alert;

