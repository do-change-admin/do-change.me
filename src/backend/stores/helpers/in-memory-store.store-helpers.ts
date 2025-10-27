import { injectable } from "inversify";
import { v4 } from "uuid";
import { CRUDStore } from "./abstract-models.store-helpers";

type ExtractCRUDParams<T> =
    T extends {
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

export const newInMemoryStore = <Store>(options?: {
    searchLogic?: {
        list?: (entity: ExtractCRUDParams<Store>['Models']['detail'], pattern: ExtractCRUDParams<Store>['SearchPayload']['list']) => boolean,
        specific?: (entity: ExtractCRUDParams<Store>['Models']['detail'], pattern: ExtractCRUDParams<Store>['SearchPayload']['specific']) => boolean,
    },
    mappers?: {
        detailToList?: (details: ExtractCRUDParams<Store>['Models']['detail']) => ExtractCRUDParams<Store>['Models']['list'],
        createPayloadToDetail?: (details: ExtractCRUDParams<Store>['ActionsPayload']['create']) => ExtractCRUDParams<Store>['Models']['detail'],
        updatePayloadToDetail?: (prevValue: ExtractCRUDParams<Store>['Models']['detail'], update: ExtractCRUDParams<Store>['ActionsPayload']['update']) => ExtractCRUDParams<Store>['Models']['detail']
    },
    initialData?: Array<ExtractCRUDParams<Store>['Models']['detail']>
}) => {
    @injectable()
    class InMemoryCRUDProvider implements CRUDStore<ExtractCRUDParams<Store>['Models'], ExtractCRUDParams<Store>['SearchPayload'], ExtractCRUDParams<Store>['ActionsPayload']> {
        protected data = [] as Array<ExtractCRUDParams<Store>['Models']['detail']>

        protected listSearchLogic = (entity: ExtractCRUDParams<Store>['Models']['detail'], pattern: ExtractCRUDParams<Store>['SearchPayload']['list']) => {
            const patternKeys = Object.entries(pattern as object).filter(([_, value]) => !!value).map(x => x[0]);;
            const entityAsObject = entity as object

            return Object.entries(entityAsObject).filter(([key]) => patternKeys.includes(key)).every(([key, value]) => {
                return value === (pattern as Record<string, any>)[key] || value?.toString()?.includes((pattern as Record<string, any>)[key]?.toString())
            })
        }

        protected specificSearchLogic = (entity: ExtractCRUDParams<Store>['Models']['detail'], pattern: ExtractCRUDParams<Store>['SearchPayload']['specific']) => {
            const patternKeys = Object.entries(pattern as object).filter(([_, value]) => !!value).map(x => x[0]);
            const entityAsObject = entity as object

            return Object.entries(entityAsObject).filter(([key]) => patternKeys.includes(key)).every(([key, value]) => {
                return value === (pattern as Record<string, any>)[key] || value?.toString()?.includes((pattern as Record<string, any>)[key]?.toString())
            })
        }

        protected mapDetailToList = (entity: ExtractCRUDParams<Store>['Models']['detail']): ExtractCRUDParams<Store>['Models']['list'] => {
            return entity as ExtractCRUDParams<Store>['Models']['list']
        }

        protected mapCreatePayloadToDetail = (payload: ExtractCRUDParams<Store>['ActionsPayload']['create']): ExtractCRUDParams<Store>['Models']['detail'] => {
            return {
                ...payload as object,
                id: v4()
            }
        }

        protected mapUpdatePayloadToDetail = (prevValue: ExtractCRUDParams<Store>['Models']['detail'], update: ExtractCRUDParams<Store>['ActionsPayload']['update']): ExtractCRUDParams<Store>['Models']['detail'] => {
            return {
                ...prevValue as object,
                ...update as object
            }
        }

        public constructor() {
            if (!options) {
                return
            }

            if (options.searchLogic) {
                if (options.searchLogic.list) {
                    this.listSearchLogic = options.searchLogic.list
                }

                if (options.searchLogic.specific) {
                    this.specificSearchLogic = options.searchLogic.specific
                }
            }

            if (options.mappers) {
                if (options.mappers.detailToList) {
                    this.mapDetailToList = options.mappers.detailToList
                }
                if (options.mappers.createPayloadToDetail) {
                    this.mapCreatePayloadToDetail = options.mappers.createPayloadToDetail
                }
                if (options.mappers.updatePayloadToDetail) {
                    this.mapUpdatePayloadToDetail = options.mappers.updatePayloadToDetail
                }
            }

            if (options.initialData) {
                this.data = [...options.initialData]
            }
        }

        list: CRUDStore<ExtractCRUDParams<Store>['Models'], ExtractCRUDParams<Store>['SearchPayload'], ExtractCRUDParams<Store>['ActionsPayload']>['list'] = async (searchPayload, pagination) => {
            const afterFiltration = this.data.filter((x) => this.listSearchLogic(x, searchPayload))
            const afterPagination = afterFiltration.filter((_, i) => {
                return i >= pagination.pageSize * pagination.zeroBasedIndex && i < (pagination.zeroBasedIndex + 1) * pagination.pageSize
            })
            return afterPagination.map((x) => this.mapDetailToList(x))
        }

        details: CRUDStore<ExtractCRUDParams<Store>['Models'], ExtractCRUDParams<Store>['SearchPayload'], ExtractCRUDParams<Store>['ActionsPayload']>['details'] = async (searchPayload) => {
            const details = this.data.find(x => this.specificSearchLogic(x, searchPayload))

            if (!details) {
                return null
            }

            return details
        };

        create: CRUDStore<ExtractCRUDParams<Store>['Models'], ExtractCRUDParams<Store>['SearchPayload'], ExtractCRUDParams<Store>['ActionsPayload']>['create'] = async (payload) => {
            const newItem = this.mapCreatePayloadToDetail(payload)
            this.data = this.data.concat(newItem)
            return { id: (newItem as { id: string }).id }
        };

        updateOne: CRUDStore<ExtractCRUDParams<Store>['Models'], ExtractCRUDParams<Store>['SearchPayload'], ExtractCRUDParams<Store>['ActionsPayload']>['updateOne'] = async (searchPayload, updatePayload) => {
            const index = this.data.findIndex((x) => this.specificSearchLogic(x, searchPayload))

            this.data = this.data.map((x, i) => {
                if (i !== index) {
                    return x
                }

                return this.mapUpdatePayloadToDetail(x, updatePayload)
            })

            return { success: index > -1 }
        };

        deleteOne: CRUDStore<ExtractCRUDParams<Store>['Models'], ExtractCRUDParams<Store>['SearchPayload'], ExtractCRUDParams<Store>['ActionsPayload']>['deleteOne'] = async (searchPayload) => {
            const index = this.data.findIndex((x) => this.specificSearchLogic(x, searchPayload))

            this.data = this.data.filter((x, i) => i !== index)

            return { success: index > -1 }
        }
    }
    return InMemoryCRUDProvider
}