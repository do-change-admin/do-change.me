import { injectable } from 'inversify';
import { RAMStore } from '@/backend/utils/store/store.ram.utils';
import type { UserStore } from './user.store';

const CRUDInRAM = RAMStore<UserStore>();

@injectable()
export class UserRAMStore extends CRUDInRAM implements UserStore {}
