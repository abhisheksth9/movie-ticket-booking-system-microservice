const { v4: uuid } = require("uuid");

const requestId = (req, res, next) => {
    const IncomingRequestId = req.headers["x-request-id"];

    req.requestId = IncomingRequestId || uuid();

    res.setHeader("x-request-id", req.requestId);

    next();
};

module.exports = requestId;