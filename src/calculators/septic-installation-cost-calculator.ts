import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const septicInstallationCostCalculator: CalculatorDefinition = {
  slug: "septic-installation-cost-calculator",
  title: "Septic Installation Cost Calculator",
  description: "Estimate the cost of installing a new septic system based on system type, tank size, and soil conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["septic system cost", "septic installation cost", "septic tank installation estimate"],
  variants: [{
    id: "standard",
    name: "Septic Installation Cost",
    description: "Estimate the cost of installing a new septic system based on system type, tank size, and soil conditions",
    fields: [
      { name: "systemType", label: "System Type", type: "select", options: [{value:"conventional",label:"Conventional Gravity"},{value:"chamber",label:"Chamber System"},{value:"mound",label:"Mound System"},{value:"aerobic",label:"Aerobic Treatment"}], defaultValue: "conventional" },
      { name: "tankSize", label: "Tank Size", type: "select", options: [{value:"750",label:"750 gallon (1-2 bedrooms)"},{value:"1000",label:"1000 gallon (3 bedrooms)"},{value:"1250",label:"1250 gallon (4 bedrooms)"},{value:"1500",label:"1500 gallon (5+ bedrooms)"}], defaultValue: "1000" },
      { name: "soilCondition", label: "Soil Condition", type: "select", options: [{value:"ideal",label:"Sandy/Loamy (ideal)"},{value:"moderate",label:"Clay Mix (moderate)"},{value:"poor",label:"Heavy Clay or Rock (poor)"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const sType = inputs.systemType as string;
      const tankSize = parseInt(inputs.tankSize as string);
      const soil = inputs.soilCondition as string;
      const systemCosts: Record<string, number> = { conventional: 5000, chamber: 7000, mound: 12000, aerobic: 15000 };
      const tankCosts: Record<number, number> = { 750: 800, 1000: 1100, 1250: 1400, 1500: 1800 };
      const soilMod: Record<string, number> = { ideal: 1.0, moderate: 1.3, poor: 1.8 };
      const baseCost = (systemCosts[sType] || 5000) * (soilMod[soil] || 1.3);
      const tankCost = tankCosts[tankSize] || 1100;
      const permitCost = 750;
      const totalCost = baseCost + tankCost + permitCost;
      return {
        primary: { label: "Total Septic Installation Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "System and Drain Field", value: "$" + formatNumber(Math.round(baseCost)) },
          { label: "Tank Cost", value: "$" + formatNumber(Math.round(tankCost)) },
          { label: "Permits and Inspection", value: "$" + formatNumber(permitCost) },
        ],
      };
    },
  }],
  relatedSlugs: ["well-drilling-cost-calculator", "land-clearing-cost-calculator"],
  faq: [
    { question: "How much does a septic system cost to install?", answer: "A new septic system typically costs between $5,000 for a basic conventional system to over $20,000 for an aerobic treatment unit, depending on soil conditions and local requirements." },
    { question: "How long does a septic system last?", answer: "A well-maintained septic system can last 25 to 30 years. The tank itself may last even longer, while the drain field typically needs replacement after 20 to 25 years." },
  ],
  formula: "Total Cost = (System Base Cost x Soil Modifier) + Tank Cost + Permit Fees",
};
