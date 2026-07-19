import React, { useState } from "react";
import CommonServiceMainContent from "./CommonServiceMainContent";
import ServiceContent from "../../services/ServiceManage";
import { SearchInput } from "@/src/components/form/search-input";
import PageHeader from "@/src/components/ui/PageHeader";
import { Button } from "@/src/components/ui/button";
import CommonServiceSidebar from "./components/CommonServiceSidebar";
import { projectData, serviceData } from "./data";
export type CommonServiceLayoutProps = {
  sidebarData: any;
  role: string;
  serviceName: string;
  mainContentData: any;
  isSidebarOpen: boolean;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
};
type Props = {
  serviceName: string;
  selectedForm: string;
};

const CommonServiceLayout = ({ serviceName, selectedForm }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  let mainContentData;
  const role = "agency";
  if (role === "agency") {
    mainContentData = serviceData;
  } else {
    mainContentData = projectData;
  }
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-6">
        {/* header */}
        <div className="flex mb-5 justify-between items-center gap-2">
          <PageHeader
            title="Gallery"
            subtitle={undefined}
            right={
              <SearchInput
                value={query}
                onChange={(v) => {
                  setQuery(v);
                  setPage(1);
                }}
                placeholder="Search media..."
              />
            }
          />

          {role === "agency" ? (
            <Button>Add New Service</Button>
          ) : (
            <ServiceContent selectedForm={selectedForm} />
          )}
        </div>
      </div>

      {/* body */}
      <div className="flex gap-2 ">
        {/* sidebar */}
        <CommonServiceSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        {/* main content */}
        <CommonServiceMainContent
          role={role}
          mainContentData={mainContentData}
          isSidebarOpen={isSidebarOpen}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>
    </div>
  );
};

export default CommonServiceLayout;
