import type { IUser } from "#interfaces/auth.interface.js";
import type { ITokenType } from "#interfaces/jwt.interface.js";

import { JWT_ACCESS_KEY, JWT_ACCESS_TOKEN_AGE, JWT_REFRESH_KEY, JWT_REFRESH_TOKEN_AGE } from "#configs/env.js";
import jwt from "jsonwebtoken";

/**
 * * 🔑 JWT Token Generator
 *
 * ? Generates both `accessToken` and `refreshToken` for a given user.
 * ? Access token is short-lived (used for API requests).
 * ? Refresh token is long-lived (used to renew access tokens).
 *
 * ! Do NOT store sensitive info (like passwords) in token payloads.
 *
 * @param tokenPayload - User payload (id, email, role, etc.)
 * @returns { accessToken, refreshToken }
 */
export const jwtTokenGenerator = (tokenPayload: IUser): ITokenType => {
    const accessToken = jwt.sign(tokenPayload, JWT_ACCESS_KEY, { expiresIn: JWT_ACCESS_TOKEN_AGE });
    const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_KEY, { expiresIn: JWT_REFRESH_TOKEN_AGE });
    
    return { accessToken, refreshToken };
};