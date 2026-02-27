import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const contactLensCostCalculator: CalculatorDefinition = {
  slug: "contact-lens-cost-calculator",
  title: "Contact Lens Cost Calculator",
  description: "Free contact lens cost calculator. Get personalized health insights based on your profile.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["contact lens cost calculator", "health calculator", "medical calculator"],
  variants: [
    {
      id: "standard",
      name: "Contact Lens Cost",
      description: "Free contact lens cost calculator. Get personalized health insights based on you",
      fields: [
        {
          name: "baseCost",
          label: "Base Cost",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        },
        {
          name: "frequency",
          label: "Frequency per Year",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 365,
        },
        {
          name: "years",
          label: "Number of Years",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "years",
          min: 1,
          max: 30,
        },
        {
          name: "inflation",
          label: "Annual Cost Increase",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
          min: 0,
          max: 20,
          defaultValue: 3,
        }
      ],
      calculate: (inputs) => {
        const base = inputs.baseCost as number;
        const freq = inputs.frequency as number;
        const years = inputs.years as number;
        const inflation = (inputs.inflation as number) / 100;
        if (!base || !freq || !years) return null;
        let total = 0;
        for (let y = 0; y < years; y++) { total += base * freq * Math.pow(1 + inflation, y); }
        const annual = base * freq;
        return {
          primary: { label: "Total Cost", value: "$" + formatNumber(total) },
          details: [
            { label: "Annual cost (year 1)", value: "$" + formatNumber(annual) },
            { label: "Monthly cost (year 1)", value: "$" + formatNumber(annual / 12) },
            { label: "Cost in final year", value: "$" + formatNumber(annual * Math.pow(1 + inflation, years - 1)) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How does the contact lens cost work?",
      answer: "This calculator uses evidence-based formulas to provide estimates. Always consult a healthcare professional for medical advice.",
    },
    {
      question: "Is this calculator medically accurate?",
      answer: "This tool provides general estimates for educational purposes. Individual needs may vary based on health conditions, medications, and other factors.",
    }
  ],
  formula: "Score based on individual health factors",
};
