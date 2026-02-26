import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cardiacOutputCalculator: CalculatorDefinition = {
  slug: "cardiac-output",
  title: "Cardiac Output Calculator (Fick Method)",
  description:
    "Free online cardiac output calculator using the Fick principle, heart rate × stroke volume, and cardiac index.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "cardiac output",
    "Fick principle",
    "stroke volume",
    "cardiac index",
    "heart",
    "hemodynamics",
    "cardiology",
    "CO",
  ],
  variants: [
    {
      id: "fick-method",
      name: "Fick Principle",
      description:
        "Calculate cardiac output using the Fick equation from oxygen consumption and arteriovenous oxygen difference.",
      fields: [
        {
          name: "vo2",
          label: "Oxygen Consumption (VO₂)",
          type: "number",
          placeholder: "e.g. 250",
          suffix: "mL/min",
        },
        {
          name: "cao2",
          label: "Arterial Oxygen Content (CaO₂)",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "mL O₂/dL",
        },
        {
          name: "cvo2",
          label: "Mixed Venous O₂ Content (CvO₂)",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "mL O₂/dL",
        },
        {
          name: "bsa",
          label: "Body Surface Area (BSA, optional for CI)",
          type: "number",
          placeholder: "e.g. 1.8",
          suffix: "m²",
        },
      ],
      calculate: (inputs) => {
        const vo2 = parseFloat(inputs.vo2 as string) || 0;
        const cao2 = parseFloat(inputs.cao2 as string) || 0;
        const cvo2 = parseFloat(inputs.cvo2 as string) || 0;
        const bsa = parseFloat(inputs.bsa as string) || 0;

        if (vo2 <= 0 || cao2 <= 0) return null;

        const avDiff = cao2 - cvo2; // mL O₂/dL
        if (avDiff <= 0) return null;

        // Fick: CO = VO₂ / (CaO₂ - CvO₂)
        // VO₂ in mL/min, O₂ content in mL/dL, so CO in dL/min → ×10 for mL/min → /1000 for L/min
        const co = vo2 / (avDiff * 10); // L/min

        let ci: number | null = null;
        let ciAssessment = "";
        if (bsa > 0) {
          ci = co / bsa;
          if (ci < 2.2) ciAssessment = "Low cardiac index (cardiogenic shock if < 1.8)";
          else if (ci <= 4.0) ciAssessment = "Normal cardiac index";
          else ciAssessment = "Elevated cardiac index (hyperdynamic state)";
        }

        let coAssessment: string;
        if (co < 4.0) coAssessment = "Below normal (may indicate heart failure)";
        else if (co <= 8.0) coAssessment = "Normal range (4-8 L/min)";
        else coAssessment = "Elevated (exercise, sepsis, or hyperdynamic state)";

        const details = [
          { label: "Assessment", value: coAssessment },
          { label: "A-V O₂ Difference", value: formatNumber(avDiff) + " mL O₂/dL" },
          { label: "VO₂", value: formatNumber(vo2) + " mL/min" },
          { label: "CaO₂", value: formatNumber(cao2) + " mL O₂/dL" },
          { label: "CvO₂", value: formatNumber(cvo2) + " mL O₂/dL" },
        ];

        if (ci !== null) {
          details.push({ label: "Cardiac Index (CI)", value: formatNumber(ci) + " L/min/m²" });
          details.push({ label: "CI Assessment", value: ciAssessment });
          details.push({ label: "BSA", value: formatNumber(bsa) + " m²" });
        }

        return {
          primary: {
            label: "Cardiac Output",
            value: formatNumber(co),
            suffix: "L/min",
          },
          details,
          note: "Normal CO is 4-8 L/min. Normal CI is 2.5-4.0 L/min/m². The Fick method is considered the gold standard for CO measurement.",
        };
      },
    },
    {
      id: "hr-sv-method",
      name: "Heart Rate × Stroke Volume",
      description:
        "Calculate cardiac output from heart rate and stroke volume.",
      fields: [
        {
          name: "heartRate",
          label: "Heart Rate",
          type: "number",
          placeholder: "e.g. 72",
          suffix: "bpm",
        },
        {
          name: "strokeVolume",
          label: "Stroke Volume",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "mL",
        },
        {
          name: "bsa",
          label: "Body Surface Area (optional)",
          type: "number",
          placeholder: "e.g. 1.8",
          suffix: "m²",
        },
      ],
      calculate: (inputs) => {
        const hr = parseFloat(inputs.heartRate as string) || 0;
        const sv = parseFloat(inputs.strokeVolume as string) || 0;
        const bsa = parseFloat(inputs.bsa as string) || 0;

        if (hr <= 0 || sv <= 0) return null;

        // CO = HR × SV (mL/min) → /1000 for L/min
        const coMlMin = hr * sv;
        const co = coMlMin / 1000;

        const details = [
          { label: "Cardiac Output", value: formatNumber(co) + " L/min" },
          { label: "Cardiac Output", value: formatNumber(coMlMin) + " mL/min" },
          { label: "Heart Rate", value: formatNumber(hr) + " bpm" },
          { label: "Stroke Volume", value: formatNumber(sv) + " mL" },
        ];

        if (bsa > 0) {
          const ci = co / bsa;
          const si = sv / bsa;
          details.push({ label: "Cardiac Index", value: formatNumber(ci) + " L/min/m²" });
          details.push({ label: "Stroke Volume Index", value: formatNumber(si) + " mL/m²" });
        }

        return {
          primary: {
            label: "Cardiac Output",
            value: formatNumber(co),
            suffix: "L/min",
          },
          details,
          note: "Normal resting CO is 4-8 L/min. Normal stroke volume is 60-100 mL. CO can increase 4-7× during exercise.",
        };
      },
    },
  ],
  relatedSlugs: ["map-blood-pressure", "body-surface-area", "ascvd-risk"],
  faq: [
    {
      question: "What is cardiac output?",
      answer:
        "Cardiac output (CO) is the volume of blood the heart pumps per minute. It is calculated as heart rate × stroke volume. Normal resting CO is 4-8 L/min. CO is a key indicator of cardiac function and tissue perfusion.",
    },
    {
      question: "What is the Fick principle?",
      answer:
        "The Fick principle states that cardiac output equals oxygen consumption (VO₂) divided by the arteriovenous oxygen difference. It is considered the gold standard for CO measurement and requires mixed venous blood sampling via a pulmonary artery catheter.",
    },
    {
      question: "What is cardiac index?",
      answer:
        "Cardiac index (CI) normalizes cardiac output to body surface area (CI = CO / BSA). Normal CI is 2.5-4.0 L/min/m². CI below 2.2 indicates a low output state, and below 1.8 suggests cardiogenic shock.",
    },
  ],
  formula:
    "Fick: CO (L/min) = VO₂ (mL/min) / [(CaO₂ - CvO₂) × 10]. HR×SV: CO = Heart_Rate × Stroke_Volume / 1000. Cardiac Index = CO / BSA.",
};
