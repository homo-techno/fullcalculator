import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ascvdRiskCalculator: CalculatorDefinition = {
  slug: "ascvd-risk",
  title: "ASCVD 10-Year Risk Calculator",
  description:
    "Free online ASCVD 10-year cardiovascular risk calculator using the Pooled Cohort Equations.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "ascvd",
    "cardiovascular risk",
    "heart disease",
    "pooled cohort",
    "atherosclerotic",
    "10 year risk",
    "cholesterol",
    "blood pressure",
  ],
  variants: [
    {
      id: "ascvd-risk",
      name: "ASCVD 10-Year Risk Score",
      description:
        "Estimate 10-year risk of a first atherosclerotic cardiovascular event using the Pooled Cohort Equations.",
      fields: [
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 55",
          min: 40,
          max: 79,
          suffix: "years",
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
          name: "race",
          label: "Race",
          type: "select",
          options: [
            { label: "White", value: "white" },
            { label: "African American", value: "aa" },
            { label: "Other", value: "other" },
          ],
        },
        {
          name: "totalCholesterol",
          label: "Total Cholesterol",
          type: "number",
          placeholder: "e.g. 200",
          suffix: "mg/dL",
        },
        {
          name: "hdl",
          label: "HDL Cholesterol",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "mg/dL",
        },
        {
          name: "systolicBP",
          label: "Systolic Blood Pressure",
          type: "number",
          placeholder: "e.g. 130",
          suffix: "mmHg",
        },
        {
          name: "bpTreated",
          label: "On Blood Pressure Medication?",
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
          name: "smoker",
          label: "Current Smoker?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.age as string) || 0;
        const totalChol = parseFloat(inputs.totalCholesterol as string) || 0;
        const hdl = parseFloat(inputs.hdl as string) || 0;
        const sysBP = parseFloat(inputs.systolicBP as string) || 0;
        const sex = inputs.sex as string;
        const race = inputs.race as string;
        const bpTreated = inputs.bpTreated === "yes";
        const diabetes = inputs.diabetes === "yes";
        const smoker = inputs.smoker === "yes";

        if (age < 40 || age > 79 || totalChol <= 0 || hdl <= 0 || sysBP <= 0) {
          return null;
        }

        const lnAge = Math.log(age);
        const lnTC = Math.log(totalChol);
        const lnHDL = Math.log(hdl);
        const lnSBP = Math.log(sysBP);
        const diabetesVal = diabetes ? 1 : 0;
        const smokerVal = smoker ? 1 : 0;

        let sumCoeff: number;
        let meanCoeff: number;
        let baseline: number;

        if (sex === "male" && race === "aa") {
          // African American Male coefficients
          const treated = bpTreated ? lnSBP * 1.916 : lnSBP * 1.809;
          sumCoeff =
            2.469 * lnAge +
            0.302 * lnTC +
            -0.307 * lnHDL +
            treated +
            0.549 * smokerVal +
            0.645 * diabetesVal;
          meanCoeff = 19.54;
          baseline = 0.8954;
        } else if (sex === "female" && race === "aa") {
          // African American Female coefficients
          const treated = bpTreated ? lnSBP * 1.957 : lnSBP * 1.809;
          sumCoeff =
            17.114 * lnAge +
            0.94 * lnTC +
            -18.92 * lnHDL +
            4.475 * lnHDL * lnAge +
            treated +
            0.691 * smokerVal +
            0.874 * diabetesVal;
          meanCoeff = 86.61;
          baseline = 0.9533;
        } else if (sex === "male") {
          // White Male coefficients
          const treated = bpTreated ? lnSBP * 1.797 : lnSBP * 1.764;
          sumCoeff =
            12.344 * lnAge +
            11.853 * lnTC +
            -2.664 * lnTC * lnAge +
            -7.99 * lnHDL +
            1.769 * lnHDL * lnAge +
            treated +
            7.837 * smokerVal +
            -1.795 * smokerVal * lnAge +
            0.658 * diabetesVal;
          meanCoeff = 61.18;
          baseline = 0.9144;
        } else {
          // White Female coefficients
          const treated = bpTreated ? lnSBP * 2.019 : lnSBP * 1.957;
          sumCoeff =
            -29.799 * lnAge +
            4.884 * lnAge * lnAge +
            13.54 * lnTC +
            -3.114 * lnTC * lnAge +
            -13.578 * lnHDL +
            3.149 * lnHDL * lnAge +
            treated +
            7.574 * smokerVal +
            -1.665 * smokerVal * lnAge +
            0.661 * diabetesVal;
          meanCoeff = -29.18;
          baseline = 0.9665;
        }

        const risk =
          (1 - Math.pow(baseline, Math.exp(sumCoeff - meanCoeff))) * 100;
        const clampedRisk = Math.max(0, Math.min(100, risk));

        let riskCategory: string;
        if (clampedRisk < 5) {
          riskCategory = "Low Risk";
        } else if (clampedRisk < 7.5) {
          riskCategory = "Borderline Risk";
        } else if (clampedRisk < 20) {
          riskCategory = "Intermediate Risk";
        } else {
          riskCategory = "High Risk";
        }

        return {
          primary: {
            label: "10-Year ASCVD Risk",
            value: formatNumber(clampedRisk),
            suffix: "%",
          },
          details: [
            { label: "Risk Category", value: riskCategory },
            { label: "Age", value: formatNumber(age) + " years" },
            {
              label: "Total Cholesterol",
              value: formatNumber(totalChol) + " mg/dL",
            },
            { label: "HDL", value: formatNumber(hdl) + " mg/dL" },
            {
              label: "Systolic BP",
              value: formatNumber(sysBP) + " mmHg",
            },
            { label: "Diabetes", value: diabetes ? "Yes" : "No" },
            { label: "Smoker", value: smoker ? "Yes" : "No" },
            {
              label: "BP Medication",
              value: bpTreated ? "Yes" : "No",
            },
          ],
          note: "This is an estimate based on the Pooled Cohort Equations. Consult a healthcare provider for clinical interpretation.",
        };
      },
    },
  ],
  relatedSlugs: ["map-blood-pressure", "cardiac-output", "bun-creatinine-ratio"],
  faq: [
    {
      question: "What is the ASCVD risk score?",
      answer:
        "The ASCVD (Atherosclerotic Cardiovascular Disease) risk score estimates your 10-year risk of having a first cardiovascular event such as heart attack or stroke, using the Pooled Cohort Equations developed by the AHA/ACC.",
    },
    {
      question: "Who should use this calculator?",
      answer:
        "This calculator is intended for adults aged 40-79 who have not already had a heart attack or stroke. It is used by clinicians to guide decisions about statin therapy and lifestyle modifications.",
    },
    {
      question: "What risk levels indicate statin therapy?",
      answer:
        "Generally, a 10-year risk of 7.5% or higher is the threshold at which clinicians consider moderate-to-high intensity statin therapy. A risk of 5-7.5% (borderline) may warrant a clinician-patient discussion about risk-enhancing factors.",
    },
  ],
  formula:
    "10-Year ASCVD Risk = 1 - S₀^exp(ΣβᵢXᵢ - Mean Coefficient), where S₀ is baseline survival, βᵢ are regression coefficients, and Xᵢ are individual risk factor values (log-transformed).",
};
