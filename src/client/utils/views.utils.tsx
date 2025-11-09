import { FC } from "react";

export const injectViews = <T extends FC<any>,>(Feature: T, views: T extends FC<infer Props> ? Props extends { views: unknown } ? Props['views'] : never : never) => {
    type Props = T extends FC<infer Props> ? Props : never;

    const FeaturetWithInjectedViews: FC<Omit<Props, 'views'>> = (data) => {
        // @ts-ignore
        return <Feature {...data} views={views} />
    }

    return FeaturetWithInjectedViews
}

export type WithViews<T> = { views: T, containerClass?: string }