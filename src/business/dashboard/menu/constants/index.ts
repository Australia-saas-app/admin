import BlogyLayout from "../components/BlogyLayout";
import CompanyLayout from "../components/CompanyLayout";
import ContactUsLayout from "../components/ContactUsLayout";
import EmployeeLayout from "../components/EmployeeLayout";
import GlobalBranchLayout from "../components/GlobalBranchLayout";
import NoticeLayout from "../components/NoticeLayout";

export const MenuTabs = [
  { id: "global-branch", label: "Global Branch", component: GlobalBranchLayout, url: "/menu/global-branch" },
  { id: "notice", label: "Notice", component: NoticeLayout, url: "/menu/notice" },
  { id: "employee", label: "Employee", component: EmployeeLayout, url: "/menu/employee" },
  { id: "blog", label: "Blog", component: BlogyLayout, url: "/menu/blogs" },
  { id: "contact-us", label: "Contact Us", component: ContactUsLayout, url: "/menu/contact-us" },
  { id: "company", label: "Company", component: CompanyLayout, url: "/menu/company" },
];
