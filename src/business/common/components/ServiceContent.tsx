import React from "react";
import {
  DialogBox,
  DialogClose,
  DialogContent,
} from "@/src/shared/ui/dialogbox/DialogBox";
import { X } from "lucide-react";
import { SERVICE_NAME, ServiceState } from "./types";         
import { cn } from "@/src/infra/lib/utils";


const ServiceContent = ({selectedForm}: {selectedForm: ServiceState["selectedServiceForm"]}) => {

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [serviceFormSize, setServiceFormSize] = React.useState<"sm" | "md" | "lg" | "xl">("md");

    const renderForm = (formType: ServiceState["selectedServiceForm"]) => {
      switch (formType) {
        case SERVICE_NAME.technical:
          return <p>Technical Form</p>;
        case SERVICE_NAME.construction:
          return <p>Construction Form</p>;
        case SERVICE_NAME.realEstate:
          return <p>Real Estate Form</p>;
        case SERVICE_NAME.importExport:
          return <p>Import & Export Form</p>;
        case SERVICE_NAME.visaTravel:
          return <p>Visa & Travel Form</p>;
        default:
            return <p>No form available</p>;
      }
    };
  
    const renderFormName = (formType: ServiceState["selectedServiceForm"]) => {
      switch (formType) {
        case SERVICE_NAME.technical:
          return "Technical";
        case SERVICE_NAME.construction:
          return "Construction";
        case SERVICE_NAME.realEstate:
          return "Real Estate";
        case SERVICE_NAME.importExport:
          return "Import & Export";
        case SERVICE_NAME.visaTravel:
          return "Visa & Travel";
        default:
          return "";
      }
    };
  
    const dialogSize = {
      sm: "max-w-md",
      md: "max-w-2xl",
      lg: "max-w-3xl",
      xl: "max-w-4xl",
    };
  
  return (
    <>
      <button
        onClick={() => {
          setIsModalOpen(true);
        }}
        className=" text-white rounded-md bg-common-color  px-3 py-[5px] font-semibold text-base tracking-widest text-primary"
      >
        Post Service
      </button>

      <DialogBox
        open={isModalOpen}
        onOpenChange={() => setIsModalOpen(!isModalOpen)}
      >
        <DialogContent className={cn(dialogSize[serviceFormSize], "mx-auto")}>
          <DialogClose className="absolute top-2 right-2">
            <X />
          </DialogClose>
          <div className="text-center text-2xl font-bold text-primary mb-10">
            {renderFormName(selectedForm)}
          </div>
          {renderForm(selectedForm)}
        </DialogContent>
      </DialogBox>
    </>
  );


};


export default ServiceContent;
