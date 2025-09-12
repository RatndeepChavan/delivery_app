import type { OrderStatusType } from "#/enums/orderStatus.enum";

export type OrderType = {
    id?: string;
    deliveryPartnerId?: string;
    location?: string;
    product?: string;
    quantity?: number;
    status?: OrderStatusType;
}
