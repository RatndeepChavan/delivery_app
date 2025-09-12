/**
 * * 📦 Order Status Enum & Types
 * ? Defines possible states of an order in the system.
 * ? Helps enforce consistency and prevents typo-related bugs.
 */
export enum OrderStatus {
    ACCEPTED = "Accepted",
    DELIVERED = "Delivered",
    OUT_FOR_DELIVERY = "Out_for_delivery",
    PENDING = "Pending",
}

/**
 * * 🔖 OrderStatusType
 * ? A string literal type representing the values of `OrderStatus`.
 */
export type OrderStatusType = `${OrderStatus}`;

/**
 * * 📋 OrderStatusValues
 * ? An array containing all possible order status values.
 */
export const OrderStatusValues: OrderStatusType[] = Object.values(OrderStatus);
