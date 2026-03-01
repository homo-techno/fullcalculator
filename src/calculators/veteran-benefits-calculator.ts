import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const veteranBenefitsCalculator: CalculatorDefinition = {
  slug: "veteran-benefits-calculator",
  title: "Veteran Benefits Calculator",
  description: "Estimate monthly VA disability compensation and education benefits based on service history and disability rating.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["VA benefits calculator", "veteran disability compensation", "VA disability pay"],
  variants: [{
    id: "standard",
    name: "Veteran Benefits",
    description: "Estimate monthly VA disability compensation and education benefits based on service history and disability rating",
    fields: [
      { name: "disabilityRating", label: "VA Disability Rating", type: "select", options: [{value:"10",label:"10%"},{value:"20",label:"20%"},{value:"30",label:"30%"},{value:"40",label:"40%"},{value:"50",label:"50%"},{value:"60",label:"60%"},{value:"70",label:"70%"},{value:"80",label:"80%"},{value:"90",label:"90%"},{value:"100",label:"100%"}], defaultValue: "30" },
      { name: "dependents", label: "Number of Dependents", type: "number", suffix: "dependents", min: 0, max: 10, defaultValue: 2 },
      { name: "serviceYears", label: "Years of Service", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 8 },
      { name: "educationBenefit", label: "Education Benefit", type: "select", options: [{value:"none",label:"Not Using"},{value:"gi",label:"Post-9/11 GI Bill"},{value:"voc",label:"Vocational Rehab"}], defaultValue: "none" },
    ],
    calculate: (inputs) => {
      const rating = parseInt(inputs.disabilityRating as string);
      const dependents = inputs.dependents as number;
      const serviceYears = inputs.serviceYears as number;
      const education = inputs.educationBenefit as string;
      if (!rating) return null;
      const baseRates: Record<number, number> = { 10: 171, 20: 338, 30: 524, 40: 755, 50: 1075, 60: 1361, 70: 1716, 80: 1995, 90: 2241, 100: 3737 };
      const baseComp = baseRates[rating] || 0;
      const depBonus = rating >= 30 ? dependents * (rating >= 70 ? 150 : 100) : 0;
      const monthlyComp = baseComp + depBonus;
      const annualComp = monthlyComp * 12;
      let educationValue = 0;
      if (education === "gi") educationValue = 27120;
      else if (education === "voc") educationValue = 20000;
      const totalAnnualBenefits = annualComp + educationValue;
      return {
        primary: { label: "Monthly Disability Compensation", value: "$" + formatNumber(Math.round(monthlyComp)) },
        details: [
          { label: "Annual Compensation", value: "$" + formatNumber(Math.round(annualComp)) },
          { label: "Annual Education Benefit", value: education === "none" ? "Not applicable" : "$" + formatNumber(educationValue) },
          { label: "Total Annual Benefits", value: "$" + formatNumber(Math.round(totalAnnualBenefits)) },
        ],
      };
    },
  }],
  relatedSlugs: ["disability-benefits-calculator", "workers-comp-calculator"],
  faq: [
    { question: "How is VA disability compensation calculated?", answer: "VA disability compensation is based on a combined disability rating percentage, with higher ratings receiving more monthly compensation. Veterans rated 30 percent or higher also receive additional payments for dependents." },
    { question: "What is the Post-9/11 GI Bill?", answer: "The Post-9/11 GI Bill provides up to 36 months of education benefits covering tuition and fees, a monthly housing allowance, and a book stipend for veterans who served on active duty after September 10, 2001." },
  ],
  formula: "Monthly Compensation = Base Rate for Rating + (Dependents x Dependent Bonus)",
};
