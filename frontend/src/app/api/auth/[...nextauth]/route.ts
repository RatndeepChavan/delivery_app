import type { NextAuthOptions } from "next-auth";

import { LOGIN_MUTATION, REFRESH_TOKEN_MUTATION } from "#/graphql/mutations";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
import { SERVER_PATH, NEXTAUTH_SECRET } from "#/utils/env";


// --- Token expiration configuration ---
// These represent the validity period for access and refresh tokens (in milliseconds)
const ACCESS_TOKEN_AGE = 24*60*60;
const REFRESH_TOKEN_AGE = 7*24*60*60;

// --- Apollo Client setup ---
// This client will be used to make GraphQL mutations for login and token refresh
const httpLink = new HttpLink({ uri: SERVER_PATH });
const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: httpLink,
});

// --- NextAuth Options ---
const authOptions: NextAuthOptions = {
	secret: NEXTAUTH_SECRET,

	// --- Authentication Providers ---
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "email", type: "email" },
				password: { label: "password", type: "password" },
			},

			// authorize is called when a user attempts to login
			async authorize(credentials) {
				if (!credentials) {
					return null;
				}

				const { email, password } = credentials;
				try {
					 // Make a GraphQL mutation to login
					const { data } = await apolloClient.mutate({
						mutation: LOGIN_MUTATION,
						variables: { input: { email, password } },
					});

					// If login succeeds, return the user data
					if (data && data.login) {
						return data.login;
					}

					 // Otherwise throw an error
					throw Error("Login failed. Please try again.");
				} catch (error) {
					throw error;
				}
			},
		}),
	],

	 // --- Session configuration ---
	session: {
		maxAge: REFRESH_TOKEN_AGE
	},

	// --- Callbacks ---
	callbacks: {
		/**
		 * JWT callback is called whenever a token is created or updated
		 * - Adds user info and tokens on initial login
		 * - Refreshes the access token if expired
		 */
		async jwt({ user: loginData, token }) {
			if (loginData) {
				// First login, attach user info and token
				token.id = loginData.user.id;
				token.name = loginData.user.name;
				token.email = loginData.user.email;
				token.role = loginData.user.role;
				token.accessToken = loginData.token.accessToken;
				token.refreshToken = loginData.token.refreshToken;
				token.expiry = Date.now() + ACCESS_TOKEN_AGE * 1000;
				return token;
			}

			 // If token expired, attempt to refresh via GraphQL
			const now = Date.now();
			if (now >= token.expiry) {
				try {
					const { data } = await apolloClient.mutate({
						mutation: REFRESH_TOKEN_MUTATION,
						variables: { refreshToken: token.refreshToken },
					});

					if (data && data.refresh) {
						const tokenData = data.refresh.token;
						token.accessToken = tokenData.accessToken;
						token.refreshToken = tokenData.refreshToken;
						token.expiry = Date.now() + ACCESS_TOKEN_AGE * 1000;
						return token;
					}
				} catch (error) {
					throw error;
				}
			}
			return token;
		},

		/**
		 * Session callback is called whenever a session object is accessed client-side
		 * - Adds accessToken and refreshToken to the session
		 */
		async session({ session, token }) {
			if (token) {
				session.user = {
					id: token.id,
					name: token.name,
					email: token.email,
					role: token.role,
				};
				session.accessToken = token.accessToken;
				session.refreshToken = token.refreshToken;
			}
            return session;
		},
	},

	// --- Custom pages ---
	pages: {
		signIn: "/login",
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
