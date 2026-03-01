import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const painAndSufferingMultiplierCalculator: CalculatorDefinition = {
  slug: "pain-and-suffering-multiplier-calculator",
  title: "Pain and Suffering Multiplier Calculator",
  description: "Estimate pain and suffering damages using the multiplier method.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pain and suffering multiplier", "general damages calculator", "non-economic damages"],
  variants: [{
    id: "standard",
    name: "Pain and Suffering Multiplier",
    description: "Estimate pain and suffering damages using the multiplier method",
    fields: [
      { name: "medicalBills", label: "Total Medical Bills", type: "number", prefix: "$", min: 0, max: 5000000, defaultValue: 25000 },
      { name: "severity", label: "Injury Severity", type: "select", options: [{value:"1.5",label:"Minor (1.5x)"},{value:"3",label:"Moderate (3x)"},{value:"5",label:"Severe (5x)"},{value:"7",label:"Very Severe (7x)"}], defaultValue: "3" },
      { name: "lostWages", label: "Lost Wages", type: "number", prefix: "$", min: 0, max: 2000000, defaultValue: 10000 },
    ],
    calculate: (inputs) => {
      const medical = inputs.medicalBills as number;
      const mult = parseFloat(inputs.severity as string) || 3;
      const wages = inputs.lostWages as number;
      if (!medical || medical <= 0) return null;
      const painSuffering = medical * mult;
      const totalDamages = medical + wages + painSuffering;
      const perDiem = painSuffering / 365;
      return {
        primary: { label: "Pain and Suffering Value", value: "$" + formatNumber(Math.round(painSuffering)) },
        details: [
          { label: "Multiplier", value: mult + "x medical bills" },
          { label: "Total Claim Value", value: "$" + formatNumber(Math.round(totalDamages)) },
          { label: "Per Diem Equivalent", value: "$" + formatNumber(Math.round(perDiem)) + "/day" },
        ],
      };
    },
  }],
  relatedSlugs: ["whiplash-settlement-calculator", "truck-accident-settlement-calculator"],
  faq: [
    { question: "What is the pain and suffering multiplier method?", answer: "The multiplier method calculates non-economic damages by multiplying total medical bills by a factor of 1.5 to 7 based on injury severity." },
    { question: "What multiplier do insurance companies use?", answer: "Insurance companies typically start with a 1.5 to 3x multiplier for minor injuries and may go higher for severe or permanent injuries." },
  ],
  formula: "Pain and Suffering = Medical Bills x Severity Multiplier (1.5 to 7)",
};
