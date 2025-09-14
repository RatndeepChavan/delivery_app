"use client";

import { from, HttpLink, split } from "@apollo/client";
import {
	ApolloNextAppProvider,
	ApolloClient,
	InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { getSession } from "next-auth/react";
import { setContext } from "@apollo/client/link/context";
import { OperationTypeNode } from "graphql";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

/**
 * 🌐 HTTP link for standard GraphQL queries and mutations
 */
const httpLink = new HttpLink({
	uri: "http://backend:8888/graphql",
	fetchOptions: {},
});

/**
 * ⚡ WebSocket link for GraphQL subscriptions
 */
const wsLink =  new GraphQLWsLink(
	createClient({
		url: "ws://backend:8888/graphql",
	})
)

/**
 * 🔀Split link: routes requests to either WebSocket or HTTP based on operation type
 * Queries and Mutations -> HTTP
 * Subscriptions -> WebSocket
 */
const splitLink = split(
	({query}) => {
		const definition = getMainDefinition(query)
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === OperationTypeNode.SUBSCRIPTION
		)
	},
	wsLink,
	httpLink
);

/**
 * 🛡️ Auth link: attach access token from NextAuth session 
 */
const authLink = setContext(async (_, { headers }) => {
	const session = await getSession();
	const token = session?.accessToken;

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});
/** 
 * 🚀 Factory: create Apollo Client instance 
 */
export function makeClient() {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: from([authLink, splitLink]),
	});
}

/** 
 * 🏷️ Apollo Provider wrapper for Next.js apps 
 */
export function ApolloWrapper({ children }: React.PropsWithChildren) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}
