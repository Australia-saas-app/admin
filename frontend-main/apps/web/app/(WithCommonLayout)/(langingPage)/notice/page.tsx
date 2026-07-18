import NoticeLayout from "@/src/modules/notice/components/NoticeLayout";
import { buildMetadata } from "@/src/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Notices",
  description: "Official announcements, updates, and notices from the platform.",
  path: "/notice",
});

export default function NoticePage() {
  return <NoticeLayout />;
}
