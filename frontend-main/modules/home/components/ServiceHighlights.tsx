import ServiceCard from "./service-card";
import { HIGHLIGHT_ROUTES } from "@/src/shared/constants/site-routes";
import { PLATFORM_TAGLINE } from "../constants/home.constants";

function ServiceHighlights() {
  const serviceDetails = [
    {
      title: "Technology",
      description:
        "Discover vetted technical projects, skilled professionals, and end-to-end delivery workflows on a single platform built for scale.",
      image: "/technology-team-meeting.jpg",
      link: "Read More...",
      href: HIGHLIGHT_ROUTES.Technology,
    },
    {
      title: "Construction",
      description:
        "We help construction companies build a strong online presence and reach more clients. Our services include creating professional websites that highlight your projects, services, and achievements. We also handle the entire architecture.",
      image: "/construction-site-building.jpg",
      link: "Read More...",
      href: HIGHLIGHT_ROUTES.Construction,
    },
    {
      title: "Real Estate",
      description:
        "We offer specialized real estate marketing services designed to help property businesses connect with buyers, sellers, and investors more effectively. Our team creates custom solutions, user-friendly websites that let you connect with property owners.",
      image: "/real-estate-property-hands.jpg",
      link: "Read More...",
      href: HIGHLIGHT_ROUTES["Real Estate"],
    },
  ];

  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="reveal-scroll mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Featured</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            Featured service areas
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            {PLATFORM_TAGLINE}
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {serviceDetails.map((service, index) => (
            <ServiceCard key={service.title} {...service} reversed={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceHighlights;
