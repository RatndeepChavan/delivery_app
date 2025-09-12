import { z } from "zod";
import { loginFormSchema } from "./loginValidation";
import { customMsg } from "#/utils/customMessages";
import { UserRoleValues } from "#/enums/userRoles.enum";

export const registrationFormSchema = z.object({
    ...loginFormSchema.shape,
    name: z
        .string({ error: customMsg.email.require})
        .min(2, customMsg.name.too_short )
        .max(50, customMsg.name.too_long),
    repeatPassword: z.string({ error: customMsg.confirm_password.empty }),
    role: z
        .enum(UserRoleValues, { error : customMsg.role.invalid }),
}).refine(
    (data) => data.password === data.repeatPassword, {
        error: customMsg.confirm_password.mismatch,
        path: ["repeatPassword"], // Path of the error
    }
);

export type registrationFormType = z.infer<typeof registrationFormSchema>