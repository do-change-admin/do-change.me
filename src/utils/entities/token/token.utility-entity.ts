import crypto from 'crypto';
import z from 'zod';
import { StringHash } from '../string-hash';

export type TokenModel = z.infer<typeof Token.schema>;

export class Token {
    static schema = z.object({
        raw: z.string().nonempty(),
        hash: z.string().nonempty(),
        expiresAt: z.date()
    });

    private constructor(private readonly data: TokenModel) {}

    static withTimeToLive = (ttlMs: number): Token => {
        const raw = crypto.randomBytes(32).toString('hex');
        const hash = StringHash.create(raw).hashValue;
        const expiresAt = new Date(Date.now() + ttlMs);

        return new Token(Token.schema.parse({ raw, hash, expiresAt }));
    };

    static rehydrate = (data: TokenModel): Token => {
        return new Token(Token.schema.parse(data));
    };

    get model(): TokenModel {
        return this.data;
    }

    get isExpired(): boolean {
        return new Date() > this.data.expiresAt;
    }
}
