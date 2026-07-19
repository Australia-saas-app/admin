export type Notice = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  type: string;
  priority: string;
  isVisible: boolean;
  isRead: boolean;
  publishAt: string | null;
  expiresAt: string | null;
  metadata: Record<string, unknown>;
  createdBy: string;
  targetAudience: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};