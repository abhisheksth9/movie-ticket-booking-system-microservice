const loggerModule = require("./logger");

module.exports = {
    constants: require("./constants"),
    errors: require("./errors"),
    middleware: require("./middleware"),
    logger: loggerModule.logger, 
    requestLogger: loggerModule.requestLogger,
    responseLogger: loggerModule.responseLogger,
    requestId: loggerModule.requestId,
    validators: require("./validators"),
    utils: require("./utils"),
    proto: require("./proto"),
    kafka: require("./kafka"),
    grpc: require('@grpc/grpc-js'),
};