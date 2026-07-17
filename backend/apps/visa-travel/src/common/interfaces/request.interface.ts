import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    accountType: string;
    sessionId: string;
  };
}


