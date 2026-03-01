import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carWashStartupCalculator: CalculatorDefinition = {
  slug: "car-wash-startup-calculator",
  title: "Car Wash Startup Cost Calculator",
  description: "Estimate the cost to start a car wash business including equipment, construction, and initial operating expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car wash startup cost", "car wash business cost", "car wash investment"],
  variants: [{
    id: "standard",
    name: "Car Wash Startup Cost",
    description: "Estimate the cost to start a car wash business including equipment, construction, and initial operating expenses",
    fields: [
      { name: "type", label: "Car Wash Type", type: "select", options: [{value:"self",label:"Self-Service Bay"},{value:"auto",label:"Automatic Tunnel"},{value:"hand",label:"Hand Wash"}], defaultValue: "self" },
      { name: "bays", label: "Number of Bays or Lanes", type: "number", suffix: "bays", min: 1, max: 10, defaultValue: 4 },
      { name: "land", label: "Land and Construction", type: "select", options: [{value:"lease",label:"Lease Existing"},{value:"build",label:"Build New"},{value:"convert",label:"Convert Existing"}], defaultValue: "lease" },
    ],
    calculate: (inputs) => {
      const type = inputs.type as string;
      const bays = inputs.bays as number;
      const land = inputs.land as string;
      if (!bays || bays <= 0) return null;
      const equipRates: Record<string, number> = { self: 15000, auto: 100000, hand: 5000 };
      const landCosts: Record<string, number> = { lease: 50000, build: 300000, convert: 100000 };
      const equipment = bays * (equipRates[type] || 15000);
      const landCost = landCosts[land] || 50000;
      const plumbing = bays * 8000;
      const permits = 5000;
      const signage = 10000;
      const workingCapital = 20000;
      const total = equipment + landCost + plumbing + permits + signage + workingCapital;
      return {
        primary: { label: "Estimated Startup Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Equipment (" + bays + " bays)", value: "$" + formatNumber(equipment) },
          { label: "Land and Construction", value: "$" + formatNumber(landCost) },
          { label: "Plumbing and Water", value: "$" + formatNumber(plumbing) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Signage and Marketing", value: "$" + formatNumber(signage) },
          { label: "Working Capital", value: "$" + formatNumber(workingCapital) },
        ],
      };
    },
  }],
  relatedSlugs: ["laundromat-startup-calculator", "mobile-detailing-calculator"],
  faq: [
    { question: "How much does it cost to start a car wash?", answer: "A self-service car wash costs $50,000 to $200,000 to start. An automatic tunnel car wash can cost $500,000 to $2 million or more." },
    { question: "Is a car wash a good investment?", answer: "Car washes can be profitable with typical profit margins of 30 to 50 percent once established. Location and traffic volume are the most important factors." },
  ],
  formula: "Total = Equipment + Land + Plumbing + Permits + Signage + Working Capital",
};
