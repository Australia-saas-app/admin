import SearchResultsLayout from "@/src/modules/shared/components/search/SearchResultsLayout";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Search",
  noIndex: true,
});

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }> | { q?: string };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await Promise.resolve(searchParams ?? {});
  const q = typeof params.q === "string" ? params.q : "";

  return <SearchResultsLayout query={q} />;
}
