import crypto from "crypto";

export class Instance {
    constructor(private readonly rawValue: string) { }

    value(): string {
        return crypto.createHash("sha256").update(this.rawValue).digest("hex");
    }

    areSame(s: Instance): boolean {
        return s.rawValue === this.rawValue
    }
}
