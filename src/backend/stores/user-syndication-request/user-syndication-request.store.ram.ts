import { injectable } from 'inversify';
import type z from 'zod';
import { RAMStore } from '@/backend/utils/store/store.ram.utils';
import type { UserSyndicationRequestStore, userSyndicationRequestStoreSchemas } from './user-syndication-request.store';

const CRUDInRAM = RAMStore<UserSyndicationRequestStore>();

@injectable()
export class UserSyndicationRequestRAMStore extends CRUDInRAM implements UserSyndicationRequestStore {
    filtersData: UserSyndicationRequestStore['filtersData'] = async ({ userId }) => {
        const allRequiredData = this.data.filter((x) => x.userId === userId);

        type Filters = z.infer<typeof userSyndicationRequestStoreSchemas.customOperations.filtersData.response>;

        return allRequiredData.reduce<Filters>(
            (accumulator, current) => {
                if (!accumulator.makes.includes(current.make)) {
                    accumulator.makes.push(current.make);
                }

                if (!accumulator.models.includes(current.model)) {
                    accumulator.models.push(current.model);
                }

                return accumulator;
            },
            { models: [], makes: [] }
        );
    };
}
