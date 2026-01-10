import type { PaginationModel } from '@/utils/entities/pagination';

export type CRUDStore<
    Models extends { list: unknown; detail: unknown },
    SearchPayload extends { list: unknown; specific: unknown },
    ActionsPayload extends { create: unknown; update: unknown }
> = {
    list: (searchPayload: SearchPayload['list'], pagination: PaginationModel) => Promise<Models['list'][]>;
    details: (searchPayload: SearchPayload['specific']) => Promise<Models['detail'] | null>;
    // TODO: хочется получать полный объект в ответе а не только id
    create: (creationPayload: ActionsPayload['create']) => Promise<{ id: string }>;
    // TODO: хочется получать полный объект в ответе а не только success
    updateOne: (
        searchPayload: SearchPayload['specific'],
        updatePayload: ActionsPayload['update']
    ) => Promise<{ success: boolean }>;
    deleteOne: (payload: SearchPayload['specific']) => Promise<{ success: boolean }>;
};

export type Models<List, Detail> = {
    list: List;
    detail: Detail;
};

export type SearchPayload<List, Specific> = {
    list: List;
    specific: Specific;
};

export type ActionsPayload<Create, Update> = {
    create: Create;
    update: Update;
};

type ExtractCRUDParams<T> = T extends {
    list: (search: infer SList, pagination: any) => Promise<Array<infer MList>>;
    details: (search: infer SDetail) => Promise<infer MDetail>;
    create: (payload: infer ACreate) => Promise<any>;
    updateOne: (search: any, payload: infer AUpdate) => Promise<any>;
    deleteOne: (payload: any) => Promise<any>;
}
    ? {
          Models: { list: NonNullable<MList>; detail: NonNullable<MDetail> };
          SearchPayload: { list: SList; specific: SDetail };
          ActionsPayload: { create: ACreate; update: AUpdate };
      }
    : never;

export type StoreTypes<T> = {
    listModel: ExtractCRUDParams<T>['Models']['list'];
    details: ExtractCRUDParams<T>['Models']['detail'];
    findOnePayload: ExtractCRUDParams<T>['SearchPayload']['specific'];
    findListPayload: ExtractCRUDParams<T>['SearchPayload']['list'];
    createPayload: ExtractCRUDParams<T>['ActionsPayload']['create'];
    updatePayload: ExtractCRUDParams<T>['ActionsPayload']['update'];
};
