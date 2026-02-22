import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fenaCalculator: CalculatorDefinition = {
  slug: "fena-calculator",
  title: "Fractional Excretion of Sodium (FENa) Calculator",
  description: "Free FENa calculator. Differentiate pre-renal from intrinsic renal causes of acute kidney injury using urine and serum sodium and creatinine.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["fena calculator", "fractional excretion sodium", "prerenal azotemia", "acute kidney injury", "renal failure workup", "nephrology calculator"],
  variants: [
    {
      id: "fena",
      name: "FENa Calculation",
      fields: [
        { name: "serumNa", label: "Serum Sodium (mEq/L)", type: "number", placeholder: "e.g. 140", min: 100, max: 180, step: 0.1 },
        { name: "serumCr", label: "Serum Creatinine (mg/dL)", type: "number", placeholder: "e.g. 1.0", min: 0.1, max: 30, step: 0.01 },
        { name: "urineNa", label: "Urine Sodium (mEq/L)", type: "number", placeholder: "e.g. 40", min: 0, max: 300, step: 0.1 },
        { name: "urineCr", label: "Urine Creatinine (mg/dL)", type: "number", placeholder: "e.g. 100", min: 1, max: 500, step: 0.1 },
      ],
      calculate: (inputs) => {
        const sNa = inputs.serumNa as number;
        const sCr = inputs.serumCr as number;
        const uNa = inputs.urineNa as number;
        const uCr = inputs.urineCr as number;
        if (!sNa || !sCr || !uNa || !uCr) return null;
        const fena = ((uNa * sCr) / (sNa * uCr)) * 100;
        let interpretation = "";
        let etiology = "";
        if (fena < 1) { interpretation = "Pre-renal azotemia"; etiology = "Dehydration, heart failure, hepatorenal syndrome, sepsis (early)"; }
        else if (fena <= 2) { interpretation = "Indeterminate"; etiology = "Could be pre-renal or intrinsic; correlate clinically"; }
        else { interpretation = "Intrinsic renal disease"; etiology = "Acute tubular necrosis, interstitial nephritis, glomerulonephritis"; }
        return {
          primary: { label: "FENa", value: formatNumber(fena, 2) + "%" },
          details: [
            { label: "FENa", value: formatNumber(fena, 2) + "%" },
            { label: "Interpretation", value: interpretation },
            { label: "Likely Etiology", value: etiology },
            { label: "Serum Na", value: formatNumber(sNa, 1) + " mEq/L" },
            { label: "Serum Cr", value: formatNumber(sCr, 2) + " mg/dL" },
            { label: "Urine Na", value: formatNumber(uNa, 1) + " mEq/L" },
            { label: "Urine Cr", value: formatNumber(uCr, 1) + " mg/dL" },
          ],
          note: "FENa < 1% suggests pre-renal cause. FENa > 2% suggests intrinsic renal cause. FENa is unreliable with diuretic use, contrast dye, or chronic kidney disease. Consider FEUrea in those cases.",
        };
      },
    },
  ],
  relatedSlugs: ["bun-creatinine", "egfr-calculator", "creatinine-clearance-cg"],
  faq: [
    { question: "What is FENa?", answer: "FENa (Fractional Excretion of Sodium) measures the percentage of filtered sodium excreted in urine. It helps differentiate pre-renal from intrinsic causes of AKI." },
    { question: "What FENa indicates pre-renal failure?", answer: "FENa < 1% suggests pre-renal azotemia (kidneys are avidly retaining sodium). FENa > 2% suggests intrinsic renal damage (tubules cannot reabsorb sodium)." },
    { question: "When is FENa unreliable?", answer: "FENa is unreliable with diuretic use, contrast exposure, CKD, or in early obstruction. Use FEUrea instead in patients on diuretics." },
  ],
  formula: "FENa = (Urine Na x Serum Cr) / (Serum Na x Urine Cr) x 100",
};
