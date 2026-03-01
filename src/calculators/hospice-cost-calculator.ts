import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hospiceCostCalculator: CalculatorDefinition = {
  slug: "hospice-cost-calculator",
  title: "Hospice Cost Calculator",
  description: "Estimate end-of-life hospice care costs based on care setting, duration, and service level.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hospice cost", "end of life care cost", "hospice care calculator"],
  variants: [{
    id: "standard",
    name: "Hospice Cost",
    description: "Estimate end-of-life hospice care costs based on care setting, duration, and service level",
    fields: [
      { name: "careSetting", label: "Care Setting", type: "select", options: [{value:"home",label:"Home Hospice"},{value:"facility",label:"Inpatient Hospice Facility"},{value:"nursing",label:"Nursing Home with Hospice"}], defaultValue: "home" },
      { name: "serviceLevel", label: "Service Level", type: "select", options: [{value:"routine",label:"Routine Home Care"},{value:"continuous",label:"Continuous Home Care"},{value:"respite",label:"Respite Care"},{value:"inpatient",label:"General Inpatient Care"}], defaultValue: "routine" },
      { name: "days", label: "Expected Duration", type: "number", suffix: "days", min: 1, max: 365, defaultValue: 90 },
    ],
    calculate: (inputs) => {
      const setting = inputs.careSetting as string;
      const level = inputs.serviceLevel as string;
      const days = inputs.days as number;
      if (!days || days <= 0) return null;
      const settingCosts: Record<string, number> = { home: 200, facility: 750, nursing: 500 };
      const levelMod: Record<string, number> = { routine: 1.0, continuous: 4.5, respite: 1.8, inpatient: 3.5 };
      const dailyCost = (settingCosts[setting] || 200) * (levelMod[level] || 1.0);
      const totalCost = dailyCost * days;
      const monthlyCost = dailyCost * 30;
      const medicareCoverage = setting === "home" ? "Typically covered under Medicare Hospice Benefit" : "May be partially covered";
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost)) },
          { label: "Monthly Equivalent", value: "$" + formatNumber(Math.round(monthlyCost)) },
          { label: "Medicare Coverage", value: medicareCoverage },
        ],
      };
    },
  }],
  relatedSlugs: ["nursing-home-cost-calculator", "memory-care-cost-calculator"],
  faq: [
    { question: "Does Medicare cover hospice care?", answer: "Yes, Medicare Part A covers hospice care for terminally ill patients with a life expectancy of six months or less. It covers nursing care, medications for symptom control, medical equipment, and counseling." },
    { question: "What services does hospice provide?", answer: "Hospice provides pain management, symptom control, nursing visits, medical equipment, medications related to the terminal illness, counseling, and support for both the patient and family members." },
  ],
  formula: "Total Cost = Daily Rate x Service Level Modifier x Number of Days",
};
