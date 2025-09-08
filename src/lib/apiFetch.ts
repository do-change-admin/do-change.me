import { AppError } from "./errors";

export async function apiFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const errorData = (await res.json()) as AppError;
        throw errorData;
    }

    return (await res.json()) as T;
}
