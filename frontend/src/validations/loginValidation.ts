import { customMsg } from "#/utils/customMessages";
import { z } from "zod";

// ? min 8 and max 50 chars, at least one uppercase, one lowercase, one number and one special char
const passwordValidationRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")

export const loginFormSchema = z.object({
    email: z
        .string({ error: customMsg.email.require})
        .trim()
        .min(10, { error : customMsg.email.too_short })
        .max(50, { error : customMsg.email.too_long })
        .check(z.email({ error: customMsg.email.invalid })),

    password: z
        .string({ error: customMsg.password.require })
        .trim()
        .min(8, { error : customMsg.password.too_short })
        .max(50, { error : customMsg.password.too_long })
        .regex(passwordValidationRegex, {error : customMsg.password.weak })
});

export type loginFormType = z.infer<typeof loginFormSchema>