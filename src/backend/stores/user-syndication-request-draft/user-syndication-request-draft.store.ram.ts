import { injectable } from 'inversify';
import type z from 'zod';
import { RAMStore } from '@/backend/utils/store/store.ram.utils';
import type { UserSyndicationRequestDraftStore, userSyndicationRequestDraftStoreSchemas } from './user-syndication-request-draft.store';

const CRUDInRAM = RAMStore<UserSyndicationRequestDraftStore>();

@injectable()
export class UserSyndicationRequestDraftRAMStore extends CRUDInRAM implements UserSyndicationRequestDraftStore {
    filtersData: UserSyndicationRequestDraftStore['filtersData'] = async ({ userId }) => {
        const allRequiredData = this.data.filter((x) => x.userId === userId);

        type Filters = z.infer<typeof userSyndicationRequestDraftStoreSchemas.customOperations.filtersData.response>;

        return allRequiredData.reduce<Filters>(
            (accumulator, current) => {
                if (current.make && !accumulator.makes.includes(current.make)) {
                    accumulator.makes.push(current.make);
                }

                if (current.model && !accumulator.models.includes(current.model)) {
                    accumulator.models.push(current.model);
                }

                return accumulator;
            },
            { models: [], makes: [] }
        );
    };
}
