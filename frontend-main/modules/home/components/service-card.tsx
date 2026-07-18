import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  href: string;
  reversed?: boolean;
}

export default function ServiceCard({
  title,
  description,
  image,
  href,
  reversed = false,
}: ServiceCardProps) {
  return (
    <div
      className={`reveal-scroll flex flex-col items-center gap-8 md:gap-12 ${
        reversed ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="group w-full flex-shrink-0 lg:w-2/5">
        <div className="overflow-hidden rounded-3xl border border-border shadow-md">
          <Image
            src={image ?? "/file.svg"}
            alt={title}
            width={560}
            height={400}
            className="h-64 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 md:h-80"
          />
        </div>
      </div>

      <div className="w-full lg:w-3/5">
        <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>
        <Link
          href={href}
          className="group/link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Read more
          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
