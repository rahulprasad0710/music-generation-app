export type ApiSuccess<T> = {
    success: true;
    data: T;
    message: string;
};

export enum ErrorType {
    AUTH_ERROR = "AUTH_ERROR",
    DB_ERROR = "DB_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    BAD_REQUEST_ERROR = "BAD_REQUEST_ERROR",
    CONFLICT_ERROR = "CONFLICT_ERROR",
    INVALID_TOKEN_ERROR = "INVALID_TOKEN_ERROR",
    EXPIRED_TOKEN_ERROR = "EXPIRED_TOKEN_ERROR",
    UNAUTHORIZED_ERROR = "UNAUTHORIZED_ERROR",
    AWS_ERROR = "AWS_ERROR",
}

export type ApiError = {
    success: false;
    error: unknown;
    data: null;
    type: ErrorType;
    message: string;
};

export type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: unknown;
    type?: ErrorType;
    message: string;
};
