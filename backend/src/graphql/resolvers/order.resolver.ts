import type { IID } from "#interfaces/databaseID.interface.js";
import type { ICreateOrder, IUpdateOrder } from "#interfaces/order.interface.js";

import { ORDER_CREATED, ORDER_UPDATED } from "#constants/subscriptionsStrings.js";
import { IUser } from "#interfaces/auth.interface.js";
import { OrderService } from "#services/order.service.js";
import { PubSub } from "graphql-subscriptions";

// 📡 PubSub instance for GraphQL subscriptions
const pubsub = new PubSub();

/**
 * * 📦 Order Resolvers
 * ? Handles queries, mutations, and subscriptions related to orders.
 * ? Uses OrderService for business logic and PubSub for real-time updates.
 */
export const orderResolvers = {
    Mutation:{
        /**
         * * 🆕 Create Order
         * ? Allows a customer to create a new order.
         * ✅ Publishes ORDER_CREATED event for subscribers.
         */
        createOrder: async (
            _parent: unknown,
            { input }: { input : ICreateOrder},
            { user} : {user : IUser }
        ) => {
            const newOrder = await OrderService.createOrder(input, user, pubsub);
            return newOrder;
        },
        
        /**
         * * 🔄 Update Order Status
         * ? Allows delivery agents/customers to update an order's status.
         * ✅ Publishes ORDER_UPDATED event for subscribers.
         */
        updateOrderStatus: async ( 
            _parent: unknown, 
            { input }: {input: IUpdateOrder}, 
            { user} : {user : IUser }
        ) => {
            const updatedOrder = await OrderService.updateOrderStatus(input, user, pubsub);
            return updatedOrder;
        },
    },

    Order: {
        /**
         * * 🆔 Field Resolver
         * ? Converts MongoDB ObjectId (`_id`) to string for GraphQL response.
         */
        id: (parent: IID) => parent._id.toString(),
    },

    Query: {
        /**
         * * 🛒 Get Customer Orders
         * ? Retrieves all orders placed by the authenticated customer.
         */
        getCustomerOrders: async (_parent: unknown, _input: unknown, { user} : {user : IUser }) => {
            return await OrderService.getCustomerOrders(user);
        },

        /**
         * * 🚚 Get Delivery Orders
         * ? Retrieves all orders assigned to a delivery agent.
         */
        getDeliveryOrders: async (_parent: unknown, _input: unknown, { user} : {user : IUser }) => {
            return await OrderService.getDeliveryOrders(user)
        },

        /**
         * * 🔍 Get Order by ID
         * ? Fetches a single order by its unique identifier.
         */
        getOrderById:  async (_: unknown, { id }: { id: string }) => {
            return await OrderService.getOrderById(id)
        },

        /**
         * * ⏳ Get Pending Orders
         * ? Retrieves orders with status "Pending".
         */
        getPendingOrders: async (_parent: unknown, _input: unknown, { user} : {user : IUser }) => {
            return await OrderService.getPendingOrders(user)
        },
    },

    Subscription: {
        /**
         * * 📡 Subscription: Order Created
         * ? Notifies subscribers when a new order is created.
         */
        orderCreated: {
            subscribe: () => pubsub.asyncIterableIterator([ORDER_CREATED]),
        },
        
        /**
         * * 📡 Subscription: Order Updated
         * ? Notifies subscribers when an order’s status is updated.
         */
        orderUpdated: {
            subscribe: () => pubsub.asyncIterableIterator([ORDER_UPDATED]),
        },
    },
}
