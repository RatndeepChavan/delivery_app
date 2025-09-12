import type { Model } from "mongoose";

import { UserRoleValues } from "#constants/enums/userRoles.enum.js";
import { IUserModel } from "#interfaces/auth.interface.js";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema<IUserModel> = new mongoose.Schema(
    {
        email: { lowercase: true, required: true, trim: true, type: String, unique: true },

        name: { required: true, trim: true, type: String },

        password: { required: true, type: String },

        role: {
            enum: UserRoleValues,
            required: true,
            type: String,
        },
    },
    { timestamps: true },
);

const User: Model<IUserModel> = mongoose.models.User ?? mongoose.model<IUserModel>("User", UserSchema);

export default User;
