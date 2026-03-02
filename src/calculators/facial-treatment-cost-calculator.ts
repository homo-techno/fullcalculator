import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const facialTreatmentCostCalculator: CalculatorDefinition = {
  slug: "facial-treatment-cost-calculator",
  title: "Facial Treatment Cost Calculator",
  description: "Estimate the cost of professional facial treatments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["facial cost","facial treatment price","skin treatment cost"],
  variants: [{
    id: "standard",
    name: "Facial Treatment Cost",
    description: "Estimate the cost of professional facial treatments.",
    fields: [
      { name: "facialType", label: "Facial Type", type: "select", options: [{ value: "80", label: "Basic Facial" }, { value: "150", label: "HydraFacial" }, { value: "200", label: "LED Light Therapy" }, { value: "250", label: "Microcurrent Facial" }] },
      { name: "addOns", label: "Add-On Treatments ($)", type: "number", min: 0, max: 200, defaultValue: 0 },
      { name: "visitsPerYear", label: "Visits Per Year", type: "number", min: 1, max: 24, defaultValue: 6 },
      { name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const facialType = parseInt(inputs.facialType as string);
    const addOns = inputs.addOns as number;
    const visitsPerYear = inputs.visitsPerYear as number;
    const tip = inputs.tip as number;
    const perVisit = facialType + addOns;
    const tipAmount = perVisit * (tip / 100);
    const totalPerVisit = perVisit + tipAmount;
    const annualCost = totalPerVisit * visitsPerYear;
    return {
      primary: { label: "Annual Facial Cost", value: "$" + formatNumber(annualCost) },
      details: [
        { label: "Cost Per Visit", value: "$" + formatNumber(totalPerVisit) },
        { label: "Tip Per Visit", value: "$" + formatNumber(tipAmount) },
        { label: "Monthly Average", value: "$" + formatNumber(annualCost / 12) }
      ]
    };
  },
  }],
  relatedSlugs: ["spa-day-cost-calculator","chemical-peel-cost-calculator"],
  faq: [
    { question: "How much does a facial cost?", answer: "Basic facials cost $60 to $100. Specialized facials cost $150 to $300." },
    { question: "How often should you get a facial?", answer: "Every 4 to 6 weeks is recommended for most skin types." },
    { question: "Are expensive facials worth it?", answer: "Advanced treatments offer deeper results but basic facials also benefit skin." },
  ],
  formula: "Annual Cost = (Facial Price + Add-Ons) x (1 + Tip%) x Visits",
};
