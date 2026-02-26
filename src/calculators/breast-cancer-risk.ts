import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breastCancerRiskCalculator: CalculatorDefinition = {
  slug: "breast-cancer-risk",
  title: "Breast Cancer Risk Calculator",
  description:
    "Free online breast cancer risk calculator based on the simplified Gail model to estimate 5-year and lifetime risk.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "breast cancer",
    "gail model",
    "cancer risk",
    "mammogram",
    "oncology",
    "women health",
    "risk assessment",
  ],
  variants: [
    {
      id: "gail-model",
      name: "Gail Model Risk Estimate",
      description:
        "Estimate 5-year and lifetime breast cancer risk using the simplified Gail model.",
      fields: [
        {
          name: "currentAge",
          label: "Current Age",
          type: "number",
          placeholder: "e.g. 50",
          min: 35,
          max: 85,
          suffix: "years",
        },
        {
          name: "ageFirstMenstruation",
          label: "Age at First Menstruation",
          type: "select",
          options: [
            { label: "7-11 years", value: "early" },
            { label: "12-13 years", value: "average" },
            { label: "14+ years", value: "late" },
          ],
        },
        {
          name: "ageFirstBirth",
          label: "Age at First Live Birth",
          type: "select",
          options: [
            { label: "No births", value: "none" },
            { label: "Under 20", value: "under20" },
            { label: "20-24", value: "20to24" },
            { label: "25-29", value: "25to29" },
            { label: "30+", value: "30plus" },
          ],
        },
        {
          name: "firstDegreeRelatives",
          label: "First-Degree Relatives with Breast Cancer",
          type: "select",
          options: [
            { label: "0", value: "0" },
            { label: "1", value: "1" },
            { label: "2 or more", value: "2" },
          ],
        },
        {
          name: "biopsies",
          label: "Number of Previous Breast Biopsies",
          type: "select",
          options: [
            { label: "0", value: "0" },
            { label: "1", value: "1" },
            { label: "2 or more", value: "2" },
          ],
        },
        {
          name: "race",
          label: "Race/Ethnicity",
          type: "select",
          options: [
            { label: "White", value: "white" },
            { label: "African American", value: "aa" },
            { label: "Hispanic", value: "hispanic" },
            { label: "Asian", value: "asian" },
            { label: "Other", value: "other" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.currentAge as string) || 0;
        if (age < 35 || age > 85) return null;

        // Simplified Gail model relative risk factors
        let rrMenstruation = 1.0;
        if (inputs.ageFirstMenstruation === "early") rrMenstruation = 1.1;
        else if (inputs.ageFirstMenstruation === "average") rrMenstruation = 1.0;
        else if (inputs.ageFirstMenstruation === "late") rrMenstruation = 0.93;

        let rrBirth = 1.0;
        if (inputs.ageFirstBirth === "none") rrBirth = 1.24;
        else if (inputs.ageFirstBirth === "under20") rrBirth = 1.0;
        else if (inputs.ageFirstBirth === "20to24") rrBirth = 1.08;
        else if (inputs.ageFirstBirth === "25to29") rrBirth = 1.19;
        else if (inputs.ageFirstBirth === "30plus") rrBirth = 1.33;

        let rrRelatives = 1.0;
        if (inputs.firstDegreeRelatives === "1") rrRelatives = 2.26;
        else if (inputs.firstDegreeRelatives === "2") rrRelatives = 3.96;

        let rrBiopsies = 1.0;
        if (inputs.biopsies === "1") rrBiopsies = 1.27;
        else if (inputs.biopsies === "2") rrBiopsies = 1.62;

        // Baseline age-specific incidence (approximate per 100,000 women/year)
        let baselineRate = 0.0;
        if (age < 40) baselineRate = 0.0004;
        else if (age < 50) baselineRate = 0.0015;
        else if (age < 60) baselineRate = 0.0023;
        else if (age < 70) baselineRate = 0.0035;
        else baselineRate = 0.004;

        // Race adjustment factor
        let raceFactor = 1.0;
        if (inputs.race === "aa") raceFactor = 1.02;
        else if (inputs.race === "hispanic") raceFactor = 0.68;
        else if (inputs.race === "asian") raceFactor = 0.55;
        else if (inputs.race === "other") raceFactor = 0.78;

        const compositeRR =
          rrMenstruation * rrBirth * rrRelatives * rrBiopsies * raceFactor;
        const annualRisk = baselineRate * compositeRR;
        const fiveYearRisk = (1 - Math.pow(1 - annualRisk, 5)) * 100;
        const lifetimeYears = Math.max(0, 90 - age);
        const lifetimeRisk = (1 - Math.pow(1 - annualRisk, lifetimeYears)) * 100;

        // Average 5-year risk for comparison
        const avgFiveYear = (1 - Math.pow(1 - baselineRate, 5)) * 100;

        let riskLevel: string;
        if (fiveYearRisk < 1.67) {
          riskLevel = "Average Risk";
        } else if (fiveYearRisk < 3.0) {
          riskLevel = "Above Average Risk";
        } else {
          riskLevel = "High Risk";
        }

        return {
          primary: {
            label: "5-Year Risk",
            value: formatNumber(fiveYearRisk),
            suffix: "%",
          },
          details: [
            {
              label: "Lifetime Risk (to age 90)",
              value: formatNumber(lifetimeRisk) + "%",
            },
            { label: "Risk Category", value: riskLevel },
            {
              label: "Composite Relative Risk",
              value: formatNumber(compositeRR),
            },
            {
              label: "Average 5-Year Risk for Age",
              value: formatNumber(avgFiveYear) + "%",
            },
            {
              label: "Risk vs Average",
              value: formatNumber(compositeRR) + "x",
            },
          ],
          note: "A 5-year risk >= 1.67% is considered high risk by the NCI. This is a simplified model; consult an oncologist for full risk assessment.",
        };
      },
    },
  ],
  relatedSlugs: ["life-expectancy-calc", "ascvd-risk"],
  faq: [
    {
      question: "What is the Gail model?",
      answer:
        "The Gail model is a statistical tool that estimates a woman's risk of developing invasive breast cancer over a 5-year period and over her lifetime. It was developed by Dr. Mitchell Gail at the National Cancer Institute and considers factors like age, reproductive history, family history, and prior biopsies.",
    },
    {
      question: "What does a 5-year risk of 1.67% or higher mean?",
      answer:
        "A 5-year risk of 1.67% or higher is the threshold used to define 'high risk' by the National Cancer Institute. Women at this level may benefit from chemoprevention strategies (e.g., tamoxifen or raloxifene) and enhanced screening.",
    },
    {
      question: "Does this model account for BRCA mutations?",
      answer:
        "No. The Gail model does not account for BRCA1 or BRCA2 gene mutations, nor for other hereditary cancer syndromes. Women with known genetic mutations should use specialized genetic risk models such as the Tyrer-Cuzick (IBIS) model.",
    },
  ],
  formula:
    "5-Year Risk = 1 - (1 - baseline_incidence × composite_RR)^5 × 100. Composite RR = RR(menarche) × RR(first birth) × RR(relatives) × RR(biopsies) × race_factor.",
};
