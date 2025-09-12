"use client";

import type { OrderType } from "#/types/orderTypes";

import { OrderStatusValues } from "#/enums/orderStatus.enum";
import { UserRole } from "#/enums/userRoles.enum";
import { GET_DELIVERY_ORDERS } from "#/graphql/queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { WithAuth } from "#/hoc/auth";
import {OrderList} from "#/components/OrderList";
import { BackButton } from "#/components/BackButton";

/**
 * * 📝 DeliveryHistory Component
 *
 * ? Displays all orders assigned to the delivery partner
 * ? Allows filtering orders by status
 * ? Wrapped in WithAuth HOC to restrict access to delivery partners only
 */
const DeliveryHistory = () => {
    // 📡 Fetch delivery orders for the logged-in delivery partner
    const { data, loading, error } = useQuery(GET_DELIVERY_ORDERS);
    
    // 🔔 Show toast notification if there is an error
    useEffect(() => {
		if (error){
			toast.error(error.message)
		}
	}, [error])
	
    // ⏳ Show loading state while fetching data
    if (loading) {
        <h1>Fetching data...</h1>;
    }

    // 🗂️ State to handle filter selection
    const [filter, setFilter] = useState("All");

    // 🏷️ Orders data from query
    const orders: OrderType[] = data?.getDeliveryOrders || [];

    // 🔍 Filtered orders based on selected status
    const filteredOrders =
        filter === "All"
            ? orders
            : orders.filter((order) => order.status === filter);

    return (
        <>
            <BackButton />

            {/* ----------------------------------------------------------
                🏷️ Header
            ---------------------------------------------------------- */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Orders</h1>
            </div>

            {/* ----------------------------------------------------------
                ⚙️ Status Filter Buttons
            ---------------------------------------------------------- */}
            <div className="mb-4 space-x-2">
                {OrderStatusValues.map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1 rounded ${
                            filter === status
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700"
                        }`}>
                        {status}
                    </button>
                ))}
            </div>

            {/* ----------------------------------------------------------
                📦 Orders List
            ---------------------------------------------------------- */}
            <OrderList orders={filteredOrders} />
            
        </>
    );
};

// 🔒 Restrict access to DELIVERY role only
export default WithAuth(DeliveryHistory, {
    allowedRoles: [UserRole.DELIVERY],
});
