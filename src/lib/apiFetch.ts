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

export const apiRequest = (url: string, method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT") => {
    return async (payload: { body?: Object, query?: Object }) => {
        const actualURL = payload?.query ? `${url}?${Object.entries(payload.query).filter(x => x[1] !== undefined && x[1] !== null).map(x => `${x[0]}=${x[1]}`).join('&')}` : url
        const result = await fetch(actualURL, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: payload?.body ? JSON.stringify(payload.body) : undefined,
        })

        if (!result.ok) {
            throw await result.json();
        }

        return await result.json()
    }
}

export const buildQueryString = (data: Object) => {
    return `?${Object.entries(data).filter(x => x[1] !== undefined && x[1] !== null).map(x => `${x[0]}=${Array.isArray(x[1]) ? x[1].map(x => `${x}`).join(',') : x[1]}`).join('&')}`
}