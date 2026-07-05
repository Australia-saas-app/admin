import AccountDeleteLayout from "../components/AccountDeleteLayout";
import AccountSecurityLayout from "../components/AccountSecurityLayout";
import ChangePasswordLayout from "../components/ChangePasswordLayout";
import ProfilePageLayout from "../components/ProfilePageLayout";

  export const ProfileTabs = [
    { id: "profile", label: "Profile", component:ProfilePageLayout, url:"/user/profile" },
    { id: "change-password", label: "Change Password", component:ChangePasswordLayout, url:"/user/profile/change-password" },
    { id: "account-security", label: "Account security", component:AccountSecurityLayout, url:"/user/profile/account-security" },
    { id: "account-delete", label: "Account Delete", component:AccountDeleteLayout, url:"/user/profile/account-delete" },
  ]