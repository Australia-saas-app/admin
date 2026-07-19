import { buildMetadata } from "@/src/lib/seo";
export const metadata = buildMetadata({ title: "Signin" });
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }