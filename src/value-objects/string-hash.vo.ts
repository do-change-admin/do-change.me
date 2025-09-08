import crypto from "crypto";

export class StringHash {
    constructor(private readonly rawValue: string) {}

    value(): string {
        return crypto.createHash("sha256").update(this.rawValue).digest("hex");
    }
}
