"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PublicContactModal } from "@/src/modules/shared/components/public/PublicContactModal";
import type { AssociateDemo } from "./demoData";

interface Props {
  associate: AssociateDemo;
}

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex items-start gap-2 text-xs">
    <span className="text-[11px] font-semibold text-foreground/80 whitespace-nowrap">{label}:</span>
    <span className="text-muted-foreground">{value || "—"}</span>
  </div>
);

const AssociateDetails = ({ associate }: Props) => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <div className="bg-card shadow border rounded-lg overflow-hidden max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 p-4 md:p-5">
          <div className="w-full lg:w-48 flex flex-col items-center gap-3 shrink-0">
            <div className="relative w-28 h-28 rounded-lg border bg-card overflow-hidden p-2">
              {associate.logo ? (
                <Image
                  src={associate.logo}
                  alt={associate.name}
                  fill
                  className="object-contain p-2"
                  sizes="160px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                  No Logo
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3 min-w-0">
            <div className="border-b pb-2">
              <h1 className="text-xl font-bold text-foreground">{associate.name}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{associate.company}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
              <InfoRow label="Full Name" value={associate.fullName || associate.name} />
              <InfoRow label="Email" value={associate.email} />
              <InfoRow label="Nationality" value={associate.nationality} />
              {associate.workType && <InfoRow label="Work Type" value={associate.workType} />}
              <InfoRow label="Category" value={associate.category} />
              {associate.subcategory && (
                <div className="md:col-span-2">
                  <InfoRow label="Subcategory" value={associate.subcategory} />
                </div>
              )}
              {associate.propertyType && (
                <div className="md:col-span-2">
                  <InfoRow label="Property Type" value={associate.propertyType} />
                </div>
              )}
              <InfoRow label="Employee" value={associate.employee} />
              <InfoRow label="Service Area" value={associate.serviceArea} />
              <InfoRow label="Establishment" value={associate.establishment} />
              <InfoRow label="Completed Projects" value={associate.completedProjects} />
              {associate.officeAddress && (
                <div className="md:col-span-2">
                  <InfoRow label="Office Address" value={associate.officeAddress} />
                </div>
              )}
              {associate.aim && <InfoRow label="Aim" value={associate.aim} />}
              <div className="md:col-span-2">
                <InfoRow
                  label="Supported Languages"
                  value={associate.supportedLanguages?.join(", ")}
                />
              </div>
              {associate.requiredSkills && (
                <div className="md:col-span-2">
                  <InfoRow label="Required Skills" value={associate.requiredSkills} />
                </div>
              )}
            </div>

            {associate.description && (
              <div className="pt-3 border-t">
                <h3 className="text-xs font-bold text-foreground mb-1.5">
                  Description Of Services
                </h3>
                <p className="text-[11px] text-foreground/80 leading-relaxed">
                  {associate.description}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/associate">
                <Button variant="outline" size="sm">
                  Back to list
                </Button>
              </Link>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => setContactOpen(true)}
              >
                Contact
              </Button>
              {associate.email && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${associate.email}`}>View Portfolio</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <PublicContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title={`Contact ${associate.name}`}
        description="Send a message to this associate partner."
        subject={`Inquiry for ${associate.name}`}
      />
    </>
  );
};

export default AssociateDetails;
