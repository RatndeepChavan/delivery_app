"use client";

import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID } from "#/graphql/queries";
import toast from "react-hot-toast";
import { use, useEffect } from "react";
import { WithAuth } from "#/hoc/auth";
import { UserRole } from "#/enums/userRoles.enum";
import { BackButton } from "#/components/BackButton";

/**
 * * 📝 OrderDetails Component
 *
 * ? Displays detailed information about a single order
 * ? Fetches data using Apollo Client query GET_ORDER_BY_ID
 * ? Wrapped in WithAuth HOC to restrict access to allowed roles
 *
 * @param params - route parameters containing `id` of the order
 */
const OrderDetails = ({ params }: { params: Promise<{ id: string }> }) => {
	// 🔑 Extract order ID from params
	const {id} = use(params)

    // 📡 Fetch order details using Apollo useQuery
	const { data, loading, error } = useQuery(GET_ORDER_BY_ID, {
		variables: { id },
		fetchPolicy: "cache-and-network",
	});

    // 🔔 Show toast notification if there is an error
	useEffect(() => {
		if (error){
			toast.error(error.message)
		}
	}, [error])
	
	// ⏳ Show loading state while fetching data
	if (loading) {
		return <h1>Fetching data...</h1>;
	}	

	 // ❌ Handle case when order is not found
	const orderDetails = data?.getOrderById;
	if (!orderDetails && data !== undefined) {
		return <p>Order not found</p>
	}

	// ✅ Display order details
	return (
		<div className="max-w-lg mx-auto space-y-4">
			<h1 className="text-2xl font-bold">{orderDetails.product}</h1>
			<p>Quantity: {orderDetails.quantity}</p>
			<p>Location: {orderDetails.location}</p>
			<p>Status: {orderDetails.status}</p>
			<p>Created: {new Date(Number(orderDetails.createdAt)).toLocaleString()}</p>
			<p>Updated: {new Date(Number(orderDetails.updatedAt)).toLocaleString()}</p>
			<BackButton />
		</div>
	);
}

// 🔒 Wrap with WithAuth HOC to allow only specific roles
export default WithAuth(OrderDetails, {
	allowedRoles: [UserRole.CUSTOMER, UserRole.DELIVERY],
});
