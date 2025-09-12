import type { OrderType } from "#/types/orderTypes";
import type { OrderStatusType } from "#/enums/orderStatus.enum";

import { LinkComponent } from "#/components/LinkComponent";
import { useSession } from "next-auth/react";
import { UserRole } from "#/enums/userRoles.enum";
import { OrderStatus } from "#/enums/orderStatus.enum";
import { useMutation } from "@apollo/client";
import { UPDATE_ORDER_STATUS } from "#/graphql/mutations";
import toast from "react-hot-toast";
import { useEffect } from "react";

/**
 * * OrderList Component
 * Displays a list of orders and allows delivery users to update order status.
 *
 * Props:
 * - orders: Array of order objects of type OrderType.
 *
 * Features:
 * - Shows each order with a link to its detail page.
 * - Displays current order status.
 * - If user is a delivery partner, provides a button to update the order status.
 */
export const OrderList = ({ orders }: { orders: OrderType[] }) => {
	const { data: session } = useSession();
	const role = session?.user.role;

	// Mutation hook to update order status
	const [updateOrderStatus, { error, loading }] = useMutation(
		UPDATE_ORDER_STATUS,
	);

	// Show toast notification if mutation fails
	useEffect(() => {
		if (error) {
			toast.error(error.message);
		}
	}, [error]);

	/**
     * Handles updating the order status.
     * @param id - Order ID
     * @param status - New status to update
     */
	const handleSubmit = (
		id: string | undefined,
		status: OrderStatusType | undefined
	) => {
		const inputData = { id, status };
		updateOrderStatus({ variables: { input: inputData }});
	};

	return (
		<ul className="space-y-2">
			{orders.map((order) => {
				// Display text for the order link
				const link_text = `${order.product} ( x${order.quantity})`;

				// Determine the next order status for delivery partners
				const orderStatus =
					order.status === OrderStatus.PENDING
						? OrderStatus.ACCEPTED
						: order.status === OrderStatus.ACCEPTED
						? OrderStatus.OUT_FOR_DELIVERY
						: order.status === OrderStatus.OUT_FOR_DELIVERY
						? OrderStatus.DELIVERED
						: "";

				return (
					<li
						key={order.id}
						className="border p-3 rounded flex justify-between items-center">
						<LinkComponent
							link_text={link_text}
							href={`/orders/${order.id}`}
							className="font-semibold text-white no-underline! hover:text-blue-500"
						/>
						<span>
						{order.status}
						{role === UserRole.DELIVERY && orderStatus && (
							<button
								className = "bg-green-500 text-black font-bold p-2 ms-2 rounded hover:bg-green-600 disabled:cursor-not-allowed"
								onClick={() => handleSubmit(order.id, orderStatus)}
								disabled={loading}
							>
								{`Mark as ${orderStatus}`}
							</button>
							
						)}
                        </span>
					</li>
				);
			})}
		</ul>
	);
};

