import type { IUser } from "#interfaces/auth.interface.js";

export interface IToken extends Partial<IUser>{
    exp: number;
    iat: number;
}

export interface ITokenType {
    accessToken: string
    refreshToken: string
}