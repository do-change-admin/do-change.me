/**
 * !!! DEPRECATED, ErrorFactory MUST BE USED NOW, WILL BE REMOVED AFTER MIGRATION !!!
 */

import {
    AppError,
    isBusinessError,
    isServerError,
    isValidationError,
} from "./errors";

export function handleApiError(error: AppError): string {
    if (isValidationError(error)) {
        const details = error.error.details;
        const messages: string[] = [];

        if (details?.errors && details.errors.length > 0) {
            messages.push(...details.errors);
        }

        if (details?.properties) {
            for (const [field, prop] of Object.entries(details.properties)) {
                if (prop.errors && prop.errors.length > 0) {
                    messages.push(
                        ...prop.errors.map((err: string) => `${field}. ${err}`)
                    );
                }
            }
        }

        return messages.length > 0 ? messages.join(", ") : error.error.message;
    }

    if (isBusinessError(error)) {
        return error.error.message;
    }

    if (isServerError(error)) {
        return "Server error. Please try again later.";
    }

    return "Something went wrong.";
}
