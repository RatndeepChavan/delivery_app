export enum UserRole {
    CUSTOMER = "Customer",
    DELIVERY = "Delivery",
}

export type UserRoleType = `${UserRole}`;

export const UserRoleValues: UserRoleType[] = Object.values(UserRole);
