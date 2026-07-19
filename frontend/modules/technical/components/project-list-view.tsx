"use client";

import { Button } from "@/src/components/ui/button";
import { useLocale } from "@/src/shared/context/locale.provider";
import { Briefcase, Clock, MapPin } from "lucide-react";
import type { TechnicalProject, TechnicalUserRole } from "../types/project.type";

interface ProjectListViewProps {
  projects: TechnicalProject[];
  onViewProject?: (project: TechnicalProject) => void;
}

export function ProjectListView({ projects, onViewProject }: ProjectListViewProps) {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <article
          key={project.id}
          className="group rounded-xl border border-border bg-card p-5 card-lift shadow-sm md:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#eef2f8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {project.category}
                </span>
                {project.location && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {project.location}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-primary">
                {project.title}
              </h3>

              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {t.technical.duration}: {project.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {t.technical.experience}: {project.experience}
                </span>
                {project.modified && (
                  <span>
                    {t.technical.modified}: {project.modified}
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-row items-center justify-between gap-4 lg:flex-col lg:items-end">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{t.technical.budget}</p>
                <p className="text-xl font-bold text-primary">{project.priceRange}</p>
              </div>
              <Button
                type="button"
                className="bg-primary hover:bg-primary/90"
                onClick={() => onViewProject?.(project)}
              >
                {t.technical.viewProject}
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
