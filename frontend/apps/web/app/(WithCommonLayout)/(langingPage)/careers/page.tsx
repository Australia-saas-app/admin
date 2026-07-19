import CareersPage from "@/src/modules/jobs/components/CareersPage";
import { buildMetadata } from "@/src/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Careers",
  description: "Job openings and career opportunities across our global network.",
  path: "/careers",
});

const Page = () => {
  return (
    <main className="min-h-screen max-w-[1400px] w-full px-4 md:px-8 mx-auto py-8">
      <CareersPage />
    </main>
  );
};

export default Page;
