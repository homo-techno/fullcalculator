import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const noiseOrdinanceCalculator: CalculatorDefinition = {
  slug: "noise-ordinance-calculator",
  title: "Noise Ordinance Calculator",
  description: "Check if your planned noise level complies with typical residential noise ordinance limits.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["noise ordinance", "noise level calculator", "noise compliance checker"],
  variants: [{
    id: "standard",
    name: "Noise Ordinance",
    description: "Check if your planned noise level complies with typical residential noise ordinance limits",
    fields: [
      { name: "noiseLevel", label: "Expected Noise Level", type: "number", suffix: "dB", min: 30, max: 130, defaultValue: 70 },
      { name: "timeOfDay", label: "Time of Day", type: "select", options: [{value:"day",label:"Daytime (7 AM - 10 PM)"},{value:"night",label:"Nighttime (10 PM - 7 AM)"}], defaultValue: "day" },
      { name: "zoneType", label: "Zone Type", type: "select", options: [{value:"residential",label:"Residential"},{value:"commercial",label:"Commercial"},{value:"mixed",label:"Mixed Use"}], defaultValue: "residential" },
    ],
    calculate: (inputs) => {
      const noise = inputs.noiseLevel as number;
      const time = inputs.timeOfDay as string;
      const zone = inputs.zoneType as string;
      if (!noise || noise <= 0) return null;
      const dayLimits: Record<string, number> = { residential: 65, commercial: 75, mixed: 70 };
      const nightLimits: Record<string, number> = { residential: 55, commercial: 65, mixed: 60 };
      const limit = time === "day" ? (dayLimits[zone] || 65) : (nightLimits[zone] || 55);
      const isCompliant = noise <= limit;
      const overBy = Math.max(0, noise - limit);
      const comparison = noise <= 50 ? "Quiet conversation level" : noise <= 65 ? "Normal conversation level" : noise <= 80 ? "Vacuum cleaner level" : noise <= 100 ? "Power tool level" : "Dangerously loud";
      return {
        primary: { label: "Compliance Status", value: isCompliant ? "Compliant" : "Exceeds Limit by " + formatNumber(overBy) + " dB" },
        details: [
          { label: "Your Noise Level", value: formatNumber(noise) + " dB" },
          { label: "Ordinance Limit", value: formatNumber(limit) + " dB" },
          { label: "Noise Comparison", value: comparison },
        ],
      };
    },
  }],
  relatedSlugs: ["radon-mitigation-calculator", "mold-remediation-calculator"],
  faq: [
    { question: "What are typical noise ordinance limits?", answer: "Most residential areas limit noise to 55 to 65 dB during the day and 45 to 55 dB at night. Commercial zones typically allow 10 dB higher than residential limits." },
    { question: "What activities commonly violate noise ordinances?", answer: "Loud music, power tools, barking dogs, construction, and vehicle modifications are the most common noise ordinance violations in residential areas." },
  ],
  formula: "Compliance = Noise Level <= Zone Limit for Time of Day",
};
