import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homaIrCalculator: CalculatorDefinition = {
  slug: "homa-ir-calc",
  title: "HOMA-IR Insulin Resistance Calculator",
  description:
    "Free online HOMA-IR calculator to assess insulin resistance using fasting glucose and insulin levels.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "HOMA-IR",
    "insulin resistance",
    "diabetes",
    "fasting glucose",
    "fasting insulin",
    "metabolic syndrome",
    "prediabetes",
    "beta cell",
  ],
  variants: [
    {
      id: "homa-ir",
      name: "HOMA-IR Calculation",
      description:
        "Calculate HOMA-IR and HOMA-%B (beta-cell function) from fasting glucose and insulin.",
      fields: [
        {
          name: "glucoseUnit",
          label: "Glucose Unit",
          type: "select",
          options: [
            { label: "mg/dL", value: "mgdl" },
            { label: "mmol/L", value: "mmol" },
          ],
        },
        {
          name: "fastingGlucose",
          label: "Fasting Glucose",
          type: "number",
          placeholder: "e.g. 95",
        },
        {
          name: "insulinUnit",
          label: "Insulin Unit",
          type: "select",
          options: [
            { label: "μIU/mL (μU/mL)", value: "uiu" },
            { label: "pmol/L", value: "pmol" },
          ],
        },
        {
          name: "fastingInsulin",
          label: "Fasting Insulin",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        let glucose = parseFloat(inputs.fastingGlucose as string) || 0;
        let insulin = parseFloat(inputs.fastingInsulin as string) || 0;
        const glucoseUnit = inputs.glucoseUnit as string;
        const insulinUnit = inputs.insulinUnit as string;

        if (glucose <= 0 || insulin <= 0) return null;

        // Convert glucose to mmol/L if needed
        let glucoseMmol = glucose;
        if (glucoseUnit === "mgdl") {
          glucoseMmol = glucose / 18.016;
        }

        // Convert insulin to μIU/mL if needed
        let insulinUiu = insulin;
        if (insulinUnit === "pmol") {
          insulinUiu = insulin / 6.945;
        }

        // HOMA-IR = (Fasting Insulin μIU/mL × Fasting Glucose mmol/L) / 22.5
        const homaIr = (insulinUiu * glucoseMmol) / 22.5;

        // HOMA-%B = (20 × Fasting Insulin μIU/mL) / (Fasting Glucose mmol/L - 3.5)
        const denominator = glucoseMmol - 3.5;
        const homaBeta = denominator > 0 ? (20 * insulinUiu) / denominator : 0;

        // HOMA-%S (insulin sensitivity) = 1 / HOMA-IR × 100
        const homaS = homaIr > 0 ? (1 / homaIr) * 100 : 0;

        let irInterpretation: string;
        if (homaIr < 1.0) irInterpretation = "Optimal insulin sensitivity";
        else if (homaIr < 1.9) irInterpretation = "Normal (early insulin resistance unlikely)";
        else if (homaIr < 2.9) irInterpretation = "Possible early insulin resistance";
        else irInterpretation = "Significant insulin resistance";

        let betaCellFunction: string;
        if (homaBeta > 200) betaCellFunction = "Elevated (compensatory hyperinsulinemia)";
        else if (homaBeta >= 100) betaCellFunction = "Normal beta-cell function";
        else if (homaBeta >= 50) betaCellFunction = "Reduced beta-cell function";
        else betaCellFunction = "Significantly impaired beta-cell function";

        return {
          primary: {
            label: "HOMA-IR",
            value: formatNumber(homaIr),
          },
          details: [
            { label: "Interpretation", value: irInterpretation },
            {
              label: "HOMA-%B (Beta-Cell Function)",
              value: formatNumber(homaBeta) + "%",
            },
            { label: "Beta-Cell Assessment", value: betaCellFunction },
            {
              label: "HOMA-%S (Insulin Sensitivity)",
              value: formatNumber(homaS) + "%",
            },
            {
              label: "Fasting Glucose",
              value: formatNumber(glucoseMmol) + " mmol/L",
            },
            {
              label: "Fasting Insulin",
              value: formatNumber(insulinUiu) + " μIU/mL",
            },
          ],
          note: "HOMA-IR < 1.0 is optimal. Values > 2.9 suggest significant insulin resistance. This is a screening tool; consult your physician for diagnosis.",
        };
      },
    },
  ],
  relatedSlugs: ["a1c-calculator", "body-surface-area", "life-expectancy-calc"],
  faq: [
    {
      question: "What is HOMA-IR?",
      answer:
        "HOMA-IR (Homeostatic Model Assessment of Insulin Resistance) is a method to quantify insulin resistance and beta-cell function from fasting glucose and insulin levels. It was developed by Matthews et al. in 1985 and is widely used in research and clinical practice.",
    },
    {
      question: "What is a normal HOMA-IR value?",
      answer:
        "Optimal HOMA-IR is below 1.0. Values below 1.9 are generally considered normal. Values between 1.9 and 2.9 suggest early insulin resistance, and values above 2.9 indicate significant insulin resistance. However, reference ranges may vary by laboratory and population.",
    },
    {
      question: "What is HOMA-%B?",
      answer:
        "HOMA-%B estimates beta-cell function as a percentage. Normal values are around 100%. Values below 100% suggest declining beta-cell function, which may indicate progression toward type 2 diabetes. Values above 200% may suggest compensatory hyperinsulinemia in response to insulin resistance.",
    },
  ],
  formula:
    "HOMA-IR = (Fasting Insulin [μIU/mL] × Fasting Glucose [mmol/L]) / 22.5. HOMA-%B = (20 × Fasting Insulin) / (Fasting Glucose - 3.5). HOMA-%S = (1 / HOMA-IR) × 100.",
};
