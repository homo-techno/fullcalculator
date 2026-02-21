import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cholesterolRatioCalculator: CalculatorDefinition = {
  slug: "cholesterol-ratio-calculator",
  title: "Cholesterol Ratio Calculator",
  description:
    "Free cholesterol ratio calculator. Calculate your total cholesterol to HDL ratio, LDL/HDL ratio, and triglyceride/HDL ratio to assess cardiovascular risk.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "cholesterol ratio",
    "total cholesterol HDL ratio",
    "LDL HDL ratio",
    "cholesterol calculator",
    "heart disease risk cholesterol",
    "lipid panel",
  ],
  variants: [
    {
      id: "total-hdl",
      name: "Total Cholesterol / HDL Ratio",
      description: "Calculate your total cholesterol to HDL ratio",
      fields: [
        {
          name: "totalCholesterol",
          label: "Total Cholesterol",
          type: "number",
          placeholder: "e.g. 200",
          suffix: "mg/dL",
          min: 50,
          max: 500,
        },
        {
          name: "hdl",
          label: "HDL (Good Cholesterol)",
          type: "number",
          placeholder: "e.g. 55",
          suffix: "mg/dL",
          min: 10,
          max: 150,
        },
      ],
      calculate: (inputs) => {
        const total = inputs.totalCholesterol as number;
        const hdl = inputs.hdl as number;
        if (!total || !hdl) return null;
        const ratio = total / hdl;
        let risk: string;
        if (ratio < 3.5) risk = "Optimal — low cardiovascular risk";
        else if (ratio < 5.0) risk = "Desirable — average risk";
        else if (ratio < 7.0) risk = "Borderline high — above average risk";
        else risk = "High — significantly elevated cardiovascular risk";
        const ldlEstimate = total - hdl;
        return {
          primary: { label: "Total/HDL Ratio", value: formatNumber(ratio, 1) },
          details: [
            { label: "Risk category", value: risk },
            { label: "Total cholesterol", value: `${total} mg/dL` },
            { label: "HDL cholesterol", value: `${hdl} mg/dL` },
            { label: "Non-HDL cholesterol", value: `${ldlEstimate} mg/dL` },
            { label: "Optimal ratio", value: "Below 3.5:1" },
          ],
          note: "A lower ratio indicates better cardiovascular health. The AHA considers a ratio above 5 to indicate higher risk. This is an estimate and not a substitute for medical advice.",
        };
      },
    },
    {
      id: "full-panel",
      name: "Full Lipid Panel Ratios",
      description: "Calculate all cholesterol ratios from a complete lipid panel",
      fields: [
        {
          name: "totalCholesterol",
          label: "Total Cholesterol",
          type: "number",
          placeholder: "e.g. 200",
          suffix: "mg/dL",
          min: 50,
          max: 500,
        },
        {
          name: "hdl",
          label: "HDL Cholesterol",
          type: "number",
          placeholder: "e.g. 55",
          suffix: "mg/dL",
          min: 10,
          max: 150,
        },
        {
          name: "ldl",
          label: "LDL Cholesterol",
          type: "number",
          placeholder: "e.g. 120",
          suffix: "mg/dL",
          min: 10,
          max: 400,
        },
        {
          name: "triglycerides",
          label: "Triglycerides",
          type: "number",
          placeholder: "e.g. 150",
          suffix: "mg/dL",
          min: 20,
          max: 1000,
        },
      ],
      calculate: (inputs) => {
        const total = inputs.totalCholesterol as number;
        const hdl = inputs.hdl as number;
        const ldl = inputs.ldl as number;
        const trig = inputs.triglycerides as number;
        if (!total || !hdl || !ldl || !trig) return null;
        const totalHdlRatio = total / hdl;
        const ldlHdlRatio = ldl / hdl;
        const trigHdlRatio = trig / hdl;
        const nonHdl = total - hdl;
        let totalRisk: string;
        if (totalHdlRatio < 3.5) totalRisk = "Optimal";
        else if (totalHdlRatio < 5.0) totalRisk = "Desirable";
        else totalRisk = "High risk";
        let ldlRisk: string;
        if (ldlHdlRatio < 2.0) ldlRisk = "Optimal";
        else if (ldlHdlRatio < 3.5) ldlRisk = "Moderate";
        else ldlRisk = "High risk";
        let trigRisk: string;
        if (trigHdlRatio < 2.0) trigRisk = "Ideal (low insulin resistance)";
        else if (trigHdlRatio < 4.0) trigRisk = "Moderate";
        else trigRisk = "High (possible insulin resistance)";
        return {
          primary: { label: "Total/HDL Ratio", value: formatNumber(totalHdlRatio, 1) },
          details: [
            { label: "Total/HDL ratio", value: `${formatNumber(totalHdlRatio, 2)} — ${totalRisk}` },
            { label: "LDL/HDL ratio", value: `${formatNumber(ldlHdlRatio, 2)} — ${ldlRisk}` },
            { label: "Triglyceride/HDL ratio", value: `${formatNumber(trigHdlRatio, 2)} — ${trigRisk}` },
            { label: "Non-HDL cholesterol", value: `${nonHdl} mg/dL` },
            { label: "VLDL estimate", value: `${formatNumber(trig / 5, 0)} mg/dL` },
          ],
          note: "These ratios help assess cardiovascular risk beyond individual cholesterol numbers. The triglyceride/HDL ratio is also a marker for insulin resistance. Consult your doctor for interpretation.",
        };
      },
    },
  ],
  relatedSlugs: ["heart-disease-risk-calculator", "blood-pressure-calculator", "bmi-calculator"],
  faq: [
    {
      question: "What is a good cholesterol ratio?",
      answer:
        "The American Heart Association recommends a total cholesterol to HDL ratio below 5:1, with optimal being below 3.5:1. Lower ratios indicate better cardiovascular health.",
    },
    {
      question: "What is HDL vs LDL cholesterol?",
      answer:
        "HDL (high-density lipoprotein) is 'good' cholesterol that helps remove other forms of cholesterol. LDL (low-density lipoprotein) is 'bad' cholesterol that can build up in artery walls.",
    },
    {
      question: "Why is the triglyceride/HDL ratio important?",
      answer:
        "The triglyceride/HDL ratio is a strong predictor of heart disease risk and insulin resistance. A ratio below 2 is ideal. A high ratio may indicate metabolic syndrome even with normal individual values.",
    },
  ],
  formula:
    "Total/HDL Ratio = Total Cholesterol / HDL | LDL/HDL Ratio = LDL / HDL | Triglyceride/HDL Ratio = Triglycerides / HDL | Non-HDL = Total Cholesterol - HDL | VLDL estimate = Triglycerides / 5 (Friedewald equation component)",
};
