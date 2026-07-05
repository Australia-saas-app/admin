import { SERVICE_NAME } from "@/src/types/global.type";
import { NavItem } from "../types/auth.types";
export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Home", key: "isHomeActive" },
  {
    path: `/${SERVICE_NAME.technical}`,
    label: "Technical",
    key: "isTechnicalActive",
  },
  { path: "/gallery", label: "Gallery", key: "isGalleryActive" },
  { path: "/notice", label: "Notice", key: "isNoticeActive" },
  { path: "/employers", label: "Employers", key: "isEmployeerActive" },
  { path: "/blogs", label: "Blog", key: "isBlogActive" },
  { path: "/associate", label: "Associate", key: "isAssociateActive" },
  { path: "/branch", label: "Branch", key: "isBranchActive" },
];

export const SERVICE_NAMES: NavItem[] = [
  {
    path: `/${SERVICE_NAME.technical}`,
    label: "Technical",
    key: "isTechnicalActive",
  },
  {
    path: `/${SERVICE_NAME.construction}`,
    label: "Construction",
    key: "isConstructionActive",
  },
  {
    path: `/${SERVICE_NAME.realEstate}`,
    label: "Real Estate",
    key: "isRealEstateActive",
  },
  {
    path: `/${SERVICE_NAME.importExport}`,
    label: "Import & Export",
    key: "isImportExportActive",
  },
  {
    path: `/${SERVICE_NAME.visaTravel}`,
    label: "Visa & Travel",
    key: "isVisaTravelActive",
  },
];
