import { GraphQLError } from "graphql";
import z, { ZodError } from "zod";


/**
 * * ⚠️ GraphQL Error Handler Utility
 *
 * ? Wraps different error types (Zod, native Error, custom objects) 
 * ? into a unified `GraphQLError` format that Apollo Server understands.
 * ! Always use this instead of throwing raw errors to maintain consistency.
 *
 * @param message - Human-readable error message (shown to clients).
 * @param code - Custom error code (see ERROR_CODES constant).
 * @param errorDetails - Optional raw error object (ZodError, Error, or custom).
 * @returns GraphQLError with standardized shape.
 */
export function graphqlErrorHandler(
    message: string,
    code: string,
    errorDetails?: unknown,
): GraphQLError {
    let details: unknown;

    // 🎯 Capture extra details if available
    if (errorDetails) {
        if (errorDetails instanceof ZodError) {
            // 📝 Format Zod validation errors for client readability
            details = z.prettifyError(errorDetails);
        } else if (errorDetails instanceof Error) {
            // 🐞 Extract message from native JS errors
            details = errorDetails.message;
        } else {
            // 📦 Handle unexpected error types (fallback)
            details = errorDetails;
        }
    } else {
        // ⬇️ Default to message when no details are passed
        details = message;
    }
    
     // 🚨 Return Apollo-compatible GraphQL error
    return new GraphQLError(message, {
        extensions: { code, details },
    });
}
