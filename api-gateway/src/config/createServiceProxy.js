const http = require("http");
const https = require("https");
const { URL } = require("url");

const STRIP_RESPONSE_HEADERS = [
    "access-control-allow-origin",
    "access-control-allow-credentials",
];

const createServiceProxy = (target, basePath = "") => {
    const targetUrl = new URL(target);
    const client = targetUrl.protocol === "https:" ? https : http;

    return (req, res) => {
        const bodyData = req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : undefined;

        const headers = { ...req.headers, host: targetUrl.host };
        if (req.user) {
            headers["x-user-id"] = req.user.id;
            headers["x-user-role"] = req.user.role;
        }
        headers["x-internal-api-key"] = process.env.INTERNAL_API_KEY;

        if (bodyData) {
            headers["content-type"] = "application/json";
            headers["content-length"] = Buffer.byteLength(bodyData);
        }

        const proxyReq = client.request({
                hostname: targetUrl.hostname,
                port: targetUrl.port || (client === https ? 443 : 80),
                path: basePath + req.url,
                method: req.method,
                headers,
            },
            (proxyRes) => {
                STRIP_RESPONSE_HEADERS.forEach((h) => delete proxyRes.headers[h]);
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res);
            }
        );

        proxyReq.on("error", () => {
            if (!res.headersSent) res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Bad gateway" }));
        });

        if (bodyData) {
            proxyReq.end(bodyData);
        } else {
            req.pipe(proxyReq);
        }
    };
};

module.exports = createServiceProxy;