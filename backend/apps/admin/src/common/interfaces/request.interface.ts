import { Request } from 'express';

export interface AdminRequest extends Request {
  admin?: {
    adminId: string;
    email: string;
    role: string;
  };
}




