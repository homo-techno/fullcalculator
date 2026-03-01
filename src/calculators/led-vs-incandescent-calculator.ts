import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ledVsIncandescentCalculator: CalculatorDefinition = {
  slug: "led-vs-incandescent-calculator",
  title: "LED vs Incandescent Calculator",
  description: "Compare the cost savings and energy reduction from switching incandescent light bulbs to LED bulbs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["LED savings calculator","LED vs incandescent","light bulb savings"],
  variants: [{
    id: "standard",
    name: "LED vs Incandescent",
    description: "Compare the cost savings and energy reduction from switching incandescent light bulbs to LED bulbs.",
    fields: [
      { name: "numBulbs", label: "Number of Bulbs", type: "number", min: 1, max: 200, defaultValue: 20 },
      { name: "hoursPerDay", label: "Hours Used Per Day", type: "number", min: 0.5, max: 24, defaultValue: 5 },
      { name: "incandescentWatts", label: "Incandescent Wattage", type: "number", suffix: "W", min: 25, max: 150, defaultValue: 60 },
      { name: "ledWatts", label: "LED Equivalent Wattage", type: "number", suffix: "W", min: 2, max: 30, defaultValue: 9 },
      { name: "electricityRate", label: "Electricity Rate (per kWh)", type: "number", prefix: "$", min: 0.01, max: 1, defaultValue: 0.13 },
    ],
    calculate: (inputs) => {
      const bulbs = inputs.numBulbs as number;
      const hours = inputs.hoursPerDay as number;
      const oldWatts = inputs.incandescentWatts as number;
      const newWatts = inputs.ledWatts as number;
      const rate = inputs.electricityRate as number;
      if (!bulbs || !hours || !oldWatts || !newWatts || !rate) return null;
      const oldAnnualKwh = bulbs * oldWatts * hours * 365 / 1000;
      const newAnnualKwh = bulbs * newWatts * hours * 365 / 1000;
      const savedKwh = oldAnnualKwh - newAnnualKwh;
      const annualSavings = savedKwh * rate;
      const energyReduction = (savedKwh / oldAnnualKwh) * 100;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings * 100) / 100) },
        details: [
          { label: "Energy Saved Per Year", value: formatNumber(Math.round(savedKwh)) + " kWh" },
          { label: "Energy Reduction", value: formatNumber(Math.round(energyReduction)) + "%" },
          { label: "Old Annual Usage", value: formatNumber(Math.round(oldAnnualKwh)) + " kWh" },
          { label: "New Annual Usage", value: formatNumber(Math.round(newAnnualKwh)) + " kWh" },
        ],
      };
    },
  }],
  relatedSlugs: ["electricity-cost-calculator","insulation-savings-calculator"],
  faq: [
    { question: "How much longer do LED bulbs last compared to incandescent?", answer: "LED bulbs typically last 25,000 to 50,000 hours, while incandescent bulbs last about 1,000 hours. This means one LED bulb can outlast 25 or more incandescent bulbs." },
    { question: "Are LED bulbs worth the higher upfront cost?", answer: "Yes, LED bulbs pay for themselves within months through energy savings. Over the lifetime of an LED bulb, you can save $50 to $100 per bulb compared to using incandescent replacements." },
  ],
  formula: "Annual Savings = (Bulbs x (Old Watts - LED Watts) x Hours/Day x 365 / 1000) x Rate Per kWh",
};
