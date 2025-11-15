import z from "zod";
export class EmailAddress {
    static emailAddressschema = z.email();

    private constructor(private readonly raw: string) {}

    /**
     * Unsafe.
     */
    static create = (rawAddress: string) => {
        return new EmailAddress(
            EmailAddress.emailAddressschema.parse(rawAddress)
        );
    };

    get adress(): string {
        return this.raw;
    }
}

export type EmailAddressSchema = z.infer<
    typeof EmailAddress.emailAddressschema
>;
