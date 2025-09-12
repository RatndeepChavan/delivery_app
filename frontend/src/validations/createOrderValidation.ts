import { z } from "zod";

export const createOrderFormSchema = z.object({
    location: z
        .string()
        .min(1, { error: "Please enter location"})
        .trim(),

    product: z
        .string()
        .min(1, { error: "Please enter product"})
        .trim(),

    quantity: z.coerce
        .number({error: "Please specify valid quantity"})
        .min(1)
        .max(10, {error: "Max 10 product allowed per order"})
});

export type createOrderFormType = z.infer<typeof createOrderFormSchema>
