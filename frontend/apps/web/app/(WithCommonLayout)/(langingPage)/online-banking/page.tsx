import { InfoPageLayout } from "@/src/modules/info/components/InfoPageLayout";
import Link from "next/link";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Online Banking Services",
  description:
    "Secure digital banking integrations for business accounts, withdrawals, and global transactions.",
  path: "/online-banking",
});

export default function OnlineBankingPage() {
  return (
    <InfoPageLayout
      title="Online Banking Services"
      subtitle="Secure digital banking integrations for business accounts, withdrawals, and global transactions."
    >
      <h2>Business Accounts</h2>
      <p>
        Registered business users can manage withdrawals, transaction history, and service payments
        through the <Link href="/business/transaction">business transaction center</Link>. Supported
        methods include bank transfer, Stripe, PayPal, and Wise.
      </p>

      <h2>Security</h2>
      <p>
        All financial operations require authenticated sessions and optional two-factor
        verification. Review your{" "}
        <Link href="/user/settings/account-security">account security settings</Link> regularly.
      </p>

      <h2>Supported Currencies</h2>
      <p>
        USD, INR, and EUR are supported platform-wide. Currency preferences can be set in the site
        footer and apply across marketplace, real estate, and course listings.
      </p>

      <h2>Get Started</h2>
      <p>
        <Link href="/account/business/registration">Register a business account</Link> or{" "}
        <Link href="/account/user/login">sign in</Link> to access banking features.
      </p>
    </InfoPageLayout>
  );
}
