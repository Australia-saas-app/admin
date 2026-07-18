import CourseCatalog from "@/src/modules/courses/components/CourseCatalog";
import { buildMetadata } from "@/src/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Courses",
  description: "Professional training courses and certifications from industry experts.",
  path: "/courses",
});

const Page = () => {
  return <CourseCatalog />;
};

export default Page;
