import crypto from "crypto";

export class Instance {
    constructor(private readonly rawValue: string) { }

    value(): string {
        return crypto.createHash("sha256").update(this.rawValue).digest("hex");
    }

    isSame(hash: Instance): boolean {
        return this.rawValue === hash.rawValue
    }
}
