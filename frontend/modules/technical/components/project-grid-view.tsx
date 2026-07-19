"use client";

import { useState } from "react";
import type { TechnicalProject } from "../types/project.type";
import { PublicDetailModal } from "@/src/modules/shared/components/public/PublicDetailModal";
import { PublicApplyModal } from "@/src/modules/shared/components/public/PublicApplyModal";
import { Button } from "@/src/components/ui/button";
import { useLocale } from "@/src/shared/context/locale.provider";
import { useRequireAuth } from "@/src/shared/hooks/use-require-auth";

interface ProjectGridViewProps {
  projects: TechnicalProject[];
  onViewProject?: (project: TechnicalProject) => void;
}

export function ProjectGridView({ projects, onViewProject }: ProjectGridViewProps) {
  const { t } = useLocale();

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <article
          key={project.id}
          className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card card-lift shadow-sm"
        >
          <div className="h-1.5 bg-primary" />

          <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <span className="rounded-md bg-[#eef2f8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                {project.category}
              </span>
              <span className="text-sm font-bold text-primary">{project.priceRange}</span>
            </div>

            <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-foreground group-hover:text-primary">
              {project.title}
            </h3>

            <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>

            <Button
              type="button"
              className="w-full bg-primary font-semibold hover:bg-primary/90"
              onClick={() => onViewProject?.(project)}
            >
              {t.technical.viewProject}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

export function useTechnicalProjectModal() {
  const [selected, setSelected] = useState<TechnicalProject | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const { requireAuth } = useRequireAuth();

  const openApply = () => {
    requireAuth(() => setApplyOpen(true));
  };

  const modal = (
    <>
      <PublicDetailModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "Project"}
        subtitle={selected?.category}
        fields={
          selected
            ? [
                { label: "Budget", value: selected.priceRange },
                { label: "Duration", value: selected.duration },
                { label: "Experience", value: selected.experience },
                { label: "Skills", value: selected.skills.join(", ") },
                { label: "Description", value: selected.description },
              ]
            : []
        }
        footer={
          selected && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelected(null)}>
                Close
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={openApply}>
                Apply to project
              </Button>
            </div>
          )
        }
      />
      {selected && (
        <PublicApplyModal
          open={applyOpen}
          onClose={() => setApplyOpen(false)}
          type="technical"
          itemId={String(selected.id)}
          itemTitle={selected.title}
          title="Apply to technical project"
          description="Submit your application. The project owner will review your profile and contact you."
        />
      )}
    </>
  );

  return { selected, setSelected, modal };
}
