export type Metric = {
  id: string;
  value: string | number;
  label: string;
  hint?: string;
};

export type BlogSectionProps = {
  image?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type BlogCard = {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  date?: string;
  category?: string;
  href?: string;
};

export type MAP_STATS = {
  mapImage?: string;
  stats?: { value: number; label: string }[];
};
