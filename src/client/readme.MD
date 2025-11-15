# Структура

## Общее описание

1. Приложение состоит из **экранов (pages)**
2. Экраны состоят из **компонентов UI-Kit** и **виджетов (widgets)**
3. Виджеты состоят из **компонентов UI-Kit** и **фич (features)**
4. Фичи состоят из **компонентов UI-Kit**, **инкапсулированной в них логики** и **прокидываемых в них сверху Views**, которые отвечают за визуал каких-то вещей, которые не выводятся напрямую из дизайн-системы

В итоге мы получаем такую простую схему: page -> widgets + ui-kit -> features + ui-kit. Для большей прозрачности разберём эту систему снизу вверх.

## Фича (feature)

Зона ответственности - инкапсуляция и предоставление логики для закрытия одного точечного Use Case (AddToFavoritesButton, FavoritesList). В фиче нет никакого визуала, кроме UI-Kit, если он нужен - то есть если, у нас фича представляет из себя кнопку, то она сразу возьмёт кнопку из UI-Kit. Более кастомный визуал прокидывается в Properties, таким образом за визуал фичи отвечает виджет, в котором она используется, а фича отвечает **целиком за всю** логику работы - от запросов и прокидывания данных во Views до корректного проставления `key` в `map`-функции внутри рендера.

Пример фичи, отвечающей за отображение favorites текущего пользователя:

```tsx
// /client/features/favorites/list/favorite-list.feature.tsx

import { FC, PropsWithChildren } from 'react'
import { FavoriteDTO, useFavorites, useFavoriteRemoving } from './favorite-list.feature.api'

export type FavoriteListProps = {
    views: {
        Item: FC<{ item: FavoriteDTO & { removeFromFavorites: () => void } }>,
        List: FC<PropsWithChildren<{ isLoading: boolean, noItems: boolean }>>
    }
}

export const FavoritesList: FC<FavoriteListProps> = ({ views }) => {
    const { Item, List } = views
    const { data, isFetching } = useFavorites()
    const { mutate: removeFromFavorites, isPending } = useFavoriteRemoving()

    const itemsMarkup = data?.items?.map(x => {
        return (
            <Item 
                item={x} 
                removeFromFavorites={() => {
                    removeFromFavorites(x.id)
                }} 
                key={x.id}
            />
        )
    })

    return (
        <List 
            isLoading={isFetching || isPending} 
            noItems={!isFetching && !data?.items?.length}
        >
            {itemsMarkup}
        </List>
    )
}
```

## Виджет (widget)

Зоны ответственности:

1. Предоставление готового к внедрению на страницу компонента, который позволяет закрывать одну или несколько связанных друг с другом Use Cases (EventsTableWidget, FavoriteProductsWidget). Для реализации Use Cases виджет использует фичи, в виджете нет никакой логики, но в то же время виджет целиком отвечает за визуал.
2. Предоставление готового к внедрению на страницу компонента, который отвечает за реализацию какого-то переиспользуемое места на лейауте страницы (HeaderWidget, FooterWidget).

Пример виджета списка избранного, который использует написанную нами фичу:

```tsx
// client/widgets/favorites/favorites.widget.tsx

import { FavoritesList } from '@/client/features/favorites'
import { Typography } from '@/client/ui-kit'
import { FavoritesRow, FavoritesTable } from './views'

export const FavoritesWidget: FC = () => {
    return (
        <div>
            <Typography>Favorites</Typograhy>            
            <FavoritesList views={{ 
                Item: FavoritesRow, 
                List: FavoritesTable 
            }}>
        </div>
    )
}
```

Для простоты примера положим все views в один файл index.tsx, но в реальном коде компоненты FavoritesRow и FavoritesTable будут, конечно, жить в своих папках внутри папки views.

```tsx
// client/widgets/favorites/views/index.tsx

import { FavoritesListProps } from '@/client/features/favorites'
import { Button, Table, Column, Row, Loader, Warning } from '@/client/ui-kit'

export const FavoritesRow: FavoritesListProps['views']['Item'] = ({ 
    item,
    removeFromFavorites
}) => {
    return <Row>
        <Column>{item.title}</Column>
        <Column>
            <Button onClick={() => {
                removeFromFavorites()
            }}>
                Delete from favorites
            </Button>
        </Column>
    </Row>
}

export const FavoritesTable: FavoritesListProps['views']['List'] = ({
    isLoading,
    noItems,
    children
}) => {
    if (isLoading) {
        return <Loader />
    }

    if (noItems) {
        return <Warning title={'No items were found'} />
    }

    return <Table>
        <Row>
            <Column>Title</Column>
            <Column>Actions</Column>
        </Row>
        {children}
    </Table>
}
```


