import z from 'zod';

export type EMailAddressModel = z.infer<typeof EMailAddress.schema>;

export class EMailAddress {
    static schema = z.email().nonempty();

    private constructor(private readonly data: EMailAddressModel) {}

    static create = (data: EMailAddressModel) => {
        return new EMailAddress(EMailAddress.schema.parse(data.trim()));
    };

    get model(): EMailAddressModel {
        return this.data;
    }

    same = (address: EMailAddress) => {
        return this.data === address.data;
    };

    get domain() {
        return this.data.split('@')[1];
    }

    get userName() {
        return this.data.split('@')[0];
    }
}
