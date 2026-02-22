import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bunCreatinineCalculator: CalculatorDefinition = {
  slug: "bun-creatinine",
  title: "BUN/Creatinine Ratio Calculator",
  description: "Free BUN/Creatinine ratio calculator. Evaluate renal function and differentiate pre-renal, intrinsic, and post-renal causes of kidney injury.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bun creatinine ratio", "bun to creatinine", "renal function calculator", "kidney function ratio", "azotemia calculator"],
  variants: [
    {
      id: "bun-cr-ratio",
      name: "BUN/Creatinine Ratio",
      fields: [
        { name: "bun", label: "BUN (mg/dL)", type: "number", placeholder: "e.g. 15", min: 1, max: 200, step: 0.1 },
        { name: "creatinine", label: "Creatinine (mg/dL)", type: "number", placeholder: "e.g. 1.0", min: 0.1, max: 30, step: 0.01 },
      ],
      calculate: (inputs) => {
        const bun = inputs.bun as number;
        const cr = inputs.creatinine as number;
        if (!bun || !cr) return null;
        const ratio = bun / cr;
        let interpretation = "";
        let causes = "";
        if (ratio > 20) { interpretation = "Elevated ratio - suggests pre-renal azotemia"; causes = "Dehydration, heart failure, GI bleeding, high protein diet, catabolic states"; }
        else if (ratio < 10) { interpretation = "Low ratio - consider intrinsic renal or other causes"; causes = "Acute tubular necrosis, low protein intake, severe liver disease, rhabdomyolysis"; }
        else { interpretation = "Normal ratio"; causes = "Normal renal function or proportional elevation in intrinsic renal disease"; }
        const bunStatus = bun < 7 ? "Below normal" : bun <= 20 ? "Normal" : "Elevated";
        const crStatus = cr < 0.6 ? "Below normal" : cr <= 1.2 ? "Normal" : "Elevated";
        return {
          primary: { label: "BUN/Creatinine Ratio", value: formatNumber(ratio, 1) },
          details: [
            { label: "BUN/Cr Ratio", value: formatNumber(ratio, 1) + ":1" },
            { label: "Interpretation", value: interpretation },
            { label: "Possible Causes", value: causes },
            { label: "BUN", value: formatNumber(bun, 1) + " mg/dL (" + bunStatus + ")" },
            { label: "Creatinine", value: formatNumber(cr, 2) + " mg/dL (" + crStatus + ")" },
            { label: "Normal Ratio Range", value: "10:1 to 20:1" },
          ],
          note: "Normal BUN/Cr ratio is 10:1 to 20:1. Elevated ratios (>20:1) suggest pre-renal causes. Low ratios (<10:1) may indicate intrinsic renal damage.",
        };
      },
    },
  ],
  relatedSlugs: ["egfr-calculator", "creatinine-clearance-cg", "fena-calculator"],
  faq: [
    { question: "What is a normal BUN/Creatinine ratio?", answer: "Normal is 10:1 to 20:1. Adult normal BUN is 7-20 mg/dL and creatinine is 0.6-1.2 mg/dL." },
    { question: "What does a high BUN/Creatinine ratio mean?", answer: "A ratio above 20:1 often indicates pre-renal azotemia from dehydration, heart failure, or GI bleeding." },
    { question: "What does a low ratio mean?", answer: "A ratio below 10:1 may indicate intrinsic kidney damage, liver disease, or malnutrition." },
  ],
  formula: "BUN/Creatinine Ratio = BUN (mg/dL) / Creatinine (mg/dL) | Normal: 10:1 to 20:1",
};