## Экран (page)

Зона ответственности - цельная страница у пользователя. 

Хранятся в /app/pages, тут мы просто по максимуму используем то, что нам даёт next и не переизобретаем то, что уже классно работает.

Какого-то кастомного нейминга им не нужно, достаточно просто export default в page.tsx в папке, по структуре папок уже понятно, что это за экран и как мы на него можем попасть.

Пример:

```tsx
// app/pages/favorites/list/page.tsz

import { FavoritesWidget, HeaderWidget, FooterWidget } from '@/client/widgets'

export default function() {
    /**
     * Понятно, что хэдер и футер будут скорее в layout.tsx в реальном
     * коде, но для простоты и явности примера оставим тут.
     */ 
    return <div>
        <HeaderWidget />
        <FavoritesWidget />
        <FooterWidget />
    </div>
}
```

## Итоги и мотивация

Таким образом, мы видим следующее:

1. Если меняется только визуал, мы не трогаем логику => точно её не ломаем
2. Если меняется логика, мы не трогаем визуал => точно его не ломаем
3. Фича может выглядеть вообще как угодно в контексте каждого виджета. Если нам нужно в нескольких местах одно и то же по логике, но чтобы оно выглядело по разному (например, уведомления в сайдбаре и отдельная страница с уведомлениями) - это одна и та же фича, просто с разным визуалом на уровне разных виджетов
4. Чёткое и очевидное разделение ответственности - логика - фичи, визуал и сборка фич вместе - виджеты, сборка страниц - экраны
5. Можно делать фичи задолго до дизайна и когда будет появляться дизайн, поддерживать его отдельно уже на уровне виджетов, таким образом снимаются все гипотетические блоки на разработку, которые идут из-за визуала
6. Возможна более прозрачная и простая постановка задач - у нас есть чёткое разделение на логические слои в приложении: например, в этом релизе мы реализуем фичу, в следующем - начинаем думать про виджет
7. Прозрачная и быстрая локализация ошибок. Не так выглядит - виджет. Не так работает - фича
8. Никакой боли при гипотетических редизайнах - как бы сильно не поменялся визуал, мы ничего не будем переписывать, просто сделаем другой виджет
9. Формализуется процесс проектирования, появляется возможность оценить качество проектирования и спрогнозировать лёгкость поддержки кода ещё до его написания, просто на уровне разбиения на фичи, виджеты и экраны


## Связанные фичи (Bounded Features)

Некоторые фичи очень тесно связаны между собой таким образом, что их совместное использование продиктовано самим бизнес-процессом, друг без друга они не представляют ценности. Например, список товаров и фильтры, по которым пользователь настраивает выдачу в этом списке. С одной стороны, это две разные фичи, потому что они отвечают за разные атомарные юз кейсы (видеть выдачу и настраивать выдачу), но с другой - они всё ещё тесно связаны. В такои случае допускается использование общего стейта. Лучше использовать zustand вместо React.context, чтобы в виджете не париться с тем, чтобы обернуть всё в какой-то context provider. Плюс они могут далеко друг от друга находиться, или вообще где-то может не быть какого-то компонента (например, фильтры доступны только подписчикам с определённым уровнем подписки). В таком случае эти фичи должны лежать в одной подпапке.

Пример: 
- `/features/products/products.feature.state.ts` - тут zustand стор, в котором хранятся фильтры
- `/features/products/list/product.list.feature.tsx` (использует стейт, чтобы получить фильтры)
- `/features/products/filters/product.filters.feature.tsx` (использует стейт, чтобы записать фильтры)
- `/features/products/index.ts` - тут экспорт `ProductList` и `ProductFilters`

Важно: этот стейт должен быть атомарным, никакие другие фичи, кроме тех, которые лежать в этой подпапке с ним взаимодействовать не должны. Естественно, этот стор не будет использоваться и в виджете. То есть это просто деталь технической релизации связанных друг с другом по смыслу фич, про который никто кроме них не знает.