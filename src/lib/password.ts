import { hash } from "bcryptjs";

export const MIN_PASSWORD_LENGTH = 8;

export async function generatePasswordHash(password: string) {
    return hash(password, 10);
}
