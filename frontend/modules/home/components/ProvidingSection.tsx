import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  HOME_BLOGS_CARD_DATA,
  HOME_BLOG_SECTION_DATA,
  PLATFORM_TAGLINE,
} from "../constants/home.constants";

type Card = {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  date?: string;
};

interface Props {
  hero?: { image: string; title?: string; subtitle?: string };
  cards?: Card[];
}

export default function ProvidingSection({
  hero = {
    image: "/technology-team-meeting.jpg",
    title: "Platform insights",
    subtitle: PLATFORM_TAGLINE,
  },
  cards = HOME_BLOGS_CARD_DATA,
}: Props) {
  const displayed = cards.length >= 3 ? cards.slice(0, 3) : HOME_BLOGS_CARD_DATA.slice(0, 3);
  const mapImage =
    HOME_BLOG_SECTION_DATA.mapImage ??
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 md:gap-8 md:grid-cols-3 items-start">
          {/* Hero large image left (spans 2 columns on md and above) */}
          <div className="md:col-span-2 w-full">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={hero.image}
                alt={hero.title || "hero"}
                width={1200}
                height={700}
                className="w-full h-72 md:h-[420px] object-cover"
                style={{ width: "100%", height: "auto" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-6 md:p-10 text-white">
                  <h2 className="text-2xl md:text-3xl font-bold">{hero.title}</h2>
                  {hero.subtitle && (
                    <p className="mt-2 text-sm md:text-base opacity-90">{hero.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right stacked cards */}
          <div className="w-full flex flex-col gap-4">
            {displayed.map((c) => (
              <Link
                key={c.id}
                href="/blogs"
                className="flex gap-4 p-3 md:p-4 rounded-lg border hover:shadow-sm bg-white transition-shadow"
              >
                <div className="w-28 h-20 relative flex-shrink-0 rounded overflow-hidden">
                  <Image src={c.image} alt={c.title} fill className="object-cover" sizes="112px" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800">{c.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mt-1">{c.excerpt}</p>
                  <div className="text-xs text-gray-400 mt-2">{c.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Below: supplemental info/map block */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h4 className="text-lg md:text-xl font-bold text-gray-800">
              Global reach, local expertise
            </h4>
            <p className="text-gray-600 mt-3 max-w-xl">{PLATFORM_TAGLINE}</p>
            <div className="mt-4 flex gap-6 text-sm text-gray-600">
              {HOME_BLOG_SECTION_DATA.stats?.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-96 h-48 rounded overflow-hidden shadow-inner relative">
            <Image
              src={mapImage}
              alt="Global coverage map"
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
