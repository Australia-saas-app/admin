import { Request } from "express";

export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    accountType: string;
    sessionId: string;
    name?: string;
  };
}

export interface RequestWithAdmin extends Request {
  admin?: {
    adminId: string;
    email: string;
    role: string;
  };
}
