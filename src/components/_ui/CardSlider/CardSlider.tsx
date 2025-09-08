"use client";

import { FC, useRef, useState } from "react";
import { Carousel } from "@mantine/carousel";
import { Image, Box } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import styles from "./CardSlider.module.css";

interface CardSliderProps {
    images: string[];
}

export const CardSlider: FC<CardSliderProps> = ({ images }) => {
    const [loop, setLoop] = useState(false);
    const autoplay = useRef(Autoplay({ delay: 700 }));

    const autoplayConf = loop
        ? {
            plugins: [autoplay.current],
            onMouseEnter: autoplay.current.stop,
            onMouseLeave: autoplay.current.reset,
        }
        : {};

    return (
        <Box
            onMouseEnter={() => setLoop(true)}
            onMouseLeave={() => setLoop(false)}
            className={styles.wrapper}
        >
            <Carousel
                {...autoplayConf}
                withControls={false}
                withIndicators
                controlSize={0}
                classNames={{
                    root: styles.carouselRoot,
                    indicators: styles.indicators,
                    indicator: styles.indicator,
                }}
                height="100%"
            >
                {images?.map((src, index) => (
                    <Carousel.Slide key={index}>
                        <Image
                            src={src}
                            alt={`Slide ${index + 1}`}
                            fit="cover"
                            width="100%"
                            height="100%"
                        />
                    </Carousel.Slide>
                ))}
            </Carousel>
        </Box>
    );
};
