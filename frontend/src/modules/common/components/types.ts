export enum SERVICE_NAME {
  technical = "technical",
  construction = "construction",
  realEstate = "realEstate",
  importExport = "importExport",
  visaTravel = "visaTravel",
}

export type ServiceState = {
  selectedServiceForm: SERVICE_NAME;
};
