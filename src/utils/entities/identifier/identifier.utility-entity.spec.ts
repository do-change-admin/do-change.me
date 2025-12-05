import { v4 } from 'uuid';
import { expect, test } from 'vitest';
import { Identifier } from './identifier.utility-entity';

test('uuid check', () => {
    expect(Identifier.create(v4()).isUUIDv4()).toBe(true);
    expect(Identifier.create(Math.random().toString()).isUUIDv4()).toBe(false);
});
