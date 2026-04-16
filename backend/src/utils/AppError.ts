import { ErrorType } from "@enums/error.enum";
import { ErrorTypeCode } from "@enums/error.enum";

class AppError extends Error {
    statusCode: number;
    data: null;
    location: string | undefined;
    errorType: ErrorType;

    constructor(message: string, type: ErrorType) {
        super(message);
        this.errorType = type;
        this.statusCode = ErrorTypeCode[type];
        this.data = null;
        this.message = message;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);

        this.location = this.stack?.split("\n")[1]?.trim();
    }
}

export default AppError;
