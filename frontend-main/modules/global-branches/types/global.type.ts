export type GlobalBranch = {
  id: string;
  branchName: string;
  address: string;
  phone: string;
  emailAddress: string | null;
  workingHours: string;
  services: string[];
  isVisible: boolean;
  displayOrder: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

