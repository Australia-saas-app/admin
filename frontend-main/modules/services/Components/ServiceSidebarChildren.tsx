import React from "react";
import { Play, StepBack, StepForward } from "lucide-react";
import ServiceFilter from "./ServiceFilter";

interface ServiceSidebarChildrenProps {
  isOpen: boolean;
  onToggle?: () => void;
}

const ServiceSidebarChildren: React.FC<ServiceSidebarChildrenProps> = ({ isOpen, onToggle }) => {
  return (
    <aside
      className={`${isOpen ? "w-64" : "w-10"} relative transition-all duration-300 ease-in-out flex`}
    >
      <div className="p-4">
        <button
          onClick={onToggle}
          className="text-sm px-2 py-1 bg-muted rounded flex items-center"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <Play className="absolute right-0 cursor-pointer top-4 rotate-180" />
          ) : (
            <Play className="absolute right-0 cursor-pointer top-4" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 pt-3 pb-20">
        {isOpen ? (
          <div>
            <ServiceFilter />
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default ServiceSidebarChildren;
