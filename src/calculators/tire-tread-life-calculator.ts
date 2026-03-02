import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tireTreadLifeCalculator: CalculatorDefinition = {
  slug: "tire-tread-life-calculator",
  title: "Tire Tread Life Calculator",
  description: "Estimate remaining tire life and replacement timeline based on current tread depth, wear rate, and driving habits.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tire tread life","tire wear calculator","tread depth","tire replacement timeline"],
  variants: [{
    id: "standard",
    name: "Tire Tread Life",
    description: "Estimate remaining tire life and replacement timeline based on current tread depth, wear rate, and driving habits.",
    fields: [
      { name: "currentTread", label: "Current Tread Depth (32nds of inch)", type: "number", min: 1, max: 12, defaultValue: 6 },
      { name: "originalTread", label: "Original Tread Depth (32nds)", type: "number", min: 8, max: 14, defaultValue: 10 },
      { name: "milesDriven", label: "Miles Driven on These Tires", type: "number", min: 100, max: 100000, defaultValue: 25000 },
      { name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1200 },
      { name: "tireSetCost", label: "Replacement Tire Set Cost ($)", type: "number", min: 200, max: 3000, defaultValue: 600 },
    ],
    calculate: (inputs) => {
    const current = inputs.currentTread as number;
    const original = inputs.originalTread as number;
    const milesDriven = inputs.milesDriven as number;
    const monthly = inputs.monthlyMiles as number;
    const tireCost = inputs.tireSetCost as number;
    const minimumTread = 2;
    const usableTreadWorn = original - current;
    const usableTreadRemaining = current - minimumTread;
    const wearRate = usableTreadWorn > 0 ? milesDriven / usableTreadWorn : 0;
    const milesRemaining = Math.round(usableTreadRemaining * wearRate);
    const monthsRemaining = monthly > 0 ? Math.round(milesRemaining / monthly * 10) / 10 : 0;
    const percentWorn = Math.round(usableTreadWorn / (original - minimumTread) * 100);
    const costPerMile = milesDriven > 0 ? Math.round(tireCost / (milesDriven + milesRemaining) * 10000) / 10000 : 0;
    return {
      primary: { label: "Estimated Miles Remaining", value: formatNumber(milesRemaining) + " mi" },
      details: [
        { label: "Months Until Replacement", value: formatNumber(monthsRemaining) },
        { label: "Tread Worn", value: formatNumber(percentWorn) + "%" },
        { label: "Wear Rate", value: formatNumber(Math.round(wearRate)) + " mi per 1/32 inch" },
        { label: "Cost Per Mile", value: "$" + formatNumber(costPerMile) },
        { label: "Status", value: current <= 2 ? "Replace Now" : current <= 4 ? "Replace Soon" : "Good" }
      ]
    };
  },
  }],
  relatedSlugs: ["tire-rotation-schedule-calculator","wheel-alignment-frequency-calculator"],
  faq: [
    { question: "What is the minimum safe tread depth?", answer: "The legal minimum is 2/32 of an inch in most states, but tire performance drops significantly below 4/32. In rain, tires with less than 4/32 tread have substantially reduced grip." },
    { question: "How do I measure tread depth?", answer: "Use a tread depth gauge or the penny test. Insert a penny head-first into the tread. If you can see all of Lincoln head, your tread is below 2/32 and tires need replacement." },
    { question: "Do front tires wear faster than rear tires?", answer: "On front-wheel-drive vehicles, front tires typically wear faster due to steering and drivetrain forces. Regular rotation every 5,000 to 7,500 miles helps equalize wear across all four tires." },
  ],
  formula: "Wear Rate = Miles Driven / Tread Worn (32nds)
Miles Remaining = Usable Tread Left x Wear Rate
Usable Tread Left = Current Depth - Minimum (2/32)",
};
