import { InfoPageLayout } from "@/src/modules/info/components/InfoPageLayout";
import Link from "next/link";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How we collect, use, and protect your personal information across our global platform.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <InfoPageLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information across our global platform."
    >
      <h2>Information We Collect</h2>
      <p>
        We collect information you provide when registering, using dashboards, posting services, or
        contacting support. This may include name, email, phone, business details, and transaction
        records required to operate the platform.
      </p>

      <h2>How We Use Your Data</h2>
      <p>
        Your data is used to deliver services, process payments, improve platform security,
        communicate important notices, and comply with applicable regulations. We do not sell
        personal information to third parties.
      </p>

      <h2>Data Security</h2>
      <p>
        We apply industry-standard encryption, access controls, and audit logging. Account security
        settings are available in your dashboard under Account Security.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access, correction, or deletion of your data through your profile settings
        or by contacting our support team. Account deletion is available from your{" "}
        <Link href="/user/settings/account-delete">dashboard profile</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy inquiries, visit our <Link href="/branch">global branches</Link> page or use the
        contact options in the site footer.
      </p>
    </InfoPageLayout>
  );
}
