import type { ILogin, ISignup } from "#interfaces/auth.interface.js";

import { customMsg } from "#constants/customMessages.js";
import { ERROR_CODES } from "#constants/errorCodes.js";
import { graphqlErrorHandler } from "#handlers/graphqlError.handler.js";
import { AuthService } from "#services/auth.service.js";
import { authValidations } from "#validations/auth.validation.js";

/**
 * * 🔐 Authentication Resolvers
 * ? GraphQL resolvers for handling authentication-related mutations.
 * 
 * Includes:
 * - login   → Authenticates a user & returns tokens
 * - refresh → Refreshes JWT access token using a refresh token
 * - signup  → Registers a new user in the system
 * 
 * ! All input is validated using Zod schemas before being passed to services.
 */
export const authResolvers = {
    Mutation: {
        /**
         * * 🔑 Login Resolver
         * ? Validates login input, then delegates authentication logic to AuthService.
         * 
         * @param _ unused GraphQL parent object
         * @param input Login credentials (email & password)
         * @throws GraphQL validation error if input is invalid
         */
        login: async (_:unknown, { input }: { input: ILogin }) => {
            try {
                // ✅ Validate input against schema
                authValidations.loginValidationSchema.parse(input);
            } catch (err) {
                // ❌ Throw GraphQL error with validation details
                throw graphqlErrorHandler(
                    customMsg.common.invalid,
                    ERROR_CODES.VALIDATION_ERROR,
                    err,
                );
            }
            // 🚀 Delegate to AuthService for actual login
            return await AuthService.login(input)
        },

        /**
         * * ♻️ Refresh Resolver
         * ? Generates a new access token using a refresh token.
         * 
         * @param _ unused GraphQL parent object
         * @param refreshToken string refresh token
         */
        refresh: (_:unknown, { refreshToken }: { refreshToken: string }) => {
            return  AuthService.refresh(refreshToken)
        },

        /**
         * * 📝 Signup Resolver
         * ? Validates signup input, then delegates registration logic to AuthService.
         * 
         * @param _ unused GraphQL parent object
         * @param input Signup details (name, email, password, role)
         * @throws GraphQL validation error if input is invalid
         */
        signup: async (_:unknown, {input}: {input: ISignup}) => {
            try {
                // ✅ Validate input against schema
                authValidations.signupValidationSchema.parse(input);
            } catch (err) {
                // ❌ Throw GraphQL error with validation details
                throw graphqlErrorHandler(
                    customMsg.common.invalid,
                    ERROR_CODES.VALIDATION_ERROR,
                    err,
                );
            }
            // 🚀 Delegate to AuthService for user creation
            return AuthService.signup(input)
        },
    },
};
