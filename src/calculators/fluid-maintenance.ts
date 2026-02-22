import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fluidMaintenanceCalculator: CalculatorDefinition = {
  slug: "fluid-maintenance",
  title: "Maintenance Fluid Calculator (4-2-1 Rule)",
  description: "Free maintenance IV fluid calculator using the Holliday-Segar (4-2-1) method for pediatric and adult patients.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["maintenance fluid calculator", "4-2-1 rule", "iv fluid rate", "holliday segar", "pediatric fluids"],
  variants: [
    {
      id: "four-two-one",
      name: "4-2-1 Rule (Holliday-Segar)",
      fields: [
        { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70", min: 1, max: 300, step: 0.1 },
      ],
      calculate: (inputs) => {
        const wt = inputs.weight as number;
        if (!wt) return null;
        let hourlyRate = 0;
        if (wt <= 10) hourlyRate = wt * 4;
        else if (wt <= 20) hourlyRate = 40 + (wt - 10) * 2;
        else hourlyRate = 60 + (wt - 20) * 1;
        const dailyVolume = hourlyRate * 24;
        const first10 = Math.min(wt, 10) * 4;
        const next10 = Math.min(Math.max(wt - 10, 0), 10) * 2;
        const remaining = Math.max(wt - 20, 0) * 1;
        return {
          primary: { label: "Hourly Rate", value: formatNumber(hourlyRate, 0) + " mL/hr" },
          details: [
            { label: "Hourly Rate", value: formatNumber(hourlyRate, 0) + " mL/hr" },
            { label: "Daily Volume", value: formatNumber(dailyVolume, 0) + " mL/day" },
            { label: "First 10 kg", value: formatNumber(first10, 0) + " mL/hr (4 mL/kg/hr)" },
            { label: "Next 10 kg", value: formatNumber(next10, 0) + " mL/hr (2 mL/kg/hr)" },
            { label: "Each kg > 20", value: formatNumber(remaining, 0) + " mL/hr (1 mL/kg/hr)" },
            { label: "Patient Weight", value: formatNumber(wt, 1) + " kg" },
          ],
          note: "4-2-1 rule: 4 mL/kg/hr for first 10 kg, 2 mL/kg/hr for next 10 kg, 1 mL/kg/hr for each kg above 20. Adjust for fever, burns, or fluid-restricted states.",
        };
      },
    },
  ],
  relatedSlugs: ["parkland-formula", "harris-benedict", "bun-creatinine"],
  faq: [
    { question: "What is the 4-2-1 rule?", answer: "The 4-2-1 rule calculates hourly maintenance fluids: 4 mL/kg/hr for the first 10 kg, 2 mL/kg/hr for the next 10 kg, 1 mL/kg/hr for each kg above 20." },
    { question: "What fluid type is used?", answer: "Common choices include D5 0.45% NS for adults and D5 0.2-0.45% NS for pediatrics with KCl. Individualize based on labs and condition." },
    { question: "When should fluids be adjusted?", answer: "Adjust for fever (+10% per degree C above 37), burns, surgical losses, renal failure, and heart failure." },
  ],
  formula: "First 10 kg: 4 mL/kg/hr | Next 10 kg: 2 mL/kg/hr | Each kg > 20: 1 mL/kg/hr",
};
