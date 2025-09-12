import type { ICreateOrder, IOrder, IUpdateOrder } from "#interfaces/order.interface.js";

import { customMsg } from "#constants/customMessages.js";
import { OrderStatus } from "#constants/enums/orderStatus.enum.js";
import { UserRole } from "#constants/enums/userRoles.enum.js";
import { ERROR_CODES } from "#constants/errorCodes.js";
import { ORDER_CREATED, ORDER_UPDATED } from "#constants/subscriptionsStrings.js";
import { graphqlErrorHandler } from "#handlers/graphqlError.handler.js";
import { IUser } from "#interfaces/auth.interface.js";
import Order from "#models/order.model.js";
import { PubSub } from "graphql-subscriptions";

/**
 * * 📦 OrderService
 *
 * ? Handles order creation, retrieval, updates, and event publishing.
 * ? Enforces role-based access control (Customer vs Delivery partner).
 * ! Always throws standardized GraphQL errors when unauthorized/invalid.
 */
export const OrderService = {
    /**
     * *🛒 Create a new order (Customer only).
     * Publishes an `ORDER_CREATED` subscription event.
     */
    createOrder: async (input: ICreateOrder, user: IUser, pubsub: PubSub): Promise<IOrder> => {
        if (user.role !== UserRole.CUSTOMER) {
            throw graphqlErrorHandler(customMsg.common.not_allowed, ERROR_CODES.FORBIDDEN);
        }

        // ✨ Create and save new order
        const order = new Order({
            customerId: user.id,
            location: input.location,
            product: input.product,
            quantity: input.quantity,
        });
        const newOrder = await order.save();
        
        // 📡 Notify subscribers
        await pubsub.publish(ORDER_CREATED, { orderCreated: newOrder });

        return newOrder;
    },
    
    /**
     * 📋 Get all orders placed by the current customer (Customer only).
     */
    getCustomerOrders: async (user: IUser): Promise<IOrder[]> => {
        if (user.role !== UserRole.CUSTOMER) {
            throw graphqlErrorHandler(customMsg.common.not_allowed, ERROR_CODES.FORBIDDEN)
        }
        return await Order.find({ customerId: user.id }).sort({ createdAt: -1 }).lean();
    },
    
    /**
     * 📦 Get all orders assigned to the delivery partner (Delivery partner only).
     */
    getDeliveryOrders: async (user: IUser): Promise<IOrder[]> => {
        if (user.role !== UserRole.DELIVERY) {
            throw graphqlErrorHandler(customMsg.common.not_allowed, ERROR_CODES.FORBIDDEN)
        }
        return await Order.find({ deliveryPartnerId: user.id }).sort({ createdAt: -1 }).lean();
    },

    /**
     * 🔍 Fetch order by ID (any role can query).
     */
    getOrderById: async (id: string): Promise<IOrder | null> => {
        return await Order.findById(id)
    },

    /**
     * ⏳ Fetch all pending orders (Delivery partner only).
     */
    getPendingOrders: async (user: IUser): Promise<IOrder[]> => {
        if (user.role !== UserRole.DELIVERY) {
            throw graphqlErrorHandler(customMsg.common.not_allowed, ERROR_CODES.FORBIDDEN)
        }
        return await Order.find({ status: OrderStatus.PENDING }).sort({ createdAt: -1 }).lean();
    },

    /**
     * 🚚 Update the status of an order (Delivery partner only).
     * Publishes an `ORDER_UPDATED` subscription event.
     */
    updateOrderStatus: async (input: IUpdateOrder, user: IUser, pubsub: PubSub): Promise<IOrder> => {
        if (user.role !== UserRole.DELIVERY) {
            throw graphqlErrorHandler(customMsg.common.not_allowed, ERROR_CODES.FORBIDDEN);
        }

        const { id, status } = input;
        const order = await Order.findById(id);

        if (!order) {
            throw new Error("Order not found");
        }
        if (status === OrderStatus.ACCEPTED && !order.deliveryPartnerId) {
            order.deliveryPartnerId = user.id;
        }
        order.status = status;
        const updatedOrder = await order.save();

        await pubsub.publish(ORDER_UPDATED, { orderUpdated: updatedOrder });
        
        return updatedOrder;
    },
}