export type PermanentAddress = {
  country: string;
  stateOrProvince: string;
  city: string;
  ziporPostalCode: string;
};

export type TOrder = {
  permanentAddress: PermanentAddress;
  _id: string;
  userEmail: string;
  serviceType: string;
  serviceName: string;
  fullName: string;
  nationality: string;
  dateOfBirth: string; // ISO date string
  secureIdentity: string;
  phone: string;
  email: string;
  projectType: string;
  priorityLevel: string;
  priceOrBudget: number;
  paidAmount: number;
  dueAmount: number;
  payCurrency: string;
  expectedEndDate: string; // ISO date string
  provideDocument: string; // URL string
  referenceName: string;
  description: string;
  orderStatus: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  orderId: string;
};
