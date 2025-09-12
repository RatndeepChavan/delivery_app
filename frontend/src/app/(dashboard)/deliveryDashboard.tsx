"use client";

import type { OrderType } from "#/types/orderTypes";
import type { Session } from "next-auth";

import { LinkComponent } from "#/components/LinkComponent";
import { OrderList } from "#/components/OrderList";
import { UserRole } from "#/enums/userRoles.enum";
import { GET_PENDING_ORDERS } from "#/graphql/queries";
import { ORDER_CREATED, ORDER_UPDATED } from "#/graphql/subscriptions";
import { WithAuth } from "#/hoc/auth";
import { useQuery, useSubscription } from "@apollo/client";
import toast from "react-hot-toast";
import { OrderStatus } from "#/enums/orderStatus.enum";
import {
	ORDER_WRITE_QUERY,
	ORDER_WRITE_STATUS_FRAGMENT,
} from "#/graphql/cache";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * * 📝 DeliveryDashboard Component
 *
 * ? Shows pending orders for delivery partners
 * ? Real-time updates for new orders (ORDER_CREATED) and order status changes (ORDER_UPDATED)
 * ? Allows navigation to order history
 */
const DeliveryDashboard = () => {
	const { data: session } = useSession();
	const { user } = session as Session;

	// 📡 Fetch pending orders
	const { data, loading, error } = useQuery(GET_PENDING_ORDERS, {
		fetchPolicy: "cache-and-network",
	});

	// ⚡ Subscribe to newly created orders
	const { loading: subscriptionLoading1, error: subscriptionError1 } =
		useSubscription(ORDER_CREATED, {
			onData: ({ client, data: subscriptionData }) => {
				const newOrder = subscriptionData.data.orderCreated;
				if (!newOrder) {
					return;
				}

				// 📝 Add new order to cache if not already present
				client.cache.modify({
					fields: {
						getPendingOrders(
							existingOrdersRefs = [],
							{ readField }
						) {
							if (
								existingOrdersRefs.some(
									(ref: OrderType) =>
										readField("id", ref) === newOrder.id
								)
							) {
								return existingOrdersRefs;
							}

							const newOrderRef = client.cache.writeQuery({
								query: ORDER_WRITE_QUERY,
								data: { order: newOrder },
								variables: { id: newOrder.id },
							});

							return [newOrderRef, ...existingOrdersRefs];
						},
					},
				});
				toast.success("📦 New order placed");
			},
		});

	// ⚡ Subscribe to order updates
	const { loading: subscriptionLoading2, error: subscriptionError2 } =
		useSubscription(ORDER_UPDATED, {
			onData: ({ client, data: subscriptionData }) => {
				const updatedData = subscriptionData.data.orderUpdated;
				if (
					!updatedData ||
					updatedData.status === OrderStatus.PENDING
				) {
					return;
				}

				// 📝 Remove order from pending list if status changed
				client.cache.modify({
					fields: {
						getPendingOrders(
							existingOrdersRefs = [],
							{ readField }
						) {
							return existingOrdersRefs.filter(
								(ref: OrderType) =>
									updatedData.id !== readField("id", ref)
							);
						},
					},
				});

				// Evict irrelevant cache data or Update delivery orders cache
				if (user.id !== updatedData.deliveryPartnerId) {
					client.cache.evict({
						id: client.cache.identify(updatedData),
					});
					client.cache.gc();
				} else {
					const cacheID = client.cache.identify(updatedData);
					const orderRef = client.cache.writeFragment({
						id: cacheID,
						fragment: ORDER_WRITE_STATUS_FRAGMENT,
						data: { status: updatedData.status },
					});
					client.cache.modify({
						fields: {
							getDeliveryOrders(existingOrdersRefs = []) {
								return [orderRef, ...existingOrdersRefs];
							},
						},
					});
				}
				toast.success("🔄 Pending orders updated");
			},
		});

	// 🔔 Handle errors
	useEffect(() => {
		if (error) {
			toast.error(error.message);
		}
		if (subscriptionError1 || subscriptionError2) {
			toast.error("Failed to fetch new data please reload");
		}
	}, [error, subscriptionError1, subscriptionError2])

	// ⏳ Show loading messages
	if (loading) {
		return <h1>Fetching data...</h1>;
	}
	if (subscriptionLoading1 || subscriptionLoading2) {
		<h1>Updating data...</h1>;
	}

	const orders = data ? data.getPendingOrders : [];
	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<p className="text-2xl font-bold">Pending Orders</p>
				<LinkComponent
					link_text="Check Order History"
					href={`/orders/history`}
					className="bg-blue-600 font-semibold text-white no-underline! px-4 py-2 rounded mb-4 hover:text-blue-300"
				/>
			</div>
			<OrderList orders={orders} />
		</>
	);
};

// 🔒 Restrict access to DELIVERY role only
export default WithAuth(DeliveryDashboard, {
	allowedRoles: [UserRole.DELIVERY],
});
