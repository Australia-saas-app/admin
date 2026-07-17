export interface UserRequest extends Request {
  user: {
    userId: string;
    email: string;
    phone: string;
  };
}

export interface AdminRequest extends Request {
  admin: {
    adminId: string;
    email: string;
    role: string;
  };
}