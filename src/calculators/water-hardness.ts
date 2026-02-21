import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterHardnessCalculator: CalculatorDefinition = {
  slug: "water-hardness-calculator",
  title: "Water Hardness Calculator",
  description: "Free water hardness calculator. Convert between ppm and gpg, classify your water hardness, and understand its effects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["water hardness calculator", "hard water calculator", "ppm to gpg", "water hardness test", "water softener calculator"],
  variants: [
    {
      id: "ppm",
      name: "From PPM (mg/L)",
      fields: [
        { name: "ppm", label: "Hardness", type: "number", placeholder: "e.g. 150", suffix: "ppm (mg/L)", step: 1 },
      ],
      calculate: (inputs) => {
        const ppm = inputs.ppm as number;
        if (ppm === undefined || ppm === null || ppm < 0) return null;

        const gpg = ppm / 17.1;

        let classification: string;
        let effects: string;
        if (ppm < 60) {
          classification = "Soft";
          effects = "No scale buildup. May feel slippery with soap. Good for most uses.";
        } else if (ppm < 120) {
          classification = "Moderately Hard";
          effects = "Minor scale buildup over time. Generally acceptable for household use.";
        } else if (ppm < 180) {
          classification = "Hard";
          effects = "Noticeable scale on fixtures, reduced soap lathering. Water softener recommended.";
        } else {
          classification = "Very Hard";
          effects = "Significant scale buildup, soap scum, reduced appliance lifespan. Water softener strongly recommended.";
        }

        // Estimated softener salt usage (lbs/month for a family of 4)
        const saltPerMonth = gpg > 3 ? Math.round(gpg * 1.5) : 0;

        return {
          primary: { label: "Water Hardness", value: classification },
          details: [
            { label: "Hardness (ppm / mg/L)", value: formatNumber(ppm, 0) },
            { label: "Hardness (gpg)", value: formatNumber(gpg, 1) },
            { label: "Hardness (mmol/L)", value: formatNumber(ppm / 100.09, 2) },
            { label: "Effects", value: effects },
            { label: "Est. Softener Salt (family of 4)", value: saltPerMonth > 0 ? `~${saltPerMonth} lbs/month` : "Not needed" },
          ],
          note: "1 gpg (grains per gallon) = 17.1 ppm (mg/L). Water hardness is primarily caused by dissolved calcium and magnesium.",
        };
      },
    },
    {
      id: "gpg",
      name: "From GPG (Grains per Gallon)",
      fields: [
        { name: "gpg", label: "Hardness", type: "number", placeholder: "e.g. 10", suffix: "gpg", step: 0.1 },
      ],
      calculate: (inputs) => {
        const gpg = inputs.gpg as number;
        if (gpg === undefined || gpg === null || gpg < 0) return null;

        const ppm = gpg * 17.1;

        let classification: string;
        if (ppm < 60) classification = "Soft";
        else if (ppm < 120) classification = "Moderately Hard";
        else if (ppm < 180) classification = "Hard";
        else classification = "Very Hard";

        return {
          primary: { label: "Water Hardness", value: classification },
          details: [
            { label: "Hardness (gpg)", value: formatNumber(gpg, 1) },
            { label: "Hardness (ppm / mg/L)", value: formatNumber(ppm, 0) },
            { label: "Hardness (mmol/L)", value: formatNumber(ppm / 100.09, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pool-salt-calculator", "soil-ph-calculator", "ph-calculator"],
  faq: [
    { question: "What is water hardness?", answer: "Water hardness measures the concentration of dissolved minerals, primarily calcium and magnesium. It's expressed in ppm (parts per million, same as mg/L) or gpg (grains per gallon). 1 gpg = 17.1 ppm." },
    { question: "What is considered hard water?", answer: "Soft: <60 ppm (<3.5 gpg). Moderately hard: 60–120 ppm (3.5–7.0 gpg). Hard: 120–180 ppm (7.0–10.5 gpg). Very hard: >180 ppm (>10.5 gpg)." },
    { question: "Do I need a water softener?", answer: "If your water is above 7 gpg (120 ppm), a softener can extend appliance life, reduce soap usage, and prevent scale. Below that level, it's generally optional." },
  ],
  formula: "1 gpg = 17.1 ppm | Soft < 60 ppm | Moderate 60–120 | Hard 120–180 | Very Hard > 180",
};
