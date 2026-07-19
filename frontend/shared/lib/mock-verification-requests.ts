export type VerificationRole = "User" | "Affiliate" | "Business";

export type VerificationStatus = "Pending" | "Under Review" | "Approved" | "Rejected";

export type DocumentStatus = "Pending" | "Approved" | "Rejected";

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: DocumentStatus;
  fileLabel: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: VerificationRole;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  documents: VerificationDocument[];
}

export const MOCK_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: "VR-001",
    userId: "00004",
    name: "Alex Rivera",
    email: "alex@demo.com",
    role: "User",
    status: "Pending",
    submittedAt: "2025/07/28 09:15",
    documents: [
      {
        id: "D1",
        name: "Government ID",
        type: "Identity",
        uploadedAt: "2025/07/28",
        status: "Pending",
        fileLabel: "passport_scan.pdf",
      },
      {
        id: "D2",
        name: "Proof of address",
        type: "Address",
        uploadedAt: "2025/07/28",
        status: "Pending",
        fileLabel: "utility_bill.pdf",
      },
    ],
  },
  {
    id: "VR-002",
    userId: "00005",
    name: "Priya Sharma",
    email: "priya@demo.com",
    role: "Affiliate",
    status: "Under Review",
    submittedAt: "2025/07/27 14:30",
    documents: [
      {
        id: "D3",
        name: "Government ID",
        type: "Identity",
        uploadedAt: "2025/07/27",
        status: "Approved",
        fileLabel: "national_id.pdf",
      },
      {
        id: "D4",
        name: "Tax form (W-9)",
        type: "Tax",
        uploadedAt: "2025/07/27",
        status: "Pending",
        fileLabel: "w9_signed.pdf",
      },
      {
        id: "D5",
        name: "Affiliate agreement",
        type: "Agreement",
        uploadedAt: "2025/07/27",
        status: "Pending",
        fileLabel: "affiliate_agreement.pdf",
      },
    ],
  },
  {
    id: "VR-003",
    userId: "00006",
    name: "Nordic Build Co.",
    email: "contact@nordicbuild.demo",
    role: "Business",
    status: "Pending",
    submittedAt: "2025/07/29 11:00",
    documents: [
      {
        id: "D6",
        name: "Business registration",
        type: "Business",
        uploadedAt: "2025/07/29",
        status: "Pending",
        fileLabel: "certificate_of_incorporation.pdf",
      },
      {
        id: "D7",
        name: "Tax ID / EIN",
        type: "Tax",
        uploadedAt: "2025/07/29",
        status: "Pending",
        fileLabel: "ein_letter.pdf",
      },
      {
        id: "D8",
        name: "Authorized signatory ID",
        type: "Identity",
        uploadedAt: "2025/07/29",
        status: "Pending",
        fileLabel: "director_passport.pdf",
      },
      {
        id: "D9",
        name: "Bank verification letter",
        type: "Financial",
        uploadedAt: "2025/07/29",
        status: "Pending",
        fileLabel: "bank_letter.pdf",
      },
    ],
  },
  {
    id: "VR-004",
    userId: "00007",
    name: "James Okonkwo",
    email: "james@demo.com",
    role: "Affiliate",
    status: "Rejected",
    submittedAt: "2025/07/20 16:45",
    reviewedAt: "2025/07/22 10:00",
    reviewedBy: "Admin",
    notes: "Tax document was incomplete. Resubmit with signed W-9.",
    documents: [
      {
        id: "D10",
        name: "Government ID",
        type: "Identity",
        uploadedAt: "2025/07/20",
        status: "Approved",
        fileLabel: "drivers_license.pdf",
      },
      {
        id: "D11",
        name: "Tax form (W-9)",
        type: "Tax",
        uploadedAt: "2025/07/20",
        status: "Rejected",
        fileLabel: "w9_unsigned.pdf",
      },
    ],
  },
  {
    id: "VR-005",
    userId: "00001",
    name: "Mr Jack",
    email: "jack@demo.com",
    role: "User",
    status: "Approved",
    submittedAt: "2025/01/16 08:00",
    reviewedAt: "2025/01/17 09:30",
    reviewedBy: "Admin",
    documents: [
      {
        id: "D12",
        name: "Government ID",
        type: "Identity",
        uploadedAt: "2025/01/16",
        status: "Approved",
        fileLabel: "id_card.pdf",
      },
    ],
  },
];

export function getVerificationById(id: string): VerificationRequest | undefined {
  return MOCK_VERIFICATION_REQUESTS.find((r) => r.id === id);
}

export function getVerificationByUserId(userId: string): VerificationRequest | undefined {
  return MOCK_VERIFICATION_REQUESTS.find((r) => r.userId === userId);
}

export const ROLE_DOCUMENT_REQUIREMENTS: Record<VerificationRole, string[]> = {
  User: ["Government ID", "Proof of address"],
  Affiliate: ["Government ID", "Tax form (W-9)", "Affiliate agreement"],
  Business: [
    "Business registration",
    "Tax ID / EIN",
    "Authorized signatory ID",
    "Bank verification letter",
  ],
};
