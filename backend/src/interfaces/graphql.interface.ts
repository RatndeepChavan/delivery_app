import type { IUser } from "#interfaces/auth.interface.js";
import type { Request, Response } from "express";

export interface GraphQLContext {
    req: Request;
    res: Response;
    user?: IUser | null;
}

export interface RequestBody {
    operationName?: string;
}