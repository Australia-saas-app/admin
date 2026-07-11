import { BiRupee } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { IoIosCodeWorking } from "react-icons/io";
import {
  MdAccountBalanceWallet,
  MdCancelScheduleSend,
  MdIncompleteCircle,
  MdPendingActions,
  MdUpcoming,
  MdConfirmationNumber,
} from "react-icons/md";
import {
  RiLuggageDepositFill,
  RiLuggageDepositLine,
  RiPassPendingFill,
  RiSpam2Fill,
} from "react-icons/ri";

// Demo dataset used in DashboardLayout until backend data replaces it.
export const demoDashboardData = [
  { name: "Total Users", icon: FiUsers, number: 7260 },
  { name: "Total Active User", icon: MdPendingActions, number: 7260 },
  { name: "Total Suspend User", icon: IoIosCodeWorking, number: 7260 },
  { name: "Total Block User", icon: MdCancelScheduleSend, number: 7260 },
  { name: "Total Dormant User", icon: MdIncompleteCircle, number: 7260 },
  { name: "Total Closed User", icon: BiRupee, number: 7265 },
  { name: "Total Agent", icon: MdAccountBalanceWallet, number: 7265 },
  { name: "Total Pending Agent", icon: MdUpcoming, number: 7265 },
  { name: "Total Dormant Agent", icon: RiLuggageDepositFill, number: 7265 },
  { name: "Total Inactive Agent", icon: RiLuggageDepositLine, number: 7265 },
  { name: "Total Active Agent", icon: MdConfirmationNumber, number: 7265 },
  { name: "Total Suspend Agent", icon: RiSpam2Fill, number: 7265 },
  { name: "Total Block User 2", icon: RiSpam2Fill, number: 7265 },
  { name: "Total Subscribe", icon: RiSpam2Fill, number: 14785 },
  { name: "Total communication", icon: RiSpam2Fill, number: 6230 },
  { name: "Total live chat user", icon: RiSpam2Fill, number: 2645 },
];

// Additional demo objects to replace Redux/backend data while developing
export const demoUsers = {
  totalusers: 1543,
};

export const demoOrders = {
  totaluserorder: 842,
  totalpendingorders: 96,
  totalorderpayment: 312,
  totalwaitingorders: 48,
  totalworkingorders: 214,
  totalcompleteorders: 520,
  totaldeliveredorders: 410,
  totalcancelorders: 34,
  userorders: [
    { project_type: "Website Development", budget: 1200, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { project_type: "Mobile App UI", budget: 800, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { project_type: "SEO Optimization", budget: 300, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  ],
};

export const demoPayments = {
  totalsumpayment: 126480,
  totaluserpayment: 98752,
  totalpendingpayment: 76,
  totalacceptedpayment: 628,
  totalspampayment: 12,
  userpayment: [
    { account_name: "John Doe", amount: 1200, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { account_name: "Acme Corp", amount: 4500, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
    { account_name: "Jane Smith", amount: 320, createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  ],
};

export const demoReturns = {
  totaluserrefund: 9,
  totalsumrefund: 2480,
  totalpendingrefund: 3,
  totalsedningrefund: 4,
  totalIneligibleRefund: 1,
  userrefund: [
    { account_name: "John Doe", amount: 120, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
    { account_name: "Jane Smith", amount: 80, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString() },
    { account_name: "Acme Corp", amount: 220, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString() },
  ],
};

export const demoAgencies = {
  totalAgency: 24,
  agencies: [
    { agencyName: "BrightAgency", fullName: "Bright Agency LLC", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
    { agencyName: "BlueSky", fullName: "Blue Sky Inc.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() },
    { agencyName: "GreenField", fullName: "Green Field Co.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
  ],
};

export default demoDashboardData;
