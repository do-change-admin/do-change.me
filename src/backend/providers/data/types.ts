// import { PaginationDTO } from "@/value-objects/pagination.value-object"

type Pagination = { zeroBasedIndex: number, pageSize: number }

export type DataCRUDProvider<
    Models extends { list: unknown, detail: unknown },
    SearchPayload extends { list: unknown, specific: unknown },
    ActionsPayload extends { create: unknown, update: unknown }
> = {
    list: (searchPayload: SearchPayload['list'], pagination: Pagination) => Promise<Models['list'][]>,
    details: (searchPayload: SearchPayload['specific']) => Promise<Models['detail'] | null>
    create: (creationPayload: ActionsPayload['create']) => Promise<{ id: string }>,
    updateOne: (searchPayload: SearchPayload['specific'], updatePayload: ActionsPayload['update']) => Promise<{ success: boolean }>,
    deleteOne: (payload: SearchPayload['specific']) => Promise<{ success: boolean }>,
}

export type Models<List, Detail> = {
    list: List,
    detail: Detail
}

export type SearchPayload<List, Specific> = {
    list: List,
    specific: Specific
}

export type ActionsPayload<Create, Update> = {
    create: Create,
    update: Update
}