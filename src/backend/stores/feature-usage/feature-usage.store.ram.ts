import { injectable } from 'inversify';
import { RAMStore } from '@/backend/utils/store/store.ram.utils';
import type { FeatureUsageStore } from './feature-usage.store';

const CRUDInRAM = RAMStore<FeatureUsageStore>();

@injectable()
export class FeatureUsageRAMStore extends CRUDInRAM implements FeatureUsageStore {}
