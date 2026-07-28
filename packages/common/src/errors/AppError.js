class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.success = false;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;