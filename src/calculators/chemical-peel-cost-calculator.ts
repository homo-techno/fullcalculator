import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chemicalPeelCostCalculator: CalculatorDefinition = {
  slug: "chemical-peel-cost-calculator",
  title: "Chemical Peel Cost Calculator",
  description: "Calculate chemical peel treatment cost and series pricing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["chemical peel cost","skin peel price","chemical peel pricing"],
  variants: [{
    id: "standard",
    name: "Chemical Peel Cost",
    description: "Calculate chemical peel treatment cost and series pricing.",
    fields: [
      { name: "peelType", label: "Peel Type", type: "select", options: [{ value: "100", label: "Light/Superficial" }, { value: "250", label: "Medium Depth" }, { value: "500", label: "Deep Peel" }] },
      { name: "sessionsInSeries", label: "Sessions in Series", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "seriesDiscount", label: "Series Discount (%)", type: "number", min: 0, max: 30, defaultValue: 10 },
      { name: "consultFee", label: "Consultation Fee ($)", type: "number", min: 0, max: 200, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const peelType = parseInt(inputs.peelType as string);
    const sessionsInSeries = inputs.sessionsInSeries as number;
    const seriesDiscount = inputs.seriesDiscount as number;
    const consultFee = inputs.consultFee as number;
    const fullPrice = peelType * sessionsInSeries;
    const discountAmount = fullPrice * (seriesDiscount / 100);
    const seriesPrice = fullPrice - discountAmount + consultFee;
    const perSession = (seriesPrice - consultFee) / sessionsInSeries;
    return {
      primary: { label: "Total Series Cost", value: "$" + formatNumber(seriesPrice) },
      details: [
        { label: "Full Price Before Discount", value: "$" + formatNumber(fullPrice) },
        { label: "Discount Savings", value: "$" + formatNumber(discountAmount) },
        { label: "Effective Cost Per Session", value: "$" + formatNumber(perSession) }
      ]
    };
  },
  }],
  relatedSlugs: ["facial-treatment-cost-calculator","laser-hair-removal-calculator"],
  faq: [
    { question: "How much does a chemical peel cost?", answer: "Light peels cost $100 to $200. Deep peels can cost $500 or more." },
    { question: "How many chemical peels do I need?", answer: "A series of 3 to 6 light peels is common. Deep peels may need only one." },
    { question: "How often can you get a chemical peel?", answer: "Light peels every 2 to 4 weeks. Deep peels only once every few years." },
  ],
  formula: "Series Cost = (Peel Price x Sessions) x (1 - Discount%) + Consultation Fee",
};
