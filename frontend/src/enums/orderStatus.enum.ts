export enum OrderStatus {
    ALL= "All",
    ACCEPTED = "Accepted",
    DELIVERED = "Delivered",
    OUT_FOR_DELIVERY = "Out_for_delivery",
    PENDING = "Pending",
}

export type OrderStatusType = `${OrderStatus}`;

export const OrderStatusValues: OrderStatusType[] = Object.values(OrderStatus);