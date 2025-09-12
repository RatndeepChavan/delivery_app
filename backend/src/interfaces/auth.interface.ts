import type { UserRoleType } from "#constants/enums/userRoles.enum.js";
import type { ITokenType } from "#interfaces/jwt.interface.js";
import type { Types } from "mongoose";

export interface IAuthPayload {
    token : ITokenType
    user:  IUser
}

export interface ILogin {
    email: string;
    password: string;
}

export interface ISignup {
    email: string;
    name: string;
    password: string;
    repeatPassword: string
    role: UserRoleType;
}

export interface IUser {
    email: string;
    id: string | Types.ObjectId;
    name: string;
    role: UserRoleType;
}

export interface IUserModel extends IUser {
    password: string;
}
