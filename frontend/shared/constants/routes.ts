/**
 * Centralized route constants.
 * Import this instead of writing raw string paths throughout the codebase.
 *
 * Usage:
 *   import { ROUTES } from "@/src/constants/routes";
 *   router.push(ROUTES.auth.login);
 */

export const ROUTES = {
  /** Public / landing pages */
  home: "/",
  gallery: "/gallery",
  notice: "/notice",
  ourTeams: "/our-teams",
  associate: "/associate",
    branch: "/branch",
  blogs: "/blogs",

  /** Service pages */
  services: {
    technical: "/technical",
    construction: "/construction",
    realEstate: "/realEstate",
    importExport: "/importExport",
    visaTravel: "/visaTravel",
  },

  /** Authentication */
  auth: {
    login: "/account/user/login",
    register: "/account/user/registration",
    forgotPassword: "/account/user/forgot-password",
    resetPassword: "/account/user/reset-password",
  },

  /** User dashboard */
  dashboard: {
    root: "/dashboard",
    profile: "/user/profile",
    security: "/user/security",
    changePassword: "/user/change-password",
    deleteAccount: "/user/delete-account",
    technicalProjects: "/user/technical-projects",
    technicalPayments: "/user/technical-payments",
  },

  /** Buyer / Seller map to role dashboards (legacy aliases). */
  buyer: "/user/dashboard",
  seller: "/business/dashboard",
} as const;

export type AppRoute = typeof ROUTES;
