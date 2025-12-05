import { expect, test } from 'vitest';
import { EMailAddress } from './email-address.utility-entity';

test('Domain and username', () => {
    const email = EMailAddress.create('test-username@test.test');
    expect(email.userName).toBe('test-username');
    expect(email.domain).toBe('test.test');
});
