"use client";

import type { Project, UserType } from "@/src/lib/service-types";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Share2, Eye, Plus } from "lucide-react";

interface ServiceProjectCardProps {
  project: Project;
  userType: UserType;
  onViewDetails?: (projectId: string) => void;
  onCreateProject?: (projectData?: Partial<Project>) => void;
  onShareProject?: (projectId: string) => void;
  onApproveProject?: (projectId: string) => void;
  isCreateCard?: boolean;
}

export function ServiceProjectCard({
  project,
  userType,
  onViewDetails,
  onCreateProject,
  onShareProject,
  onApproveProject,
  isCreateCard = false,
}: ServiceProjectCardProps) {
  if (isCreateCard) {
    return (
      <Card
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors h-full min-h-64"
        onClick={() => onCreateProject?.()}
      >
        <Plus className="h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="font-semibold text-center">Create New Project</h3>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Click to post a new project
        </p>
      </Card>
    );
  }

  const statusColors: Record<string, string> = {
    open: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-muted text-foreground",
    "pending-approval": "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow flex flex-col">
      <div className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1">{project.title}</h3>
          <Badge className={statusColors[project.status] || statusColors.open}>
            {project.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
      </div>

      {/* Category & Subcategory */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <Badge variant="outline" className="text-xs">
          {project.category}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {project.subcategory}
        </Badge>
      </div>

      {/* Skills */}
      {project.skills.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Required Skills:</p>
          <div className="flex gap-1 flex-wrap">
            {project.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Budget */}
      {project.budget && (
        <div className="mb-3 py-2 border-t border-border">
          <p className="text-sm font-semibold">${project.budget.toLocaleString()}</p>
        </div>
      )}

      {/* Actions based on user type */}
      <div className="mt-auto pt-3 border-t border-border flex gap-2">
        {userType === "unauthorized" && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => onViewDetails?.(project.id)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        )}

        {userType === "user" && (
          <>
            <Button size="sm" className="flex-1" onClick={() => onViewDetails?.(project.id)}>
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            <Button size="sm" variant="outline" onClick={() => onApproveProject?.(project.id)}>
              Apply
            </Button>
          </>
        )}

        {userType === "affiliate" && (
          <>
            <Button size="sm" className="flex-1" onClick={() => onViewDetails?.(project.id)}>
              View
            </Button>
            <Button size="sm" variant="outline" onClick={() => onShareProject?.(project.id)}>
              <Share2 className="h-3 w-3" />
            </Button>
          </>
        )}

        {userType === "business" && (
          <>
            <Button size="sm" className="flex-1" onClick={() => onApproveProject?.(project.id)}>
              View Proposal
            </Button>
            <Button size="sm" variant="outline">
              {project.status === "approved" ? "In Progress" : "Approve"}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
