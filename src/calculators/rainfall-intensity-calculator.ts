import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rainfallIntensityCalculator: CalculatorDefinition = {
  slug: "rainfall-intensity-calculator",
  title: "Rainfall Intensity Calculator",
  description: "Calculate rainfall rate from total amount and duration.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rainfall","intensity","precipitation","rate"],
  variants: [{
    id: "standard",
    name: "Rainfall Intensity",
    description: "Calculate rainfall rate from total amount and duration.",
    fields: [
      { name: "totalRain", label: "Total Rainfall (inches)", type: "number", min: 0.01, max: 30, defaultValue: 1.5 },
      { name: "duration", label: "Duration (hours)", type: "number", min: 0.1, max: 72, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const totalRain = inputs.totalRain as number;
    const duration = inputs.duration as number;
    const ratePerHour = totalRain / duration;
    const rateMm = ratePerHour * 25.4;
    const category = ratePerHour >= 2 ? "Violent" : ratePerHour >= 0.3 ? "Heavy" : ratePerHour >= 0.1 ? "Moderate" : "Light";
    return {
      primary: { label: "Rainfall Rate", value: formatNumber(ratePerHour) + " in/hr" },
      details: [
        { label: "Rate in mm/hr", value: formatNumber(rateMm) + " mm/hr" },
        { label: "Intensity Category", value: category },
        { label: "Total Rainfall", value: formatNumber(totalRain) + " in" }
      ]
    };
  },
  }],
  relatedSlugs: ["dew-point-calculator","snow-load-calculator"],
  faq: [
    { question: "What is heavy rainfall?", answer: "Heavy rainfall is generally above 0.3 inches per hour." },
    { question: "How is rainfall measured?", answer: "Rainfall is measured in inches or millimeters of accumulated water." },
  ],
  formula: "Rate = Total Rainfall / Duration",
};
