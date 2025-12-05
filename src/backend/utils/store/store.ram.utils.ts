import { injectable } from 'inversify';
import { v4 } from 'uuid';
import type { CRUDStore, StoreTypes } from './store.shared-models.utils';

export const RAMStore = <Store>(options?: {
    searchLogic?: {
        list?: (entity: StoreTypes<Store>['details'], pattern: StoreTypes<Store>['findListPayload']) => boolean;
        specific?: (entity: StoreTypes<Store>['details'], pattern: StoreTypes<Store>['findOnePayload']) => boolean;
    };
    mappers?: {
        detailToList?: (details: StoreTypes<Store>['details']) => StoreTypes<Store>['listModel'];
        createPayloadToDetail?: (details: StoreTypes<Store>['createPayload']) => StoreTypes<Store>['details'];
        updatePayloadToDetail?: (
            prevValue: StoreTypes<Store>['details'],
            update: StoreTypes<Store>['updatePayload']
        ) => StoreTypes<Store>['details'];
    };
    initialData?: Array<StoreTypes<Store>['details']>;
}) => {
    type StoreContract = CRUDStore<
        {
            list: StoreTypes<Store>['listModel'];
            detail: StoreTypes<Store>['details'];
        },
        {
            list: StoreTypes<Store>['findListPayload'];
            specific: StoreTypes<Store>['findOnePayload'];
        },
        {
            create: StoreTypes<Store>['createPayload'];
            update: StoreTypes<Store>['updatePayload'];
        }
    >;

    @injectable()
    class RAMStore implements StoreContract {
        protected data = [] as Array<StoreTypes<Store>['details']>;

        protected listSearchLogic = (entity: StoreTypes<Store>['details'], pattern: StoreTypes<Store>['findListPayload']) => {
            const patternKeys = Object.entries(pattern as object)
                .filter(([_, value]) => !!value)
                .map((x) => x[0]);
            const entityAsObject = entity as object;

            return Object.entries(entityAsObject)
                .filter(([key]) => patternKeys.includes(key))
                .every(([key, value]) => {
                    return (
                        value === (pattern as Record<string, any>)[key] ||
                        value?.toString()?.includes((pattern as Record<string, any>)[key]?.toString())
                    );
                });
        };

        protected specificSearchLogic = (entity: StoreTypes<Store>['details'], pattern: StoreTypes<Store>['findOnePayload']) => {
            const patternKeys = Object.entries(pattern as object)
                .filter(([_, value]) => !!value)
                .map((x) => x[0]);
            const entityAsObject = entity as object;

            return Object.entries(entityAsObject)
                .filter(([key]) => patternKeys.includes(key))
                .every(([key, value]) => {
                    return (
                        value === (pattern as Record<string, any>)[key] ||
                        value?.toString()?.includes((pattern as Record<string, any>)[key]?.toString())
                    );
                });
        };

        protected mapDetailToList = (entity: StoreTypes<Store>['details']): StoreTypes<Store>['listModel'] => {
            return entity as StoreTypes<Store>['listModel'];
        };

        protected mapCreatePayloadToDetail = (payload: StoreTypes<Store>['createPayload']): StoreTypes<Store>['details'] => {
            return {
                ...(payload as object),
                id: v4()
            };
        };

        protected mapUpdatePayloadToDetail = (
            prevValue: StoreTypes<Store>['details'],
            update: StoreTypes<Store>['updatePayload']
        ): StoreTypes<Store>['details'] => {
            return {
                ...(prevValue as object),
                ...(update as object)
            };
        };

        public constructor() {
            if (!options) {
                return;
            }

            if (options.searchLogic) {
                if (options.searchLogic.list) {
                    this.listSearchLogic = options.searchLogic.list;
                }

                if (options.searchLogic.specific) {
                    this.specificSearchLogic = options.searchLogic.specific;
                }
            }

            if (options.mappers) {
                if (options.mappers.detailToList) {
                    this.mapDetailToList = options.mappers.detailToList;
                }
                if (options.mappers.createPayloadToDetail) {
                    this.mapCreatePayloadToDetail = options.mappers.createPayloadToDetail;
                }
                if (options.mappers.updatePayloadToDetail) {
                    this.mapUpdatePayloadToDetail = options.mappers.updatePayloadToDetail;
                }
            }

            if (options.initialData) {
                this.data = [...options.initialData];
            }
        }

        list: StoreContract['list'] = async (searchPayload, pagination) => {
            const afterFiltration = this.data.filter((x) => this.listSearchLogic(x, searchPayload));
            const afterPagination = afterFiltration.filter((_, i) => {
                return i >= pagination.pageSize * pagination.zeroBasedIndex && i < (pagination.zeroBasedIndex + 1) * pagination.pageSize;
            });
            return afterPagination.map((x) => this.mapDetailToList(x));
        };

        details: StoreContract['details'] = async (searchPayload) => {
            const details = this.data.find((x) => this.specificSearchLogic(x, searchPayload));

            if (!details) {
                return null;
            }

            return details;
        };

        create: StoreContract['create'] = async (payload) => {
            const newItem = this.mapCreatePayloadToDetail(payload);
            this.data = this.data.concat(newItem);
            return { id: (newItem as { id: string }).id };
        };

        updateOne: StoreContract['updateOne'] = async (searchPayload, updatePayload) => {
            const index = this.data.findIndex((x) => this.specificSearchLogic(x, searchPayload));

            this.data = this.data.map((x, i) => {
                if (i !== index) {
                    return x;
                }

                return this.mapUpdatePayloadToDetail(x, updatePayload);
            });

            return { success: index > -1 };
        };

        deleteOne: StoreContract['deleteOne'] = async (searchPayload) => {
            const index = this.data.findIndex((x) => this.specificSearchLogic(x, searchPayload));

            this.data = this.data.filter((_x, i) => i !== index);

            return { success: index > -1 };
        };
    }
    return RAMStore;
};
