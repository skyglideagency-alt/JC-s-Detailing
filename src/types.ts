export interface LeadVehicle {
  year?: string;
  make: string;
  model: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  carType?: string;
  vehicle?: LeadVehicle;
  service: string;
  description?: string;
  status: "new" | "contacted" | "archived";
  createdAt: string;
}

export interface DetailingTreatment {
  name: string;
  reason: string;
  time: string;
}

export interface DetailingReport {
  carAnalysis: string;
  conditionScore: number;
  treatments: DetailingTreatment[];
  recommendedPackage: string;
  estimatedPriceRange: string;
  proTips: string[];
}

export interface AdvisorRequest {
  year?: string;
  make: string;
  model: string;
  service?: string;
  paintCondition?: string;
  interiorCondition?: string;
  description?: string;
}
