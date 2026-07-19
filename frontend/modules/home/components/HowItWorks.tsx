import Image from "next/image";

interface Step {
  title: string;
  description: string;
}

interface AudienceCard {
  title: string;
  titleColor: string;
  stepBg: string;
  stepText: string;
  image: string;
  imageAlt: string;
  steps: Step[];
}

const CARDS: AudienceCard[] = [
  {
    title: "For Users",
    titleColor: "text-[#2563EB]",
    stepBg: "bg-[#DBEAFE] dark:bg-blue-950",
    stepText: "text-[#2563EB] dark:text-blue-300",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    imageAlt: "User working on a laptop",
    steps: [
      { title: "Search Services", description: "Find the service you need." },
      { title: "Place Order & Pay", description: "Secure payment with escrow." },
      { title: "Get Your Work Done", description: "Receive and approve the work." },
    ],
  },
  {
    title: "For Affiliates",
    titleColor: "text-[#16A34A]",
    stepBg: "bg-[#DCFCE7] dark:bg-green-950",
    stepText: "text-[#16A34A] dark:text-green-300",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    imageAlt: "Affiliate partner smiling",
    steps: [
      { title: "Join Affiliate Program", description: "Sign up and get your link." },
      { title: "Promote & Share", description: "Share links and attract customers." },
      { title: "Earn Commission", description: "Get paid weekly." },
    ],
  },
  {
    title: "For Businesses",
    titleColor: "text-[#7C3AED]",
    stepBg: "bg-[#EDE9FE] dark:bg-purple-950",
    stepText: "text-[#7C3AED] dark:text-purple-300",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    imageAlt: "Business professional with a tablet",
    steps: [
      { title: "Create Business Profile", description: "Set up your business account." },
      { title: "Add Services & Team", description: "List services and invite team." },
      { title: "Get Orders & Grow", description: "Deliver & grow your business." },
    ],
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-7 text-center md:mb-9">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-[1.85rem]">
            How It Works
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Simple steps to get started.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
            >
              <div className="relative z-10 flex min-h-[220px] flex-col p-5 pr-[42%] sm:min-h-[240px] sm:p-6 sm:pr-[44%]">
                <h3 className={`text-lg font-bold md:text-xl ${card.titleColor}`}>{card.title}</h3>

                <ol className="mt-4 flex flex-1 flex-col gap-3.5">
                  {card.steps.map((step, index) => (
                    <li key={step.title} className="flex items-start gap-2.5">
                      <span
                        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${card.stepBg} ${card.stepText}`}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0 pt-0.5">
                        <span className="block text-sm font-bold leading-tight text-foreground">
                          {step.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                          {step.description}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pointer-events-none absolute bottom-0 right-0 top-8 w-[38%] sm:top-6 sm:w-[40%]">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 38vw, 15vw"
                  className="object-contain object-bottom"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
