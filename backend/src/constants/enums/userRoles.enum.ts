/**
 * * 👥 User Roles Enum & Types
 * ? Defines the roles available in the system.
 * ? Enforces type safety and avoids magic strings across the codebase.
 */
export enum UserRole {
    CUSTOMER = "Customer",
    DELIVERY = "Delivery",
}

/**
 * * 🔖 UserRoleType
 * ? A string literal type derived from `UserRole`.
 */
export type UserRoleType = `${UserRole}`;

/**
 * * 📋 UserRoleValues
 * ? Array containing all possible roles.
 */
export const UserRoleValues: UserRoleType[] = Object.values(UserRole);
