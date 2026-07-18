import ContactUsPageLayout from "@/src/modules/shared/components/ContactUsPageLayout";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with our team for support, partnerships, and business inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactUsPageLayout />;
}
