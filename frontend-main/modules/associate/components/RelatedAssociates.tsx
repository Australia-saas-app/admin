import Link from "next/link";
import Image from "next/image";
import type { AssociateDemo } from "../demoData";

/**
 * Related associates under a detail page — same category first, then others.
 */
export function RelatedAssociates({
  current,
  all,
  limit = 3,
}: {
  current: AssociateDemo;
  all: AssociateDemo[];
  limit?: number;
}) {
  const others = all.filter((a) => a.id !== current.id);
  const sameCategory = others.filter((a) => a.category === current.category);
  const rest = others.filter((a) => a.category !== current.category);
  const related = [...sameCategory, ...rest].slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section aria-label="Related associates" className="mt-12 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-foreground md:text-2xl">Related associates</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        More partners in {current.category} and nearby categories.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((associate) => (
          <Link
            key={associate.id}
            href={`/associate/${associate.id}`}
            className="card-lift group overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="relative flex h-28 items-center justify-center bg-muted">
              {associate.logo ? (
                <Image
                  src={associate.logo}
                  alt=""
                  width={64}
                  height={64}
                  className="object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-primary/40">
                  {associate.name.slice(0, 1)}
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {associate.category}
              </p>
              <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-foreground">
                {associate.name}
              </h3>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{associate.company}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
