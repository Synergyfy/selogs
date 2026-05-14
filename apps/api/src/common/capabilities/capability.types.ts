/**
 * The metadata key used to store capability requirements on route handlers.
 */
export const CAPABILITY_KEY = 'capability' as const;

/**
 * All capability types the guard system understands.
 *
 * Numeric limits (branch / staff / device) are checked against the
 * plan + add-on snapshot and the organisation's current usage count.
 *
 * Boolean features (ocr / analytics / export) are checked against the
 * plan flags and any add-ons that grant those features.
 *
 * 'gate:create' has no hard numeric limit defined on the plan model but
 * still requires an active subscription.
 */
export type CapabilityType =
  | 'branch:create'
  | 'staff:create'
  | 'device:create'
  | 'gate:create'
  | 'ocr:use'
  | 'analytics:use'
  | 'export:use';

/**
 * The resolved capability snapshot for an organisation.
 * Merges the base plan with all active, non-expired add-ons.
 */
export interface CapabilitySnapshot {
  /** False when the subscription is expired, canceled, unpaid, or missing entirely. */
  isSubscriptionActive: boolean;
  /** Maximum number of branches allowed (plan + add-on increments). */
  branchLimit: number;
  /** Maximum number of staff/users allowed (plan + add-on increments). */
  staffLimit: number;
  /** Maximum number of registered devices allowed (plan + add-on increments). */
  deviceLimit: number;
  /** Whether OCR plate recognition is available. */
  hasOcr: boolean;
  /** Whether the analytics dashboard is available. */
  hasAnalytics: boolean;
  /** Whether data export is available. */
  hasExport: boolean;
}
