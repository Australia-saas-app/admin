import { TOrder } from "@/src/modules/project-chat/types";

export const demoProject: TOrder = {
  orderId: "DEMO-1001",
  serviceType: "Demo Service",
  orderStatus: "pending",
  createdAt: new Date().toISOString(),
  // optional fields you might find useful while developing:
  customerName: "Demo Customer",
  totalAmount: 0,
  currency: "USD",
  serviceTypeId: "svc-demo",
  notes: "This is a development/demo order — replace with backend data later.",
} as unknown as TOrder;