export class EmailAddress {
    private constructor(private readonly raw: string) { }

    /**
     * Unsafe.
     */
    static create = (rawAddress: string) => {
        const address = new EmailAddress(rawAddress)
        if (!address.isValid()) {
            throw new Error('Invalid email address')
        }
        return address
    }

    private isValid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.raw);
    }

    address = () => {
        return this.raw
    }
}