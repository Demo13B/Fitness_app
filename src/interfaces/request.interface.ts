import { Request } from "express";

export interface RequestWithUser extends Request {
    user: {
        user_id: number,
        role: string
    };
}