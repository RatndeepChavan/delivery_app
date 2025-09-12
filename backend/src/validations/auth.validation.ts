import { customMsg } from "#constants/customMessages.js";
import { UserRoleValues } from "#constants/enums/userRoles.enum.js";
import { z } from "zod";

/**
 * * 🔐 Password Validation Regex
 *
 * ? Rules:
 *   - Min 8 characters
 *   - Max 50 characters
 *   - At least 1 uppercase letter
 *   - At least 1 lowercase letter
 *   - At least 1 number
 *   - At least 1 special character (@$!%*?&)
 * ! Regex strictly enforces strong passwords for security
 */
const passwordValidationRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")

/**
 * * 📝 Login Input Validation Schema
 * ? Validates email & password fields for login
 */
const loginValidationSchema = z.object({
    email: z
        .string()
        .trim()
        .min(10, { error : customMsg.email.too_short })
        .max(50, { error : customMsg.email.too_long })
        .check(z.email({ error: customMsg.email.invalid }))
        .toLowerCase(),
    password: z
        .string()
        .trim()
        .min(8, { error : customMsg.password.too_short })
        .max(50, { error : customMsg.password.too_long })
        .regex(passwordValidationRegex, {error : customMsg.password.weak }),
})

/**
 * * 📝 Signup Input Validation Schema
 * ? Extends login validation and adds name, role, and repeatPassword
 */
const signupValidationSchema = z.object({
    ...loginValidationSchema.shape,
    name: z
        .string()
        .trim()
        .min(1, { error : customMsg.name.too_short })
        .max(50, { error : customMsg.name.too_long }),
    repeatPassword: z.string({ error: customMsg.confirm_password.empty }),
    role: z.enum(UserRoleValues, { error : customMsg.role.invalid }),
}).refine(
    (data) => data.password === data.repeatPassword, {
        error: customMsg.confirm_password.mismatch,
        path: ["repeatPassword"], // ? Attach error to repeatPassword field
    }
);

/**
 * 📦 Exported validation schemas
 */
export const authValidations = { loginValidationSchema, signupValidationSchema };
