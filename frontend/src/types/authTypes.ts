import type { UserRoleType } from "#/enums/userRoles.enum";

export type UserResponse = {
	signIn: {
		id: string;
		email: string;
		name: string;
		role: UserRoleType;
		token: string
	};
};

export type TokenResponse = UserResponse & {
	token: string
}
