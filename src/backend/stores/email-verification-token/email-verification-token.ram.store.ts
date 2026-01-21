import { injectable } from 'inversify';
import { RAMStore } from '@/backend/utils/store/store.ram.utils';
import type { EmailVerificationTokenStore } from './email-verification-token.store';

const CRUDInRAM = RAMStore<EmailVerificationTokenStore>();

@injectable()
export class EmailVerificationTokenRAMStore extends CRUDInRAM implements EmailVerificationTokenStore {}
