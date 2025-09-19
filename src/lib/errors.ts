import { $ZodErrorTree } from "zod/v4/core";

export enum ErrorType {
    Validation = "validation",
    Business = "business",
    Server = "server",
}

interface BaseError<T extends ErrorType = ErrorType, D = string | Object> {
    error: {
        type: T;
        code: string;
        message: string;
        details?: D;
        statusCode?: number;
    };
}

export type ValidationError = BaseError<
    ErrorType.Validation,
    $ZodErrorTree<object>
>;

export type BusinessError = BaseError<ErrorType.Business>;

export type ServerError = BaseError<ErrorType.Server>;

export type AppError = ValidationError | BusinessError | ServerError;

export function validationError(
    details: $ZodErrorTree<object>,
    statusCode?: number
): ValidationError {
    return {
        error: {
            type: ErrorType.Validation,
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details,
            statusCode
        },
    };
}

export function businessError(
    message: string,
    code: string = "BUSINESS_ERROR",
    statusCode?: number
): BusinessError {
    return {
        error: {
            type: ErrorType.Business,
            code,
            message,
            statusCode
        },
    };
}

export function serverError(message = "Something went wrong", statusCode?: number): ServerError {
    return {
        error: {
            type: ErrorType.Server,
            code: "INTERNAL_ERROR",
            message,
            statusCode
        },
    };
}

export function isValidationError(error: AppError): error is ValidationError {
    return error.error.type === ErrorType.Validation;
}

export function isBusinessError(error: AppError): error is BusinessError {
    return error.error.type === ErrorType.Business;
}

export function isServerError(error: AppError): error is ServerError {
    return error.error.type === ErrorType.Server;
}

/**
 * Global type-guard.
 */
export function isApplicationError(data: unknown): data is BaseError {
    if (!data || typeof data !== 'object') {
        return false
    }

    if ('error' in data) {
        const errorData = data.error;
        if (!errorData || typeof errorData !== 'object') {
            return false
        }
        if ('type' in errorData) {
            const errorType = errorData.type;
            if (!errorType || typeof errorType !== 'string') {
                return false;
            }
            const possibleStatuses: string[] = [ErrorType.Business, ErrorType.Server, ErrorType.Validation]
            return possibleStatuses.includes(errorType)
        }
    }

    return false
}
