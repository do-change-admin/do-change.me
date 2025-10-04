import { PaginationModel } from "@/value-objects"

export type DataCRUDProvider<
    Models extends { list: unknown, detail: unknown },
    SearchPayload extends { list: unknown, specific: unknown },
    ActionsPayload extends { create: unknown, update: unknown }
> = {
    list: (searchPayload: SearchPayload['list'], pagination: PaginationModel) => Promise<Models['list'][]>,
    details: (searchPayload: SearchPayload['specific']) => Promise<Models['detail'] | null>
    create: (creationPayload: ActionsPayload['create']) => Promise<{ id: string }>,
    updateOne: (searchPayload: SearchPayload['specific'], updatePayload: ActionsPayload['update']) => Promise<{ success: boolean }>,
    deleteOne: (payload: SearchPayload['specific']) => Promise<{ wasFoundBeforeDeletion: boolean }>,
}

export type CRUDModels<List, Detail> = {
    list: List,
    detail: Detail
}

export type CRUDSearchPayload<List, Specific> = {
    list: List,
    specific: Specific
}

export type CRUDActionsPayload<Create, Update> = {
    create: Create,
    update: Update
}