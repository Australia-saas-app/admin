export const APPLICATION_STATUSES = [
  'draft',
  'submitted',
  'processing',
  'approved',
  'rejected',
  'closed',
] as const;

export const BOOKING_STATUSES = [
  'pending',
  'payment',
  'waiting',
  'working',
  'stopped',
  'complete',
  'delivery',
  'refund',
  'cancel',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

