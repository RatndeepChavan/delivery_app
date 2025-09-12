"use client";

import type { OrderType } from "#/types/orderTypes";
import type { Session } from "next-auth";

import { OrderStatusValues } from "#/enums/orderStatus.enum";
import { UserRole } from "#/enums/userRoles.enum";
import { GET_CUSTOMER_ORDERS } from "#/graphql/queries";
import { useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LinkComponent } from "#/components/LinkComponent";
import { WithAuth } from "#/hoc/auth";
import { OrderList } from "#/components/OrderList";
import { ORDER_UPDATED } from "#/graphql/subscriptions";
import { useSession } from "next-auth/react";
import { ORDER_WRITE_STATUS_FRAGMENT } from "#/graphql/cache";

/**
 * * 📝 CustomerDashboard Component
 *
 * ? Displays all orders for the logged-in customer
 * ? Allows filtering orders by status
 * ? Real-time updates via GraphQL subscriptions (order status updates)
 * ? Provides a link to place new orders
 * ? Wrapped in WithAuth HOC to restrict access to customers only
 */
const CustomerDashboard = () => {
    // 👤 Get current session and user info
	const { data: session } = useSession();
	const { user } = session as Session;

    // 📡 Fetch customer orders
	const { data, loading, error } = useQuery(GET_CUSTOMER_ORDERS, {
		fetchPolicy: "cache-and-network",
	});

	// ⚡ Subscribe to order updates for real-time status changes
	const { loading: subscriptionLoading, error: subscriptionError } =
		useSubscription(ORDER_UPDATED, {
			onData: ({ client, data: subscriptionData }) => {
				const updatedData = subscriptionData.data.orderUpdated;

				// ❌ Ignore if the update does not belong to the current user
				if (!updatedData || updatedData.customerId !== user.id) {
					return;
				}

				// 📝 Update Apollo cache for order status
				client.cache.writeFragment({
					id: client.cache.identify(updatedData),
					fragment: ORDER_WRITE_STATUS_FRAGMENT,
					data: { status: updatedData.status },
				});

				// 🔔 Show toast notification for status update
				toast.success(
					`Order status is updated to ${updatedData.status}`
				);
			},
		});
	
	// 🔔 Handle query and subscription errors
	useEffect(() => {
		if (error) {
			toast.error(error.message);
		}
		if (subscriptionError) {
			toast.error("Failed to fetch new data please reload");
		}
	},[error, subscriptionError])
	
	// ⏳ Show loading messages
	if (loading) {
		<h1>Fetching data...</h1>;
	}
	if (subscriptionLoading) {
		<h1>Updating data...</h1>;
	}

	// 🗂️ State for order filter
	const [filter, setFilter] = useState("All");

    // 🏷️ Orders data from query
	const orders: OrderType[] = data?.getCustomerOrders || [];

    // 🔍 Filtered orders based on selected status
	const filteredOrders =
		filter === "All"
			? orders
			: orders.filter((order) => order.status === filter);

	return (
		<div>
			{/* ----------------------------------------------------------
                🏷️ Header
            ---------------------------------------------------------- */}
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">My Orders</h1>
				<LinkComponent
					link_text="Place Order"
					href="/orders/create/"
					className="bg-green-600 font-semibold text-white no-underline! px-4 py-2 rounded hover:bg-green-400"
				/>
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
		</div>
	);
};

// 🔒 Restrict access to CUSTOMER role only
export default WithAuth(CustomerDashboard, {
	allowedRoles: [UserRole.CUSTOMER],
});
