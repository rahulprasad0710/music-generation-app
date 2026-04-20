import dotenv from "dotenv";

dotenv.config();

export const APP_CONSTANT = {
    PORT: process.env.PORT || 3000,
    REDIS_URL: process.env.REDIS_URL,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT) as number,
    DB_NAME: process.env.DB_NAME,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE: process.env.DATABASE,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    // REDIS_HOST: process.env.REDIS_HOST || "localhost",
    // REDIS_HOST: "localhost",
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
    START_APP_EMAIL: process.env.START_APP_EMAIL,
    NEXT_CLIENT_URL: process.env.NEXT_CLIENT_URL,
    PAGE_SIZE: 10,
};
