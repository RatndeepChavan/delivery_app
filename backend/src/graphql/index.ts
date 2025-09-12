import type { Server } from "http";

import { authResolvers } from "#graphql/resolvers/auth.resolver.js";
import { orderResolvers } from "#graphql/resolvers/order.resolver.js";
import { authTypeDef } from "#graphql/schemas/auth.schema.js";
import { orderTypeDef } from "#graphql/schemas/order.schema.js";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";

// 🧩 Combine resolvers & typedefs
const resolvers = [authResolvers, orderResolvers];
const typeDefs = [authTypeDef, orderTypeDef];
const schema = makeExecutableSchema({ resolvers, typeDefs });

/* eslint-disable */

/**
 * * 🚀 Create Apollo GraphQL Server with WebSocket subscriptions
 * 
 * ? Provides both HTTP + WS endpoints under a single server.
 * ! Always call `graphQLServer.start()` before applying middleware.
 */
export const getGraphQLServer = (httpServer: Server) => {
    // 🌐 Setup WebSocket server for GraphQL subscriptions
    const wsServer = new WebSocketServer({
        path: "/graphql",
        server: httpServer,
    });
    
    // 🔄 Handle subscription lifecycle (graphql-ws)
    const serverCleanup = useServer({ schema }, wsServer);
    
    // ⚡ Apollo GraphQL HTTP server
    const graphQLServer = new ApolloServer({
        schema,
        plugins: [
             // ⏳ Ensures HTTP server shuts down gracefully
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                // 🛑 Ensure WebSocket server cleans up on shutdown
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    return graphQLServer;
}
