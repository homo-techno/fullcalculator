import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dentalCleaningFrequencyCalculator: CalculatorDefinition = {
  slug: "dental-cleaning-frequency-calculator",
  title: "Dental Cleaning Frequency Calculator",
  description: "Determine the recommended dental cleaning interval based on risk factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["dental cleaning schedule","teeth cleaning frequency","dental hygiene interval"],
  variants: [{
    id: "standard",
    name: "Dental Cleaning Frequency",
    description: "Determine the recommended dental cleaning interval based on risk factors.",
    fields: [
      { name: "gumDisease", label: "History of Gum Disease", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] },
      { name: "smoker", label: "Tobacco Use", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] },
      { name: "diabetes", label: "Diabetes", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] },
      { name: "brushFreq", label: "Daily Brushing Frequency", type: "number", min: 0, max: 5, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const gumDisease = inputs.gumDisease as string;
    const smoker = inputs.smoker as string;
    const diabetes = inputs.diabetes as string;
    const brushFreq = inputs.brushFreq as number;
    let riskScore = 0;
    if (gumDisease === "1") riskScore += 3;
    if (smoker === "1") riskScore += 2;
    if (diabetes === "1") riskScore += 2;
    if (brushFreq < 2) riskScore += 1;
    let intervalMonths = 6;
    let riskLevel = "Low";
    if (riskScore >= 5) { intervalMonths = 3; riskLevel = "High"; }
    else if (riskScore >= 3) { intervalMonths = 4; riskLevel = "Moderate"; }
    const visitsPerYear = Math.round(12 / intervalMonths);
    return {
      primary: { label: "Recommended Interval", value: intervalMonths + " months" },
      details: [
        { label: "Risk Level", value: riskLevel },
        { label: "Visits per Year", value: formatNumber(visitsPerYear) },
        { label: "Risk Score", value: formatNumber(riskScore) + " / 8" }
      ]
    };
  },
  }],
  relatedSlugs: ["dental-crown-cost-calculator","teeth-whitening-cost-calculator","root-canal-cost-calculator"],
  faq: [
    { question: "How often should I get my teeth cleaned?", answer: "Most adults should get a dental cleaning every 6 months, or more often with risk factors." },
    { question: "Does smoking affect dental cleaning frequency?", answer: "Yes, smokers are at higher risk for gum disease and may need cleanings every 3 to 4 months." },
    { question: "Why do diabetics need more frequent cleanings?", answer: "Diabetes increases the risk of gum infections, making more frequent cleanings important." },
  ],
  formula: "Interval = Base 6 months, adjusted down for gum disease, smoking, diabetes, and low brushing",
};
