import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bunCreatinineRatioCalculator: CalculatorDefinition = {
  slug: "bun-creatinine-ratio",
  title: "BUN to Creatinine Ratio Calculator",
  description:
    "Free online BUN to creatinine ratio calculator with interpretation for kidney function and dehydration assessment.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "BUN",
    "creatinine",
    "ratio",
    "kidney",
    "renal function",
    "azotemia",
    "dehydration",
    "GFR",
    "nephrology",
  ],
  variants: [
    {
      id: "bun-cr-ratio",
      name: "BUN:Creatinine Ratio",
      description:
        "Calculate the BUN to creatinine ratio and estimate GFR.",
      fields: [
        {
          name: "bun",
          label: "Blood Urea Nitrogen (BUN)",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "mg/dL",
        },
        {
          name: "creatinine",
          label: "Serum Creatinine",
          type: "number",
          placeholder: "e.g. 1.0",
          suffix: "mg/dL",
        },
        {
          name: "age",
          label: "Age (for eGFR)",
          type: "number",
          placeholder: "e.g. 55",
          suffix: "years",
        },
        {
          name: "sex",
          label: "Sex (for eGFR)",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
      ],
      calculate: (inputs) => {
        const bun = parseFloat(inputs.bun as string) || 0;
        const creatinine = parseFloat(inputs.creatinine as string) || 0;
        const age = parseFloat(inputs.age as string) || 0;
        const sex = inputs.sex as string;

        if (bun <= 0 || creatinine <= 0) return null;

        const ratio = bun / creatinine;

        // Interpretation
        let ratioInterpretation: string;
        if (ratio < 10) {
          ratioInterpretation = "Low ratio - may suggest liver disease, malnutrition, or rhabdomyolysis";
        } else if (ratio <= 20) {
          ratioInterpretation = "Normal ratio (10:1 to 20:1)";
        } else if (ratio <= 30) {
          ratioInterpretation = "Mildly elevated - may suggest dehydration or high protein intake";
        } else {
          ratioInterpretation = "Elevated - likely prerenal azotemia (dehydration, heart failure, GI bleeding)";
        }

        // BUN assessment
        let bunAssessment: string;
        if (bun < 7) bunAssessment = "Low (malnutrition, liver disease, overhydration)";
        else if (bun <= 20) bunAssessment = "Normal (7-20 mg/dL)";
        else if (bun <= 40) bunAssessment = "Mildly elevated";
        else bunAssessment = "Significantly elevated";

        // Creatinine assessment
        let crAssessment: string;
        const crUpper = sex === "male" ? 1.2 : 1.1;
        if (creatinine <= crUpper) crAssessment = "Normal";
        else if (creatinine <= 2.0) crAssessment = "Mildly elevated";
        else if (creatinine <= 5.0) crAssessment = "Moderately elevated";
        else crAssessment = "Severely elevated";

        // eGFR (CKD-EPI 2021 simplified - without race)
        let egfr: number | null = null;
        let ckdStage = "";
        if (age > 0) {
          // Simplified CKD-EPI approximation
          let kappa: number;
          let alpha: number;
          let sexFactor: number;
          if (sex === "female") {
            kappa = 0.7;
            alpha = -0.241;
            sexFactor = 1.012;
          } else {
            kappa = 0.9;
            alpha = -0.302;
            sexFactor = 1.0;
          }
          const crKappa = creatinine / kappa;
          const minCrKappa = Math.min(crKappa, 1);
          const maxCrKappa = Math.max(crKappa, 1);
          egfr = 142 * Math.pow(minCrKappa, alpha) * Math.pow(maxCrKappa, -1.2) *
                 Math.pow(0.9938, age) * sexFactor;

          if (egfr >= 90) ckdStage = "G1 - Normal or high";
          else if (egfr >= 60) ckdStage = "G2 - Mildly decreased";
          else if (egfr >= 45) ckdStage = "G3a - Mildly to moderately decreased";
          else if (egfr >= 30) ckdStage = "G3b - Moderately to severely decreased";
          else if (egfr >= 15) ckdStage = "G4 - Severely decreased";
          else ckdStage = "G5 - Kidney failure";
        }

        const details = [
          { label: "Ratio Interpretation", value: ratioInterpretation },
          { label: "BUN", value: formatNumber(bun) + " mg/dL (" + bunAssessment + ")" },
          { label: "Creatinine", value: formatNumber(creatinine) + " mg/dL (" + crAssessment + ")" },
        ];

        if (egfr !== null) {
          details.push({ label: "Estimated GFR (CKD-EPI)", value: formatNumber(egfr) + " mL/min/1.73m²" });
          details.push({ label: "CKD Stage", value: ckdStage });
        }

        // Common causes by ratio
        let differentialDiagnosis: string;
        if (ratio > 20) {
          differentialDiagnosis = "Prerenal: dehydration, CHF, GI bleeding, high protein diet, corticosteroids, catabolic state";
        } else if (ratio < 10) {
          differentialDiagnosis = "Intrinsic renal: ATN, rhabdomyolysis, liver disease, malnutrition, SIADH, pregnancy";
        } else {
          differentialDiagnosis = "Normal ratio - no specific differential suggested";
        }
        details.push({ label: "Common Causes", value: differentialDiagnosis });

        return {
          primary: {
            label: "BUN:Creatinine Ratio",
            value: formatNumber(ratio),
            suffix: ":1",
          },
          details,
          note: "Normal BUN:Creatinine ratio is 10:1 to 20:1. Ratios > 20:1 suggest prerenal causes. Always interpret in clinical context with other lab values and patient presentation.",
        };
      },
    },
  ],
  relatedSlugs: ["body-surface-area", "cardiac-output", "map-blood-pressure"],
  faq: [
    {
      question: "What is the BUN to creatinine ratio?",
      answer:
        "The BUN to creatinine ratio compares blood urea nitrogen to serum creatinine. Both are markers of kidney function, but they respond differently to various conditions. A normal ratio is between 10:1 and 20:1.",
    },
    {
      question: "What does a high BUN to creatinine ratio mean?",
      answer:
        "A ratio above 20:1 suggests prerenal azotemia, where BUN rises disproportionately to creatinine. Common causes include dehydration, congestive heart failure, upper GI bleeding, high protein intake, and corticosteroid use. The kidneys retain more urea in low-flow states.",
    },
    {
      question: "What does a low BUN to creatinine ratio mean?",
      answer:
        "A ratio below 10:1 may indicate intrinsic renal disease (e.g., acute tubular necrosis), liver disease (reduced urea production), malnutrition, rhabdomyolysis (elevated creatinine from muscle breakdown), or SIADH (dilutional effect).",
    },
  ],
  formula:
    "BUN:Creatinine Ratio = BUN (mg/dL) / Creatinine (mg/dL). Normal: 10-20:1. eGFR (CKD-EPI 2021) = 142 × min(Cr/κ, 1)^α × max(Cr/κ, 1)^-1.2 × 0.9938^Age × Sex_factor.",
};
