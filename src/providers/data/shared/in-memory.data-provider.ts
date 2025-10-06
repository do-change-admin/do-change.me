import { injectable } from "inversify";
import { DataCRUDProvider } from "./shared-types.data-providers";
import { v4 } from "uuid";

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

export const generateInMemoryCRUDProvider = <DataProvider>(options?: {
    searchLogic?: {
        list?: (entity: ExtractCRUDParams<DataProvider>['Models']['detail'], pattern: ExtractCRUDParams<DataProvider>['SearchPayload']['list']) => boolean,
        specific?: (entity: ExtractCRUDParams<DataProvider>['Models']['detail'], pattern: ExtractCRUDParams<DataProvider>['SearchPayload']['specific']) => boolean,
    },
    mappers?: {
        detailToList?: (details: ExtractCRUDParams<DataProvider>['Models']['detail']) => ExtractCRUDParams<DataProvider>['Models']['list'],
        createPayloadToDetail?: (details: ExtractCRUDParams<DataProvider>['ActionsPayload']['create']) => ExtractCRUDParams<DataProvider>['Models']['detail'],
        updatePayloadToDetail?: (prevValue: ExtractCRUDParams<DataProvider>['Models']['detail'], update: ExtractCRUDParams<DataProvider>['ActionsPayload']['update']) => ExtractCRUDParams<DataProvider>['Models']['detail']
    },
    initialData?: Array<ExtractCRUDParams<DataProvider>['Models']['detail']>
}) => {
    @injectable()
    class InMemoryCRUDProvider implements DataCRUDProvider<ExtractCRUDParams<DataProvider>['Models'], ExtractCRUDParams<DataProvider>['SearchPayload'], ExtractCRUDParams<DataProvider>['ActionsPayload']> {
        protected data = [] as Array<ExtractCRUDParams<DataProvider>['Models']['detail']>

        protected listSearchLogic = (entity: ExtractCRUDParams<DataProvider>['Models']['detail'], pattern: ExtractCRUDParams<DataProvider>['SearchPayload']['list']) => {
            const patternKeys = Object.entries(pattern as object).filter(([_, value]) => !!value).map(x => x[0]);;
            const entityAsObject = entity as object

            return Object.entries(entityAsObject).filter(([key]) => patternKeys.includes(key)).every(([key, value]) => {
                return value === (pattern as Record<string, any>)[key]
            })
        }

        protected specificSearchLogic = (entity: ExtractCRUDParams<DataProvider>['Models']['detail'], pattern: ExtractCRUDParams<DataProvider>['SearchPayload']['specific']) => {
            const patternKeys = Object.entries(pattern as object).filter(([_, value]) => !!value).map(x => x[0]);
            const entityAsObject = entity as object

            return Object.entries(entityAsObject).filter(([key]) => patternKeys.includes(key)).every(([key, value]) => {
                return value === (pattern as Record<string, any>)[key]
            })
        }

        protected mapDetailToList = (entity: ExtractCRUDParams<DataProvider>['Models']['detail']): ExtractCRUDParams<DataProvider>['Models']['list'] => {
            return entity as ExtractCRUDParams<DataProvider>['Models']['list']
        }

        protected mapCreatePayloadToDetail = (payload: ExtractCRUDParams<DataProvider>['ActionsPayload']['create']): ExtractCRUDParams<DataProvider>['Models']['detail'] => {
            return {
                ...payload as object,
                id: v4()
            }
        }

        protected mapUpdatePayloadToDetail = (prevValue: ExtractCRUDParams<DataProvider>['Models']['detail'], update: ExtractCRUDParams<DataProvider>['ActionsPayload']['update']): ExtractCRUDParams<DataProvider>['Models']['detail'] => {
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

        list: DataCRUDProvider<ExtractCRUDParams<DataProvider>['Models'], ExtractCRUDParams<DataProvider>['SearchPayload'], ExtractCRUDParams<DataProvider>['ActionsPayload']>['list'] = async (searchPayload, pagination) => {
            const afterFiltration = this.data.filter((x) => this.listSearchLogic(x, searchPayload))
            const afterPagination = afterFiltration.filter((_, i) => {
                return i >= pagination.pageSize * pagination.zeroBasedIndex && i < (pagination.zeroBasedIndex + 1) * pagination.pageSize
            })
            return afterPagination.map((x) => this.mapDetailToList(x))
        }

        details: DataCRUDProvider<ExtractCRUDParams<DataProvider>['Models'], ExtractCRUDParams<DataProvider>['SearchPayload'], ExtractCRUDParams<DataProvider>['ActionsPayload']>['details'] = async (searchPayload) => {
            const details = this.data.find(x => this.specificSearchLogic(x, searchPayload))

            if (!details) {
                return null
            }

            return details
        };

        create: DataCRUDProvider<ExtractCRUDParams<DataProvider>['Models'], ExtractCRUDParams<DataProvider>['SearchPayload'], ExtractCRUDParams<DataProvider>['ActionsPayload']>['create'] = async (payload) => {
            const newItem = this.mapCreatePayloadToDetail(payload)
            this.data = this.data.concat(newItem)
            return { id: (newItem as { id: string }).id }
        };

        updateOne: DataCRUDProvider<ExtractCRUDParams<DataProvider>['Models'], ExtractCRUDParams<DataProvider>['SearchPayload'], ExtractCRUDParams<DataProvider>['ActionsPayload']>['updateOne'] = async (searchPayload, updatePayload) => {
            const index = this.data.findIndex((x) => this.specificSearchLogic(x, searchPayload))

            this.data = this.data.map((x, i) => {
                if (i !== index) {
                    return x
                }

                return this.mapUpdatePayloadToDetail(x, updatePayload)
            })

            return { success: index > -1 }
        };

        deleteOne: DataCRUDProvider<ExtractCRUDParams<DataProvider>['Models'], ExtractCRUDParams<DataProvider>['SearchPayload'], ExtractCRUDParams<DataProvider>['ActionsPayload']>['deleteOne'] = async (searchPayload) => {
            const index = this.data.findIndex((x) => this.specificSearchLogic(x, searchPayload))

            this.data = this.data.filter((x, i) => i !== index)

            return { wasFoundBeforeDeletion: index > -1 }
        }
    }
    return InMemoryCRUDProvider
}