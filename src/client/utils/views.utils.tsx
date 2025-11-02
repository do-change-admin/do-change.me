import { FC, PropsWithChildren } from "react";

/**
 * HOC, принимающий в себя компонент Feature и Views, нужные для его отрисовки (типы выводятся автоматически).
 * Возвращает стилизованный компонент Feature, который можно использовать в слое приложения.
 */
export const injectViews = <T extends FC<any>,>(Feature: T, views: T extends FC<infer Props> ? Props extends { views: unknown } ? Props['views'] : never : never) => {
    type Props = T extends FC<infer Props> ? Props : never;

    const FeatureWithInjectedViews: FC<Omit<Props, 'views'>> = (data) => {
        // @ts-ignore
        return <Feature {...data} views={views} />
    }

    return FeatureWithInjectedViews
}

/**
 * View для отрисовки каких-то данных, поступающих во View как Props.
 */
export type View<Data> = FC<Data>

/**
 * View для разных контейнеров и Wrapper. Принимает children. 
 */
export type WrapperView = FC<PropsWithChildren>

/**
 * View для отрисовки частей фичи, где внешний вид отрисовки 
 * не зависит от данных (лоадеры, No items were found и тому подобное).
 */
export type SeparateView = FC

/**
 * Утилитный тип для получения всех View Feature-компонента. Может понадобиться, если будет
 * необходимость выноса View в отдельные компоненты для их удобной типизации.
 */
export type FeatureViews<T extends FC<any>> = T extends FC<infer Props> ? Props extends { views: unknown } ? Props['views'] : never : never