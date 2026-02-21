import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const strokeRiskCalculator: CalculatorDefinition = {
  slug: "stroke-risk-calculator",
  title: "Stroke Risk Assessment Calculator",
  description:
    "Free stroke risk assessment calculator. Evaluate your stroke risk using the CHA2DS2-VASc score for atrial fibrillation and general stroke risk factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "stroke risk calculator",
    "CHA2DS2-VASc",
    "stroke assessment",
    "atrial fibrillation stroke risk",
    "stroke prevention",
    "stroke probability",
  ],
  variants: [
    {
      id: "cha2ds2-vasc",
      name: "CHA2DS2-VASc Score",
      description: "Calculate stroke risk in atrial fibrillation using CHA2DS2-VASc",
      fields: [
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "years",
          min: 18,
          max: 120,
        },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "chf",
          label: "Congestive Heart Failure?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "hypertension",
          label: "Hypertension?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "diabetes",
          label: "Diabetes?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "stroke",
          label: "Prior Stroke / TIA / Thromboembolism?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "vascular",
          label: "Vascular Disease (prior MI, PAD, aortic plaque)?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        if (!age || !sex) return null;

        let score = 0;
        // C - Congestive heart failure (+1)
        if (inputs.chf === "yes") score += 1;
        // H - Hypertension (+1)
        if (inputs.hypertension === "yes") score += 1;
        // A2 - Age >= 75 (+2)
        if (age >= 75) score += 2;
        else if (age >= 65) score += 1; // Age 65-74 (+1)
        // D - Diabetes (+1)
        if (inputs.diabetes === "yes") score += 1;
        // S2 - Prior Stroke/TIA (+2)
        if (inputs.stroke === "yes") score += 2;
        // V - Vascular disease (+1)
        if (inputs.vascular === "yes") score += 1;
        // Sc - Sex category: female (+1)
        if (sex === "female") score += 1;

        // Approximate annual stroke risk based on CHA2DS2-VASc score
        const annualRiskMap: Record<number, number> = {
          0: 0.2, 1: 0.6, 2: 2.2, 3: 3.2, 4: 4.8,
          5: 7.2, 6: 9.7, 7: 11.2, 8: 10.8, 9: 12.2,
        };
        const annualRisk = annualRiskMap[Math.min(score, 9)] ?? 12.2;

        let recommendation: string;
        if (sex === "male" && score === 0) recommendation = "Low risk — anticoagulation generally not needed";
        else if (sex === "female" && score <= 1) recommendation = "Low risk — anticoagulation generally not needed (sex alone does not warrant anticoagulation)";
        else if (score === 1) recommendation = "Low-moderate risk — consider anticoagulation";
        else recommendation = "Anticoagulation recommended (discuss with cardiologist)";

        return {
          primary: { label: "CHA2DS2-VASc Score", value: String(score) },
          details: [
            { label: "Score", value: `${score} / 9` },
            { label: "Annual stroke risk", value: `~${formatNumber(annualRisk, 1)}%` },
            { label: "Recommendation", value: recommendation },
            { label: "Risk factors counted", value: String(score) },
          ],
          note: "The CHA2DS2-VASc score is used for patients with non-valvular atrial fibrillation to guide anticoagulation decisions. This is an educational tool — anticoagulation decisions require clinical assessment including bleeding risk (HAS-BLED score). Not medical advice.",
        };
      },
    },
    {
      id: "general",
      name: "General Stroke Risk Factors",
      description: "Assess your general stroke risk factors",
      fields: [
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 60",
          suffix: "years",
          min: 18,
          max: 120,
        },
        {
          name: "systolic",
          label: "Systolic Blood Pressure",
          type: "number",
          placeholder: "e.g. 140",
          suffix: "mmHg",
          min: 80,
          max: 250,
        },
        {
          name: "smoking",
          label: "Current Smoker?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "diabetes",
          label: "Diabetes?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "afib",
          label: "Atrial Fibrillation?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "priorStroke",
          label: "Prior Stroke or TIA?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const sbp = inputs.systolic as number;
        if (!age || !sbp) return null;

        const riskFactors: string[] = [];
        let riskScore = 0;

        if (age >= 75) { riskScore += 3; riskFactors.push("Age 75+"); }
        else if (age >= 65) { riskScore += 2; riskFactors.push("Age 65-74"); }
        else if (age >= 55) { riskScore += 1; riskFactors.push("Age 55-64"); }

        if (sbp >= 180) { riskScore += 3; riskFactors.push("Severe hypertension"); }
        else if (sbp >= 140) { riskScore += 2; riskFactors.push("Hypertension"); }
        else if (sbp >= 130) { riskScore += 1; riskFactors.push("Elevated blood pressure"); }

        if (inputs.smoking === "yes") { riskScore += 2; riskFactors.push("Smoking"); }
        if (inputs.diabetes === "yes") { riskScore += 2; riskFactors.push("Diabetes"); }
        if (inputs.afib === "yes") { riskScore += 3; riskFactors.push("Atrial fibrillation"); }
        if (inputs.priorStroke === "yes") { riskScore += 4; riskFactors.push("Prior stroke/TIA"); }

        let riskLevel: string;
        if (riskScore <= 2) riskLevel = "Low risk";
        else if (riskScore <= 5) riskLevel = "Moderate risk";
        else if (riskScore <= 8) riskLevel = "High risk";
        else riskLevel = "Very high risk";

        return {
          primary: { label: "Stroke Risk Level", value: riskLevel },
          details: [
            { label: "Risk score", value: `${riskScore} points` },
            { label: "Risk level", value: riskLevel },
            { label: "Risk factors identified", value: riskFactors.length > 0 ? riskFactors.join(", ") : "None identified" },
            { label: "Modifiable factors", value: "Blood pressure, smoking, diabetes management, atrial fibrillation treatment" },
          ],
          note: "This is a simplified risk assessment for educational purposes. For clinical stroke risk assessment, consult your healthcare provider. Recognize stroke signs: Face drooping, Arm weakness, Speech difficulty, Time to call 911 (FAST). Not medical advice.",
        };
      },
    },
  ],
  relatedSlugs: ["heart-disease-risk-calculator", "blood-pressure-calculator", "cholesterol-ratio-calculator"],
  faq: [
    {
      question: "What is the CHA2DS2-VASc score?",
      answer:
        "CHA2DS2-VASc estimates stroke risk in patients with atrial fibrillation. The acronym stands for Congestive heart failure, Hypertension, Age >=75 (2 pts), Diabetes, Stroke/TIA (2 pts), Vascular disease, Age 65-74, Sex category (female).",
    },
    {
      question: "What are the warning signs of a stroke?",
      answer:
        "Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911. Other signs include sudden severe headache, vision problems, confusion, and trouble walking.",
    },
    {
      question: "Can stroke be prevented?",
      answer:
        "Up to 80% of strokes are preventable. Key preventive measures include controlling blood pressure, managing atrial fibrillation, quitting smoking, controlling diabetes, maintaining a healthy weight, and regular exercise.",
    },
  ],
  formula:
    "CHA2DS2-VASc: C (CHF, +1) + H (Hypertension, +1) + A2 (Age>=75, +2) + D (Diabetes, +1) + S2 (Stroke/TIA, +2) + V (Vascular disease, +1) + A (Age 65-74, +1) + Sc (Sex-female, +1) = 0-9 points",
};
