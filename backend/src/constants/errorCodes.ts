/**
 * * 🚨 Error Codes
 * ? Centralized constants for error handling across the application.
 * ? Helps avoid "magic strings" and ensures consistency in error responses.
 * 
 * ! Always reference these constants instead of hardcoding error strings
 */
export const ERROR_CODES = {
    ALREADY_EXISTS: "ALREADY_EXISTS",               // ⚠️ Resource already exists (e.g., duplicate email)
    AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",   // 🔑 Invalid login/authentication failure
    FORBIDDEN: "FORBIDDEN",                         // 🚫 User does not have permission to access resource
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR", // 💥 Unexpected server error
    NOT_FOUND: "NOT_FOUND",                         // 🔍 Requested resource not found
    UNAUTHORIZED: "UNAUTHORIZED",                   // 🔒 Missing or invalid authentication
    VALIDATION_ERROR: "VALIDATION_ERROR",           // ❌ Input validation failed
} as const;

/**
 * * 🔖 ErrorCode Type
 * ? Creates a union type of all error code string values.
 * Example: "ALREADY_EXISTS" | "AUTHENTICATION_ERROR" | ...
 * 
 * ✅ Ensures type safety when assigning or checking error codes.
 */
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
