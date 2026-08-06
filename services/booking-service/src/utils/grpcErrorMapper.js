const grpc = require('@grpc/grpc-js');
const { NotFoundError, AppError } = require("@movie/common");
const { errorMessages } = require('@movie/common').constants;

function mapGrpcError(err) {
    switch(err.code){
        case grpc.status.NOT_FOUND:
            return new AppError(errorMessages.GENERAL.NOT_FOUND, 404)
        case grpc.status.INVALID_ARGUMENT:
            return new AppError(errorMessages.GENERAL.INVALID_REQUEST, 400);
        default:
            return new AppError(errorMessages.GENERAL.INTERNAL_SERVER_ERROR, 500)
    }
}

module.exports = { mapGrpcError };