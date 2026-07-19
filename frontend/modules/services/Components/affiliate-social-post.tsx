"use client";

import type { Project } from "@/src/lib/service-types";
import { Card } from "@/src/components/ui/card";
// import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button";
import { Share2, Heart, MessageCircle, Share } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/src/components/ui/badge";

interface AffiliateSocialPostProps {
  project: Project;
  affiliateName: string;
  shareLink: string;
}

export function AffiliateSocialPost({
  project,
  affiliateName,
  shareLink,
}: AffiliateSocialPostProps) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Share link copied to clipboard!");
  };

  return (
    <Card className="max-w-md mx-auto p-4 bg-card border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {affiliateName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm">{affiliateName}</p>
            <p className="text-xs text-muted-foreground">Shared a project</p>
          </div>
        </div>
        <Share2 className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Project Content */}
      <div className="mb-4 pb-4 border-b border-border">
        <h3 className="font-semibold mb-1 text-sm">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>

        <div className="flex gap-2 flex-wrap mb-3">
          <Badge variant="secondary" className="text-xs">
            {project.category}
          </Badge>
          {project.budget && (
            <Badge variant="secondary" className="text-xs">
              ${project.budget.toLocaleString()}
            </Badge>
          )}
        </div>

        {project.skills.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {project.skills.slice(0, 2).map((skill) => (
              <Badge key={skill} className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.skills.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{project.skills.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <Button className="w-full mb-4" onClick={handleShare}>
        Copy Share Link
      </Button>

      {/* Engagement Metrics */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
        <div className="flex gap-4">
          <button onClick={handleLike} className="flex items-center gap-1 hover:text-foreground">
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            {likes}
          </button>
          <button className="flex items-center gap-1 hover:text-foreground">
            <MessageCircle className="h-4 w-4" />3
          </button>
        </div>
        <button className="flex items-center gap-1 hover:text-foreground">
          <Share className="h-4 w-4" />
          Share
        </button>
      </div>
    </Card>
  );
}
