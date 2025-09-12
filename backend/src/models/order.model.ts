import type { Model } from "mongoose";

import { OrderStatus, OrderStatusValues } from "#constants/enums/orderStatus.enum.js";
import { IOrder } from "#interfaces/order.interface.js";
import mongoose, { Schema } from "mongoose";

const OrderSchema: Schema<IOrder> = new mongoose.Schema(
    {
        customerId: { ref: "User", required: true, type: mongoose.Schema.Types.ObjectId },

        deliveryPartnerId: { ref: "User", type: mongoose.Schema.Types.ObjectId },

        location: { required: true, trim: true, type: String },

        product: { required: true, trim: true, type: String },

        quantity: { min: 1, required: true, type: Number },

        status: {
            default: OrderStatus.PENDING,
            enum: OrderStatusValues,
            type: String,
        },
    },
    { timestamps: true },
);

const Order: Model<IOrder> = mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);

export default Order;