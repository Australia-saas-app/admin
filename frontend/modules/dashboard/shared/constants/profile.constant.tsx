import ProfilePageLayout from "../components/ProfilePageLayout"

export const PROFILE_BASE = "/user/profile"
export const SETTINGS_BASE = "/user/settings"

export const ProfileTabs = [
  { id: "profile", label: "Profile", component: ProfilePageLayout, url: PROFILE_BASE },
]

export const SettingsTabs = [
  { id: "change-password", label: "Change Password", url: `${SETTINGS_BASE}/change-password` },
  { id: "account-security", label: "Account security", url: `${SETTINGS_BASE}/account-security` },
  { id: "account-delete", label: "Account Delete", url: `${SETTINGS_BASE}/account-delete` },
]
