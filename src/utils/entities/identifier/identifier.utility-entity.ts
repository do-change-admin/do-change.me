import z from 'zod';

export type IdentifierModel = z.infer<typeof Identifier.schema>;

export class Identifier {
    static schema = z.string().nonempty();

    private constructor(private readonly data: string) {}

    static create = (data: IdentifierModel) => {
        return new Identifier(Identifier.schema.parse(data));
    };

    get model(): IdentifierModel {
        return this.data;
    }

    same = (data: Identifier) => {
        return this.model === data.model;
    };

    isUUIDv4() {
        return z.uuidv4().safeParse(this.data).success;
    }
}
