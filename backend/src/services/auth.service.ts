import type { IAuthPayload, ILogin, ISignup } from "#interfaces/auth.interface.js";

import { customMsg } from "#constants/customMessages.js";
import { ERROR_CODES } from "#constants/errorCodes.js";
import { graphqlErrorHandler } from "#handlers/graphqlError.handler.js";
import User from "#models/users.model.js";
import { jwtTokenGenerator } from "#utils/jwt/tokenGenerator.js";
import { verifyToken } from "#utils/jwt/tokenVerifier.js";
import { compareSync, hashSync } from "bcrypt-ts";
import { GraphQLError } from "graphql";

/**
 * * 🔐 AuthService
 * 
 * ? Handles user authentication & account management:
 *   - login: Verify user credentials & issue JWTs
 *   - refresh: Re-issue tokens using refresh token
 *   - signup: Register new users securely with hashing
 * 
 * ! All methods return standardized GraphQL errors via `graphqlErrorHandler`
 */
export const AuthService = {
    /**
     * * 🔑 Login user
     * @param email User email
     * @param password User password (plaintext, will be validated against hash)
     * @returns AuthPayload containing { token, user }
     */
    login: async ({ email, password }: ILogin): Promise<IAuthPayload> => {
        try {
	    console.log({ email, password })

            // 🔍 Find user by email
            const userData = await User.findOne({ email }).lean();
            console.log({userData})
	    if (!userData) {
                throw graphqlErrorHandler(customMsg.email.not_found, ERROR_CODES.NOT_FOUND);
            }

            // 🔐 Validate password
            const validPassword = compareSync(password, userData.password)
            if (!validPassword){
                throw graphqlErrorHandler(customMsg.password.incorrect, ERROR_CODES.VALIDATION_ERROR);
            }
            
            // 🎫 Generate access + refresh tokens
            const token = jwtTokenGenerator({
                email: userData.email,
                id: String(userData._id),
                name: userData.name,
                role: userData.role,
            })

            // 👤 Shape user object (exclude sensitive fields like password)
            const user = {
                email: userData.email,
                id: userData._id,
                name: userData.name,
                role: userData.role
            }
            return {token, user}
        } 
        catch (err) {
            // ? If it's a known validation or not-found error, rethrow as-is
            if (err instanceof GraphQLError) {
                const errCode = err.extensions.code;
                if (typeof errCode === "string" && (
                    errCode === ERROR_CODES.NOT_FOUND ||
                    errCode === ERROR_CODES.VALIDATION_ERROR
                )) {
                    throw err; 
                }
            }
            // ! Mask unexpected errors as AUTHENTICATION_ERROR
            throw graphqlErrorHandler(
                customMsg.auth.login_fail,
                ERROR_CODES.AUTHENTICATION_ERROR,
                err,
            );
        }
    },
    
    /**
     * * 🔄 Refresh JWTs
     * @param refreshToken The refresh token (validates user & re-issues tokens)
     * @returns New AuthPayload containing { token, user }
     */
    refresh: (refreshToken: string) => {
        // ✅ Verify refresh token (2nd param = false → use refresh secret)
        const user = verifyToken(refreshToken, false);
        const token = jwtTokenGenerator(user);
        
        return {token, user}
    },

    /**
     * * 🆕 Register new user
     * @param email Email (must be unique)
     * @param name Display name
     * @param password Password (hashed before save)
     * @param role Role (Customer | Delivery)
     */
    signup: async ({ email, name, password, role }: ISignup): Promise<void> => {
        try {
            // ❌ Prevent duplicate registrations
            const existingUser = await User.findOne({ email }).lean();
            if (existingUser) {
                throw graphqlErrorHandler(customMsg.email.exists, ERROR_CODES.ALREADY_EXISTS);
            }
            
             // 🔐 Hash password before storing
            const hashedPassword = hashSync(password)
            
            // 📝 Create and save new user
            const newUser = new User({ email, name, password: hashedPassword, role });
            await newUser.save();
        } 
        catch (err) {
            // ? If it's a known duplicate error, rethrow
            if (err instanceof GraphQLError) {
                const errCode = err.extensions.code;
                if (typeof errCode === "string" && errCode === ERROR_CODES.ALREADY_EXISTS) {
                    throw err; 
                }
            }
            // ! Mask other issues as INTERNAL_SERVER_ERROR
            throw graphqlErrorHandler(
                customMsg.common.error,
                ERROR_CODES.INTERNAL_SERVER_ERROR,
                err,
            );
        }
    },
};
