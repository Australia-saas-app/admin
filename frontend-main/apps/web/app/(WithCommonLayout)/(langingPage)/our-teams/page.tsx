import OurTeamLayout from "@/src/modules/our-teams/components/OurTeamLayout";
import { buildMetadata } from "@/src/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Our Teams",
  description: "Meet the people behind our platform — leadership, engineering, and operations.",
  path: "/our-teams",
});

const Page = () => {
  return (
    <main className="min-h-screen w-full max-w-7xl mx-auto px-4 py-6 md:px-6">
      <OurTeamLayout />
    </main>
  );
};

export default Page;
