import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const truckAccidentSettlementCalculator: CalculatorDefinition = {
  slug: "truck-accident-settlement-calculator",
  title: "Truck Accident Settlement Calculator",
  description: "Estimate a truck accident settlement based on medical bills, lost wages, and damages.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["truck accident settlement", "trucking accident compensation", "truck crash settlement"],
  variants: [{
    id: "standard",
    name: "Truck Accident Settlement",
    description: "Estimate a truck accident settlement based on medical bills, lost wages, and damages",
    fields: [
      { name: "medicalBills", label: "Total Medical Bills", type: "number", prefix: "$", min: 0, max: 5000000, defaultValue: 50000 },
      { name: "lostWages", label: "Lost Wages", type: "number", prefix: "$", min: 0, max: 2000000, defaultValue: 20000 },
      { name: "severity", label: "Injury Severity", type: "select", options: [{value:"minor",label:"Minor"},{value:"moderate",label:"Moderate"},{value:"severe",label:"Severe"},{value:"catastrophic",label:"Catastrophic"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const medical = inputs.medicalBills as number;
      const wages = inputs.lostWages as number;
      const severity = inputs.severity as string;
      if (!medical && !wages) return null;
      const multipliers: Record<string, number> = { minor: 1.5, moderate: 3, severe: 5, catastrophic: 8 };
      const mult = multipliers[severity] || 3;
      const painSuffering = medical * mult;
      const totalDamages = medical + wages + painSuffering;
      const attorneyFee = totalDamages * 0.33;
      const netSettlement = totalDamages - attorneyFee;
      return {
        primary: { label: "Estimated Settlement", value: "$" + formatNumber(Math.round(totalDamages)) },
        details: [
          { label: "Pain and Suffering", value: "$" + formatNumber(Math.round(painSuffering)) },
          { label: "Economic Damages", value: "$" + formatNumber(medical + wages) },
          { label: "Attorney Fee (33%)", value: "$" + formatNumber(Math.round(attorneyFee)) },
          { label: "Net to Client", value: "$" + formatNumber(Math.round(netSettlement)) },
        ],
      };
    },
  }],
  relatedSlugs: ["whiplash-settlement-calculator", "pain-and-suffering-multiplier-calculator"],
  faq: [
    { question: "How much is a truck accident settlement?", answer: "Truck accident settlements are often larger than car accidents, ranging from $50,000 for minor injuries to millions for catastrophic injuries." },
    { question: "What makes truck accident claims different?", answer: "Truck accidents involve federal regulations, multiple liable parties, and commercial insurance policies with higher limits." },
  ],
  formula: "Settlement = Medical Bills + Lost Wages + (Medical Bills x Severity Multiplier)",
};
