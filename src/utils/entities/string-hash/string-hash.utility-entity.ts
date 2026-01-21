import crypto from 'crypto';
import z from 'zod';

export type StringHashModel = z.infer<typeof StringHash.schema>;

export class StringHash {
    static schema = z.string().nonempty();

    private constructor(private readonly data: StringHashModel) {}

    static create = (data: StringHashModel) => {
        return new StringHash(StringHash.schema.parse(data.trim()));
    };

    get model(): StringHashModel {
        return this.data;
    }

    get hashValue(): string {
        return crypto.createHash('sha256').update(this.data).digest('hex');
    }

    same = (stringHash: StringHash) => {
        return this.data === stringHash.model;
    };
}
