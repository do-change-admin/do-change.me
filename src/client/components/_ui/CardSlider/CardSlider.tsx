'use client';

import { Carousel } from '@mantine/carousel';
import { Box, Image } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { type FC, useRef, useState } from 'react';
import styles from './CardSlider.module.css';

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
              onMouseLeave: autoplay.current.reset
          }
        : {};

    return (
        <Box className={styles.wrapper} onMouseEnter={() => setLoop(true)} onMouseLeave={() => setLoop(false)}>
            <Carousel
                {...autoplayConf}
                classNames={{
                    root: styles.carouselRoot,
                    indicators: styles.indicators,
                    indicator: styles.indicator
                }}
                controlSize={0}
                height="100%"
                withControls={false}
                withIndicators
            >
                {images?.map((src, index) => (
                    <Carousel.Slide key={index}>
                        <Image alt={`Slide ${index + 1}`} height={'100'} src={src} width={'100'} />
                    </Carousel.Slide>
                ))}
            </Carousel>
        </Box>
    );
};
