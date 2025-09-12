import type { Request, Response } from "express";

import { ERROR_CODES } from "#constants/errorCodes.js";
import { graphqlErrorHandler } from "#handlers/graphqlError.handler.js";
import { GraphQLContext, RequestBody } from "#interfaces/graphql.interface.js";
import { verifyToken } from "#utils/jwt/tokenVerifier.js";

/**
 * * 🔐 authContext
 * ? Provides authentication & context setup for GraphQL requests.
 * 
 * ✅ Bypasses authentication for public operations (e.g., login, signup).
 * ✅ Verifies JWT for protected operations.
 * ❌ Throws a GraphQL error if token is missing/invalid.
 * 
 * @param req Express Request object
 * @param res Express Response object
 * @returns Promise<GraphQLContext> containing { req, res, user? }
 */
export const authContext = (req: Request, res: Response): Promise<GraphQLContext> => {
    // 📋 List of operations that do NOT require authentication
    const bypassOperations = ["login", "signup", "refresh", "refreshtoken"];

    // Extract the GraphQL operation name from request body (case-insensitive)
    const operationName = (req.body as RequestBody).operationName?.toLowerCase() ?? "";

    // 🚪 Skip authentication for public operations
    if (bypassOperations.includes(operationName)) {
        return Promise.resolve({ req, res });
    }

    // 🔑 Try extracting the JWT token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    // ! If no token provided, throw UNAUTHORIZED error
    if (!token) {
        throw graphqlErrorHandler("Token missing. Please provide a valid token", ERROR_CODES.UNAUTHORIZED);
    }
    // ✅ Verify token & extract user info
    const user = verifyToken(token);
    
    // Return context with authenticated user
    return Promise.resolve({ req, res, user });
};
