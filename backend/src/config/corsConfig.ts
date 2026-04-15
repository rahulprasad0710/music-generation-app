import cors from "cors";

export const allowedOrigins = [
    "http://web.admincentrik.com:5173",
    "http://web.admincentrik.com",
    "http://89.116.32.56:5173",
    "http://localhost:5173",
    "https://web.admincentrik.com",
    "https://www.admincentrik.com",
];

export const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Tenant-ID",
        // ↓ Required for SSE via fetch-event-source (non-simple headers)
        "Cache-Control",
        "Accept",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
};

export const SseCorsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Tenant-ID",
        // ↓ Required for SSE via fetch-event-source (non-simple headers)
        "Cache-Control",
        "Accept",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
};
