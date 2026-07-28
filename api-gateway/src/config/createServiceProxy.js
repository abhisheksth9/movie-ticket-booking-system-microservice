const http = require("http");
const https = require("https");
const { URL } = require("url");

const createServiceProxy = (target, basePath = "") => {
    const targetUrl = new URL(target);
    const isHttps = targetUrl.protocol === "https:";
    const client = isHttps ? https : http;

    return (req, res) => {
        const outgoingPath = basePath + req.url;

        let bodyData;
        if (req.body && Object.keys(req.body).length) {
            bodyData = JSON.stringify(req.body);
        }

        const headers = { ...req.headers };

        headers["host"] = targetUrl.host;

        const remoteAddress = req.socket.remoteAddress;
        headers["x-forwarded-for"] = (headers["x-forwarded-for"]
            ? headers["x-forwarded-for"] + ", "
            : "") + remoteAddress;
        headers["x-forwarded-port"] = req.socket.localPort;
        headers["x-forwarded-proto"] = req.socket.encrypted ? "https" : "http";

        console.log("req.user =", req.user);

        if (req.user) {
            headers["x-user-id"] = req.user.id;
            headers["x-user-role"] = req.user.role;
        }

        headers["x-internal-api-key"] = process.env.INTERNAL_API_KEY;

        if (bodyData) {
            headers["content-type"] = "application/json";
            headers["content-length"] = Buffer.byteLength(bodyData);
        }

        const options = {
            protocol: targetUrl.protocol,
            hostname: targetUrl.hostname,
            port: targetUrl.port || (isHttps ? 443 : 80),
            path: outgoingPath,
            method: req.method,
            headers,
        };

        const proxyReq = client.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        proxyReq.on("error", (err) => {
            if (!res.headersSent) {
                res.writeHead(502, { "Content-Type": "application/json" });
            }
            res.end(JSON.stringify({ error: "Bad gateway" }));
        });

        if (bodyData) {
            proxyReq.write(bodyData);
            proxyReq.end();
        } else {
            req.pipe(proxyReq, { end: true });
        }
    };
};

module.exports = createServiceProxy;