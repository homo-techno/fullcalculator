import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cha2ds2VascCalculator: CalculatorDefinition = {
  slug: "cha2ds2-vasc-calculator",
  title: "CHA\u2082DS\u2082-VASc Score Calculator",
  description:
    "Calculate the CHA\u2082DS\u2082-VASc score to estimate stroke risk in patients with atrial fibrillation. Determine anticoagulation recommendations based on risk factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "CHA2DS2-VASc",
    "stroke risk calculator",
    "atrial fibrillation",
    "anticoagulation",
    "AFib stroke risk",
    "blood thinner decision",
    "CHA2DS2 VASc score",
  ],
  variants: [
    {
      id: "cha2ds2-vasc-score",
      name: "CHA\u2082DS\u2082-VASc Score",
      description: "Calculate stroke risk score for atrial fibrillation patients",
      fields: [
        {
          name: "chf",
          label: "Congestive Heart Failure (or LV dysfunction)",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes (+1 point)", value: "1" },
          ],
        },
        {
          name: "hypertension",
          label: "Hypertension (or on antihypertensives)",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes (+1 point)", value: "1" },
          ],
        },
        {
          name: "age",
          label: "Age",
          type: "select",
          options: [
            { label: "Under 65", value: "0" },
            { label: "65-74 (+1 point)", value: "1" },
            { label: "75 or older (+2 points)", value: "2" },
          ],
        },
        {
          name: "diabetes",
          label: "Diabetes Mellitus",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes (+1 point)", value: "1" },
          ],
        },
        {
          name: "stroke",
          label: "Prior Stroke / TIA / Thromboembolism",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes (+2 points)", value: "2" },
          ],
        },
        {
          name: "vascular",
          label: "Vascular Disease (prior MI, PAD, aortic plaque)",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes (+1 point)", value: "1" },
          ],
        },
        {
          name: "sex",
          label: "Sex Category",
          type: "select",
          options: [
            { label: "Male", value: "0" },
            { label: "Female (+1 point)", value: "1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const chf = parseFloat(inputs.chf as string);
        const hypertension = parseFloat(inputs.hypertension as string);
        const age = parseFloat(inputs.age as string);
        const diabetes = parseFloat(inputs.diabetes as string);
        const stroke = parseFloat(inputs.stroke as string);
        const vascular = parseFloat(inputs.vascular as string);
        const sex = parseFloat(inputs.sex as string);

        if ([chf, hypertension, age, diabetes, stroke, vascular, sex].some(isNaN)) return null;

        const score = chf + hypertension + age + diabetes + stroke + vascular + sex;

        // Annual stroke risk rates based on score (from published data)
        const strokeRates: Record<number, string> = {
          0: "0.2%",
          1: "0.6%",
          2: "2.2%",
          3: "3.2%",
          4: "4.8%",
          5: "7.2%",
          6: "9.7%",
          7: "11.2%",
          8: "10.8%",
          9: "12.2%",
        };

        const annualRisk = strokeRates[Math.min(score, 9)] || ">12%";

        let recommendation: string;
        let riskLevel: string;
        if (score === 0) {
          riskLevel = "Low Risk";
          recommendation = "No anticoagulation recommended (male) or consider aspirin/none (female with score 1 from sex alone)";
        } else if (score === 1) {
          riskLevel = "Low-Moderate Risk";
          recommendation = "Consider oral anticoagulation (OAC) or aspirin. OAC preferred in most guidelines. If score is 1 from female sex alone, risk is essentially low.";
        } else {
          riskLevel = "Moderate-High Risk";
          recommendation = "Oral anticoagulation recommended (warfarin or DOAC: apixaban, rivaroxaban, edoxaban, or dabigatran)";
        }

        const factors: string[] = [];
        if (chf === 1) factors.push("CHF/LV dysfunction");
        if (hypertension === 1) factors.push("Hypertension");
        if (age === 1) factors.push("Age 65-74");
        if (age === 2) factors.push("Age >= 75");
        if (diabetes === 1) factors.push("Diabetes");
        if (stroke === 2) factors.push("Prior Stroke/TIA");
        if (vascular === 1) factors.push("Vascular disease");
        if (sex === 1) factors.push("Female sex");

        return {
          primary: { label: "CHA\u2082DS\u2082-VASc Score", value: `${formatNumber(score, 0)} / 9` },
          details: [
            { label: "Risk Level", value: riskLevel },
            { label: "Annual Stroke Risk", value: annualRisk },
            { label: "Risk Factors Present", value: factors.length > 0 ? factors.join(", ") : "None" },
            { label: "Anticoagulation Recommendation", value: recommendation },
          ],
          note: "This score guides anticoagulation decisions in non-valvular atrial fibrillation. Bleeding risk (HAS-BLED score) should also be assessed. Final treatment decisions must be made by your cardiologist or managing physician.",
        };
      },
    },
  ],
  relatedSlugs: ["blood-oxygen-calculator", "a1c-calculator", "diabetes-risk-calculator"],
  faq: [
    {
      question: "What does CHA\u2082DS\u2082-VASc stand for?",
      answer:
        "C = Congestive heart failure (+1), H = Hypertension (+1), A\u2082 = Age >= 75 (+2), D = Diabetes (+1), S\u2082 = Stroke/TIA/thromboembolism (+2), V = Vascular disease (+1), A = Age 65-74 (+1), Sc = Sex category female (+1). Maximum score is 9.",
    },
    {
      question: "When should anticoagulation be started based on the score?",
      answer:
        "Current guidelines recommend anticoagulation for men with a score >= 1 (if the point is not from female sex alone) and for all patients with a score >= 2. A score of 0 in men (or 1 in women from sex category alone) suggests no anticoagulation needed.",
    },
    {
      question: "What anticoagulants are used for AFib?",
      answer:
        "Options include direct oral anticoagulants (DOACs) such as apixaban (Eliquis), rivaroxaban (Xarelto), dabigatran (Pradaxa), and edoxaban (Savaysa), or warfarin (Coumadin). DOACs are generally preferred due to fewer interactions and no routine monitoring requirement.",
    },
  ],
  formula:
    "CHA\u2082DS\u2082-VASc = CHF(1) + Hypertension(1) + Age>=75(2) + Diabetes(1) + Stroke/TIA(2) + Vascular Disease(1) + Age 65-74(1) + Female Sex(1) | Max Score = 9",
};
