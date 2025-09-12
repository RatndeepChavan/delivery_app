import type { OrderStatusType } from "#constants/enums/orderStatus.enum.js";
import type { Types } from "mongoose";

import { IUser } from "#interfaces/auth.interface.js";

export interface ICreateOrder {
    location: string;
    product: string;
    quantity: number;
}

export interface IOrder extends ICreateOrder{
    customerId: IUser | string | Types.ObjectId;
    deliveryPartnerId?: IUser | string | Types.ObjectId;
    status: OrderStatusType;
}

export interface IUpdateOrder {
    id: string;
    status: OrderStatusType;
}