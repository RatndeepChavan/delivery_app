import { calculateTokenAge } from "#utils/tokenAgeCalculator.js";


/**
 * * 🌍 Environment Configurations
 * ? This file centralizes environment variables and prepares them for safe use across the project.
 * 
 * ! Never hardcode secrets/keys here. Always load from environment variables.
 * ! If any required variable is missing, the app may fail unexpectedly.
 */

// Current environment (dev | prod)
export const ENV = process.env.ENV

// 🌐 Origin (CORS allowed origin depending on environment)
export const ORIGIN = ENV === "prod" ? process.env.PROD_ORIGIN : process.env.DEV_ORIGIN;

// 🖥️ Hostname (used for server binding)
export const HOST = ENV === "prod" ? process.env.PROD_HOST : process.env.DEV_HOST;

// 🔌 Port for server to listen on
export const PORT = ENV === "prod" ? process.env.PROD_PORT : process.env.DEV_PORT;

// 🗄️ MongoDB connection string
export const DB_CONN_STRING = process.env.DB_CONN_STRING ?? "";

// 🔑 Secret keys for signing access & refresh tokens
export const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY ?? "";
export const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY ?? "";


// ⏳ Token Expiration Durations
// ! Avoiding direct use of eval
export const JWT_ACCESS_TOKEN_AGE: number = calculateTokenAge(
    process.env.JWT_ACCESS_TOKEN_AGE ?? "",
);
export const JWT_REFRESH_TOKEN_AGE: number = calculateTokenAge(
    process.env.JWT_REFRESH_TOKEN_AGE ?? "",
);
