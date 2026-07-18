"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Form } from "@/src/components/form/form";
import { FormTextInput } from "@/src/components/form/form-text-input";
import FormTextarea from "@/src/components/form/form-textarea";
import { Button } from "@/src/components/ui/button";
import { useCreateContact } from "@/src/hooks/contact.hook";
import type { ContactForm } from "@/src/modules/shared/ContactModal";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

const contactChannels = [
  {
    icon: Mail,
    label: "Email",
    content: (
      <a href="mailto:support@systemdb.com" className="transition-colors hover:text-primary">
        support@systemdb.com
      </a>
    ),
  },
  {
    icon: Phone,
    label: "Phone",
    content: <p>+1 (555) 010-2040</p>,
  },
  {
    icon: MapPin,
    label: "Branches",
    content: (
      <Link href="/branch" className="text-primary transition-colors hover:text-primary/80">
        View global branches
      </Link>
    ),
  },
];

export default function ContactUsPageLayout() {
  const methods = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });
  const { mutateAsync: createContact, isPending } = useCreateContact();

  const onSubmit = async (data: ContactForm) => {
    await createContact(data, {
      onSuccess: () => methods.reset(),
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="reveal mb-12 text-center">
        <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
          Support
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
          Let&apos;s <span className="text-primary">talk</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          Reach the System DB team for account help, partnerships, or platform questions. We usually
          respond within one business day.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="reveal reveal-delay-1 space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h2 className="text-lg font-bold text-foreground">Get in touch</h2>
          {contactChannels.map(({ icon: Icon, label, content }) => (
            <div key={label} className="flex items-start gap-4 text-sm text-muted-foreground">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-foreground">{label}</p>
                {content}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal reveal-delay-2 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
              <FormTextInput control={methods.control} name="name" placeholder="Full name" />
              <FormTextInput
                control={methods.control}
                name="email"
                placeholder="Email"
                type="email"
              />
              <FormTextInput control={methods.control} name="subject" placeholder="Subject" />
              <FormTextarea
                control={methods.control}
                name="message"
                placeholder="How can we help?"
              />
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 w-full rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 hover:brightness-110"
              >
                {isPending ? "Sending…" : "Send message"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
