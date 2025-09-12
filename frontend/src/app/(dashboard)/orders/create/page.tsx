"use client";

import type { createOrderFormType } from "#/validations/createOrderValidation";
import type { OrderType } from "#/types/orderTypes";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { InputField } from "#/components/customFormFields/InputField";
import { SubmitButton } from "#/components/SubmitButton";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "#/enums/userRoles.enum";
import { WithAuth } from "#/hoc/auth";
import { createOrderFormSchema } from "#/validations/createOrderValidation";
import { useMutation } from "@apollo/client";
import { CREATE_ORDER_MUTATION } from "#/graphql/mutations";
import { BackButton } from "#/components/BackButton";
import { ORDER_WRITE_QUERY } from "#/graphql/cache";

/**
 * * 📝 CreateOrder Component
 *
 * ? Allows customers to create a new order
 * ? Uses Apollo useMutation for creating orders
 * ? Updates Apollo cache to reflect new order immediately
 * ? Wrapped in WithAuth HOC to restrict access to customers only
 */
const CreateOrder = () => {
	const router = useRouter()

    // ⚡ Apollo mutation for creating an order
	const [createOrder, { data, error, loading }] = useMutation(
		CREATE_ORDER_MUTATION,
		{
			// 🛠️ Update cache after mutation
			update(cache, { data: { createOrder } }) {
				cache.modify({
					fields: {
						getCustomerOrders(
							existingOrdersRefs = [],
							{ readField }
						) {
							// ? Prevent duplicate entries in cache
							if (
								existingOrdersRefs.some(
									(ref: OrderType) =>
										readField("id", ref) === createOrder.id
								)
							) {
								return existingOrdersRefs;
							}

							// 📝 Write new order to cache
							const newOrderRef = cache.writeQuery({
								query: ORDER_WRITE_QUERY,
								data: { order: createOrder },
								variables: { id: createOrder.id },
							});

							// ✅ Add new order to the beginning of existing orders
							return [newOrderRef, ...existingOrdersRefs];
						},
					},
				});
			},
		}
	);

	// 🔔 Handle mutation result: show toast for error or redirect on success
	useEffect(() => {
		if (error && error.message) {
			toast.error(error.message);
		} else if (data && error === undefined) {
			router.replace("/");
		}
	}, [data, error, router]);

	// 📝 Initialize React Hook Form with Zod validation
	const methods = useForm({
		resolver: zodResolver(createOrderFormSchema),
		defaultValues: { location: "", product: "", quantity: 1 },
		criteriaMode: "all",
	});
	
    /**
     * * 📨 Handle form submission
     * @param data - Validated form data
     */
	const onSubmit = async (data: createOrderFormType) => {
		await createOrder({ variables: { input: data } });
	};

	return (
		<>
			<BackButton />
			<h1 className="text-2xl font-bold mb-4 text-center">
				Place new order
			</h1>

			{/* ----------------------------------------------------------
                Create Order Form
            ---------------------------------------------------------- */}
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit(onSubmit)}
					className="space-y-4">
					<InputField name="location" />
					<InputField name="product" />
					<InputField
						name="quantity"
						type="number"
					/>
					<SubmitButton
						label="Place order"
						loading={loading}
					/>
				</form>
			</FormProvider>
		</>
	);
};

// 🔒 Restrict access to CUSTOMER role only
export default WithAuth(CreateOrder, {
	allowedRoles: [UserRole.CUSTOMER],
});
