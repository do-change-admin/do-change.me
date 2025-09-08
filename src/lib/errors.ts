import { $ZodErrorTree } from "zod/v4/core";

export enum ErrorType {
    Validation = "validation",
    Business = "business",
    Server = "server",
}

export interface BaseError<T extends ErrorType, D = unknown> {
    error: {
        type: T;
        code: string;
        message: string;
        details?: D;
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
    details: $ZodErrorTree<object>
): ValidationError {
    return {
        error: {
            type: ErrorType.Validation,
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details,
        },
    };
}

export function businessError(
    message: string,
    code: string = "BUSINESS_ERROR"
): BusinessError {
    return {
        error: {
            type: ErrorType.Business,
            code,
            message,
        },
    };
}

export function serverError(message = "Something went wrong"): ServerError {
    return {
        error: {
            type: ErrorType.Server,
            code: "INTERNAL_ERROR",
            message,
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
