import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const parklandFormulaCalculator: CalculatorDefinition = {
  slug: "parkland-formula",
  title: "Parkland Formula Calculator",
  description: "Free Parkland formula calculator for burn fluid resuscitation. Calculate IV fluid requirements for burn patients in the first 24 hours using body weight and TBSA.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["parkland formula", "burn fluid resuscitation", "burn calculator", "tbsa calculator", "iv fluids burns", "burn treatment"],
  variants: [
    {
      id: "parkland",
      name: "Parkland Formula",
      fields: [
        { name: "weight", label: "Body Weight (kg)", type: "number", placeholder: "e.g. 70", min: 1, max: 300, step: 0.1 },
        { name: "tbsa", label: "Total Body Surface Area Burned (%)", type: "number", placeholder: "e.g. 30", min: 1, max: 100, step: 0.1 },
      ],
      calculate: (inputs) => {
        const wt = inputs.weight as number;
        const tbsa = inputs.tbsa as number;
        if (!wt || !tbsa) return null;
        const totalFluid24 = 4 * wt * tbsa;
        const first8hr = totalFluid24 / 2;
        const next16hr = totalFluid24 / 2;
        const rateFirst8 = first8hr / 8;
        const rateNext16 = next16hr / 16;
        return {
          primary: { label: "Total 24hr Fluid", value: formatNumber(totalFluid24, 0) + " mL" },
          details: [
            { label: "Total 24-Hour Fluid", value: formatNumber(totalFluid24, 0) + " mL LR" },
            { label: "First 8 Hours", value: formatNumber(first8hr, 0) + " mL (50%)" },
            { label: "Rate First 8 Hours", value: formatNumber(rateFirst8, 0) + " mL/hr" },
            { label: "Next 16 Hours", value: formatNumber(next16hr, 0) + " mL (50%)" },
            { label: "Rate Next 16 Hours", value: formatNumber(rateNext16, 0) + " mL/hr" },
            { label: "Body Weight", value: formatNumber(wt, 1) + " kg" },
            { label: "TBSA Burned", value: formatNumber(tbsa, 1) + "%" },
          ],
          note: "Parkland formula: 4 mL x weight (kg) x %TBSA burned. Give 50% in first 8 hours from time of burn (not arrival), remaining 50% over next 16 hours. Use Lactated Ringer solution. Titrate to urine output 0.5-1 mL/kg/hr in adults.",
        };
      },
    },
  ],
  relatedSlugs: ["fluid-maintenance", "revised-trauma", "apache-score"],
  faq: [
    { question: "What is the Parkland formula?", answer: "The Parkland (Baxter) formula estimates crystalloid fluid needs in the first 24 hours for burn patients: Total fluid = 4 mL x body weight (kg) x %TBSA burned." },
    { question: "How is fluid distributed over 24 hours?", answer: "Give 50% of calculated volume in the first 8 hours (from time of burn injury) and the remaining 50% over the next 16 hours." },
    { question: "What fluid type is used?", answer: "Lactated Ringer (LR) solution is the standard crystalloid. Titrate rate to maintain urine output of 0.5-1 mL/kg/hr in adults, 1 mL/kg/hr in children." },
  ],
  formula: "Parkland: Total Fluid (mL) = 4 x Weight (kg) x %TBSA | 50% in first 8 hrs, 50% in next 16 hrs",
};
