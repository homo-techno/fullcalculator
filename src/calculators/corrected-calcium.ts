import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const correctedCalciumCalculator: CalculatorDefinition = {
  slug: "corrected-calcium-calculator",
  title: "Corrected Calcium Calculator",
  description:
    "Free corrected calcium calculator. Adjust measured calcium levels for albumin to determine true calcium status.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["corrected calcium", "albumin", "calcium adjustment", "hypocalcemia"],
  variants: [
    {
      id: "correctedCa",
      name: "Albumin-Corrected Calcium",
      fields: [
        {
          name: "measuredCa",
          label: "Measured Calcium (mg/dL)",
          type: "number",
          placeholder: "e.g. 8.5",
        },
        {
          name: "albumin",
          label: "Albumin (g/dL)",
          type: "number",
          placeholder: "e.g. 3.0",
        },
      ],
      calculate: (inputs) => {
        const measuredCa = inputs.measuredCa as number;
        const albumin = inputs.albumin as number;
        if (!measuredCa || !albumin) return null;

        const correctedCa = measuredCa + 0.8 * (4.0 - albumin);

        let interpretation: string;
        if (correctedCa < 8.5) {
          interpretation = "Hypocalcemia (low calcium)";
        } else if (correctedCa <= 10.5) {
          interpretation = "Normal (8.5\u201310.5 mg/dL)";
        } else {
          interpretation = "Hypercalcemia (high calcium)";
        }

        return {
          primary: {
            label: "Corrected Calcium",
            value: `${formatNumber(correctedCa, 1)} mg/dL`,
          },
          details: [
            { label: "Interpretation", value: interpretation },
            { label: "Measured Calcium", value: `${formatNumber(measuredCa, 1)} mg/dL` },
            { label: "Albumin", value: `${formatNumber(albumin, 1)} g/dL` },
            { label: "Correction Applied", value: `+${formatNumber(0.8 * (4.0 - albumin), 1)} mg/dL` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["anion-gap-calculator", "sodium-correction-calculator"],
  faq: [
    {
      question: "Why do we correct calcium for albumin?",
      answer:
        "About 40% of calcium in the blood is bound to albumin. When albumin is low, total calcium appears low even if the physiologically active (ionized) calcium is normal. The correction adjusts for this.",
    },
    {
      question: "What is the corrected calcium formula?",
      answer:
        "Corrected Calcium = Measured Calcium + 0.8 \u00D7 (4.0 \u2212 Albumin). This adds 0.8 mg/dL of calcium for every 1 g/dL that albumin is below 4.0.",
    },
  ],
  formula:
    "Corrected Ca = Measured Ca + 0.8 \u00D7 (4.0 \u2212 Albumin). Normal range: 8.5\u201310.5 mg/dL.",
};
