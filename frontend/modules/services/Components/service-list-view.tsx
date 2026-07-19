"use client"

import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import type { Project, UserType } from "@/src/lib/service-types"
import { Eye, Plus, Share2 } from "lucide-react"

interface ServiceListViewProps {
  projects: Project[]
  userType: UserType
  onViewDetails?: (projectId: string) => void
  onCreateProject?: () => void
  onShareProject?: (projectId: string) => void
  onApproveProject?: (projectId: string) => void
  isLoading?: boolean
}

export function ServiceListView({
  projects,
  userType,
  onViewDetails,
  onCreateProject,
  onShareProject,
  onApproveProject,
  isLoading,
}: ServiceListViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-muted animate-pulse rounded h-20" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {userType !== "unauthorized" && userType !== "business" && (
        <Button onClick={onCreateProject} className="w-full mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
      )}

      {projects.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No projects found</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold line-clamp-1">{project.title}</h3>
              <Badge variant="outline" className="text-xs">
                {project.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {project.category}
                </Badge>
                {project.budget && (
                  <Badge variant="secondary" className="text-xs">
                    ${project.budget.toLocaleString()}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                {(userType === "unauthorized" || userType === "affiliate") && (
                  <Button size="sm" variant="outline" onClick={() => onViewDetails?.(project.id)}>
                    <Eye className="h-3 w-3" />
                  </Button>
                )}

                {userType === "affiliate" && (
                  <Button size="sm" variant="outline" onClick={() => onShareProject?.(project.id)}>
                    <Share2 className="h-3 w-3" />
                  </Button>
                )}

                {userType === "user" && (
                  <Button size="sm" onClick={() => onApproveProject?.(project.id)}>
                    Apply
                  </Button>
                )}

                {userType === "business" && <Button size="sm">Approve</Button>}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
