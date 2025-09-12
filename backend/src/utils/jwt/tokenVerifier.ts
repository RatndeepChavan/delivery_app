import type { IUser } from "#interfaces/auth.interface.js";
import type { IToken } from "#interfaces/jwt.interface.js";

import { JWT_ACCESS_KEY, JWT_REFRESH_KEY } from "#configs/env.js";
import { ERROR_CODES } from "#constants/errorCodes.js";
import { graphqlErrorHandler } from "#handlers/graphqlError.handler.js";
import jwt from "jsonwebtoken";

/**
 * * 🔎 verifyToken
 *
 * ? Verifies and decodes a JWT (access or refresh).
 * ? Ensures required fields exist in payload before returning user.
 *
 * ! Throws GraphQL errors with proper codes if:
 *   - Token is expired
 *   - Token is invalid/corrupted
 *   - Token is not yet active
 *   - Token is missing required fields
 *
 * @param token - JWT string (Bearer token without "Bearer " prefix)
 * @param isAccess - true ➝ validate using access secret; false ➝ refresh secret
 * @returns IUser - Decoded user data (safe subset only)
 */
export const verifyToken = (token: string, isAccess = true): IUser => {
    try {
        // Choose correct secret key depending on token type
        const key = isAccess ? JWT_ACCESS_KEY : JWT_REFRESH_KEY;

         // Verify & decode token
        const decodedToken = jwt.verify(token, key) as IToken;

        // Extract required fields
		const { email, id, name, role } = decodedToken

        // ! Ensure essential claims are present
		if (!id || !email || !name || !role){
			throw graphqlErrorHandler("Invalid Token", ERROR_CODES.UNAUTHORIZED)
		}
		
		return { email, id, name, role };

    } catch (error: unknown) {
        // ⏳ Expired token
        if (error instanceof jwt.TokenExpiredError) {
            throw graphqlErrorHandler("TokenExpiredError", ERROR_CODES.UNAUTHORIZED, error);
        }

        // ❌ Invalid signature / malformed token
        if (error instanceof jwt.JsonWebTokenError) {
            throw graphqlErrorHandler("Invalid token. Access forbidden", ERROR_CODES.UNAUTHORIZED, error);
        }

        // ⏱️ Token not active yet (`nbf` claim)
        if (error instanceof jwt.NotBeforeError) {
            throw graphqlErrorHandler("Token not active. Please try later", ERROR_CODES.UNAUTHORIZED, error);
        }

        // 🚨 Fallback for unexpected errors
        throw graphqlErrorHandler("Unknown Error", ERROR_CODES.UNAUTHORIZED, error);
    }
};