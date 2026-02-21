import type { CalculatorDefinition } from "./types";

export const bloodPressureCalculator: CalculatorDefinition = {
  slug: "blood-pressure-calculator",
  title: "Blood Pressure Calculator",
  description: "Free blood pressure calculator. Check your blood pressure category based on AHA/ACC guidelines. Understand systolic and diastolic readings.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["blood pressure calculator", "blood pressure chart", "bp calculator", "blood pressure range", "is my blood pressure normal"],
  variants: [
    {
      id: "category",
      name: "Blood Pressure Category",
      fields: [
        { name: "systolic", label: "Systolic (top number)", type: "number", placeholder: "e.g. 120", min: 60, max: 250 },
        { name: "diastolic", label: "Diastolic (bottom number)", type: "number", placeholder: "e.g. 80", min: 40, max: 150 },
      ],
      calculate: (inputs) => {
        const sys = inputs.systolic as number;
        const dia = inputs.diastolic as number;
        if (!sys || !dia) return null;
        let category: string, risk: string;
        if (sys >= 180 || dia >= 120) { category = "Hypertensive Crisis"; risk = "Seek emergency care immediately"; }
        else if (sys >= 140 || dia >= 90) { category = "Stage 2 Hypertension"; risk = "High risk — medication likely needed"; }
        else if (sys >= 130 || dia >= 80) { category = "Stage 1 Hypertension"; risk = "Moderate risk — lifestyle changes recommended"; }
        else if (sys >= 120 && dia < 80) { category = "Elevated"; risk = "Low-moderate — likely to develop hypertension"; }
        else if (sys < 90 || dia < 60) { category = "Low (Hypotension)"; risk = "May cause dizziness — consult doctor if symptomatic"; }
        else { category = "Normal"; risk = "Low risk — maintain healthy habits"; }
        const pulse = sys - dia;
        const map = dia + (pulse / 3);
        return {
          primary: { label: `${sys}/${dia} mmHg`, value: category },
          details: [
            { label: "Category", value: category },
            { label: "Health risk", value: risk },
            { label: "Pulse pressure", value: `${pulse} mmHg` },
            { label: "Mean arterial pressure", value: `${Math.round(map)} mmHg` },
            { label: "Normal range", value: "< 120/80 mmHg" },
          ],
          note: "Based on AHA/ACC 2017 guidelines. A single reading doesn't define your blood pressure — track multiple readings over time. Always consult a healthcare provider.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "heart-rate-calculator", "calorie-calculator"],
  faq: [
    { question: "What is normal blood pressure?", answer: "Normal: below 120/80 mmHg. Elevated: 120-129/<80. Stage 1 Hypertension: 130-139 or 80-89. Stage 2: 140+ or 90+. Hypertensive crisis: 180+ or 120+." },
    { question: "What do the numbers mean?", answer: "Systolic (top): pressure when heart beats. Diastolic (bottom): pressure when heart rests between beats. Both matter, but systolic is typically more important after age 50." },
  ],
  formula: "MAP = Diastolic + (Systolic - Diastolic) / 3 | Pulse Pressure = Systolic - Diastolic",
};
