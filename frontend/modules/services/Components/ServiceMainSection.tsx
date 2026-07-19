"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Project, SERVICE_CONFIGS, ServiceType, UserType } from "@/src/lib/service-types";
import { LayoutGrid, List } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { PublicDetailModal } from "@/src/modules/shared/components/public/PublicDetailModal";
import { PublicApplyModal } from "@/src/modules/shared/components/public/PublicApplyModal";
import { useRequireAuth } from "@/src/shared/hooks/use-require-auth";
import { usePermission } from "@/src/hooks/permission.hook";
import { ServiceGridView } from "./service-grid-view";
import { ServiceListView } from "./service-list-view";

// Demo data - replace with backend
const DEMO_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Full Stack Web Application Development",
    description:
      "Looking for experienced developers to build a scalable web application with React and Node.js",
    category: "Web Development",
    subcategory: "Full Stack",
    type: "One-time Project",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    budget: 5000,
    postedBy: "Tech Startup",
    status: "open",
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "2",
    title: "Mobile App Testing & QA",
    description: "Need comprehensive testing for iOS and Android applications",
    category: "QA & Testing",
    subcategory: "Automation",
    type: "Ongoing Work",
    skills: ["Selenium", "Test Automation", "iOS Testing"],
    budget: 2500,
    postedBy: "App Studio",
    status: "open",
    createdAt: new Date("2025-01-09"),
  },
  {
    id: "3",
    title: "React Frontend Redesign",
    description: "Modernize our existing React application with new UI/UX design",
    category: "Web Development",
    subcategory: "Frontend",
    type: "One-time Project",
    skills: ["React", "Tailwind CSS", "Design Implementation"],
    budget: 3000,
    postedBy: "E-commerce Company",
    status: "open",
    createdAt: new Date("2025-01-08"),
  },
];

const ServiceMainSection = ({ service }: { service: ServiceType | string }) => {
  // `service` may come from a route param (string). Guard against invalid keys.
  const serviceKey = String(service) as ServiceType;
  const serviceConfig = SERVICE_CONFIGS[serviceKey];

  const router = useRouter();
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const { isBusiness, isAffiliate } = usePermission();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    serviceConfig?.categories?.[0]?.id || ""
  );
  const [selectedType, setSelectedType] = useState<string>("");
  const [projects] = useState<Project[]>(DEMO_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const userType: UserType = !isAuthenticated
    ? "unauthorized"
    : isBusiness
      ? "business"
      : isAffiliate
        ? "affiliate"
        : "user";

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory) {
      const categoryName = serviceConfig?.categories?.find((c) => c.id === selectedCategory)?.name;
      if (categoryName && p.category !== categoryName) {
        return false;
      }
    }
    if (selectedType && p.type !== selectedType) {
      return false;
    }
    return true;
  });

  const handleCreateProject = useCallback(() => {
    if (isBusiness) {
      router.push("/business/technical/create");
      return;
    }
    router.push("/account/business/registration");
  }, [router, isBusiness]);

  const handleViewDetails = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId) ?? null;
      setSelectedProject(project);
    },
    [projects]
  );

  const handleShareProject = useCallback(
    async (projectId: string) => {
      const url = `${window.location.origin}/service/${serviceKey}?project=${projectId}`;
      try {
        if (navigator.share) {
          await navigator.share({ title: "Project listing", url });
        } else {
          await navigator.clipboard.writeText(url);
          toast.success("Project link copied to clipboard.");
        }
      } catch {
        toast.error("Could not share this project.");
      }
    },
    [serviceKey]
  );

  const handleApproveProject = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId) ?? null;
      setSelectedProject(project);
      requireAuth(() => setApplyOpen(true));
    },
    [projects, requireAuth]
  );

  if (!serviceConfig) {
    // Render a small helpful message rather than throwing — this prevents the whole component from failing to render.
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-semibold">Service not found</h2>
            <p className="text-sm text-muted-foreground mt-2">
              No configuration available for &quot;{serviceKey}&quot;. Check the route parameter or
              use one of: {Object.keys(SERVICE_CONFIGS).join(", ")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {serviceConfig.icon} {serviceConfig.name}
              </h1>
              <p className="text-muted-foreground mt-1">{serviceConfig.description}</p>
            </div>

            <div className="flex items-center gap-2">
              {!isAuthenticated && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/account/user/login">Sign in</Link>
                </Button>
              )}
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={handleCreateProject}
              >
                + Create Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} open projects
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <ServiceGridView
            projects={filteredProjects}
            userType={userType}
            onViewDetails={handleViewDetails}
            onCreateProject={handleCreateProject}
            onShareProject={handleShareProject}
            onApproveProject={handleApproveProject}
            showCreateCard={false}
          />
        ) : (
          <ServiceListView
            projects={filteredProjects}
            userType={userType}
            onViewDetails={handleViewDetails}
            onCreateProject={handleCreateProject}
            onShareProject={handleShareProject}
            onApproveProject={handleApproveProject}
          />
        )}
      </div>

      <PublicDetailModal
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title ?? "Project"}
        subtitle={selectedProject?.category}
        fields={
          selectedProject
            ? [
                { label: "Budget", value: `$${(selectedProject.budget ?? 0).toLocaleString()}` },
                { label: "Type", value: selectedProject.type },
                { label: "Posted by", value: selectedProject.postedBy },
                { label: "Status", value: selectedProject.status },
                { label: "Skills", value: selectedProject.skills.join(", ") },
                { label: "Description", value: selectedProject.description },
              ]
            : []
        }
        footer={
          selectedProject && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedProject(null)}>
                Close
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => handleApproveProject(selectedProject.id)}
              >
                Apply to project
              </Button>
            </div>
          )
        }
      />
      {selectedProject && (
        <PublicApplyModal
          open={applyOpen}
          onClose={() => setApplyOpen(false)}
          type="service"
          itemId={selectedProject.id}
          itemTitle={selectedProject.title}
          title="Apply to project"
          description="Submit your application for this service project."
        />
      )}
    </div>
  );
};

export default ServiceMainSection;
