import { connectDB } from "#configs/db.js";
import { HOST, ORIGIN, PORT } from "#configs/env.js";
import { authContext } from "#graphql/context/auth.context.js";
import { getGraphQLServer } from "#graphql/index.js";
import { expressMiddleware } from "@as-integrations/express5";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";

/**
 * * 🚀 Express + GraphQL Server Setup
 *
 * ? This script sets up:
 *   - Express server
 *   - CORS + Cookie parsing middleware
 *   - Apollo GraphQL server with context (auth)
 *   - WebSocket subscriptions via Apollo + WS
 *   - MongoDB connection
 */

// 🌐 Initialize Express app
const app = express();

// 🔌 Create HTTP server (required for WebSocket subscriptions)
const httpServer = createServer(app);

// ⚡ Initialize GraphQL server (Apollo + WS subscriptions)
const graphQLServer = getGraphQLServer(httpServer);
await graphQLServer.start();

// 🛠 Middleware setup
app.use(express.json());
app.use(cookieParser());

// 🌍 Enable CORS for allowed origins
app.use(
    cors({
        credentials: true,
	methods: ["GET", "OPTIONS", "POST"],
        origin: ORIGIN,
    }),
);

// 📝 GraphQL endpoint with authentication context
app.use(
    "/graphql",
    expressMiddleware(graphQLServer, {
        context: async ({ req, res }) => await authContext(req, res),
    }),
);

// 🗄 Connect to MongoDB
await connectDB();

// 🎯 Start HTTP server (with WebSocket support)
httpServer.listen(
    {
        hostname: HOST,
        port: PORT,
    },
    () => {
        console.log(
            `✅ Server running at http://${HOST ?? ""}:${PORT ?? ""}/graphql 🚀` +
            `\nAllowed origin: ${ORIGIN ?? ""}` +
            `\nSupports HTTP & WS protocols for queries, mutations, and subscriptions`
        );
    },
);
