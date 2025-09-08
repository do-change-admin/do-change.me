import crypto from "crypto";
import { StringHash } from "./string-hash.vo";

export class Token {
    private constructor(
        readonly raw: string,
        readonly hash: string,
        readonly expiresAt: Date
    ) {
        this.raw = raw;
        this.hash = hash;
        this.expiresAt = expiresAt;
    }

    static withTimeToLive = (ms: number): Token => {
        const raw = crypto.randomBytes(32).toString("hex");
        const hash = new StringHash(raw).value();
        const expiresAt = new Date(Date.now() + ms);

        return new Token(raw, hash, expiresAt);
    };

    static rehydrate = (raw: string, hash: string, expiresAt: Date): Token => {
        return new Token(raw, hash, expiresAt);
    };

    isExpired = (): boolean => {
        return new Date() > this.expiresAt;
    };
}
