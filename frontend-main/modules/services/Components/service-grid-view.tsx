"use client"

import type { Project, UserType } from "@/src/lib/service-types"
import { ServiceProjectCard } from "./service-project-card"

interface ServiceGridViewProps {
  projects: Project[]
  userType: UserType
  isLoading?: boolean
  onViewDetails?: (projectId: string) => void
  onCreateProject?: (projectData?: Partial<Project>) => void
  onShareProject?: (projectId: string) => void
  onApproveProject?: (projectId: string) => void
  showCreateCard?: boolean
}

export function ServiceGridView({
  projects,
  userType,
  isLoading,
  onViewDetails,
  onCreateProject,
  onShareProject,
  onApproveProject,
  showCreateCard = true,
}: ServiceGridViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-muted animate-pulse rounded-lg h-64" />
        ))}
      </div>
    )
  }

  // Different grid columns based on user type
  const gridClass = userType === "business" 
    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

  return (
    <div className={gridClass}>
      {showCreateCard && userType !== "unauthorized" && userType !== "business" && (
        <ServiceProjectCard
          project={{} as Project}
          userType={userType}
          isCreateCard={true}
          onCreateProject={onCreateProject}
        />
      )}

      {projects.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No projects found</p>
        </div>
      ) : (
        projects.map((project) => (
          <ServiceProjectCard
            key={project.id}
            project={project}
            userType={userType}
            onViewDetails={onViewDetails}
            onCreateProject={onCreateProject}
            onShareProject={onShareProject}
            onApproveProject={onApproveProject}
          />
        ))
      )}
    </div>
  )
}
