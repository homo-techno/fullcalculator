import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const massageCostCalculator: CalculatorDefinition = {
  slug: "massage-cost-calculator",
  title: "Massage Cost Calculator",
  description: "Estimate massage session cost based on type and duration.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["massage cost","massage price","massage session cost"],
  variants: [{
    id: "standard",
    name: "Massage Cost",
    description: "Estimate massage session cost based on type and duration.",
    fields: [
      { name: "massageType", label: "Massage Type", type: "select", options: [{ value: "80", label: "Swedish" }, { value: "100", label: "Deep Tissue" }, { value: "120", label: "Hot Stone" }, { value: "140", label: "Sports Massage" }] },
      { name: "duration", label: "Duration", type: "select", options: [{ value: "0.75", label: "30 Minutes" }, { value: "1", label: "60 Minutes" }, { value: "1.4", label: "90 Minutes" }, { value: "1.75", label: "120 Minutes" }] },
      { name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 },
      { name: "visitsPerMonth", label: "Visits Per Month", type: "number", min: 1, max: 8, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const massageType = parseInt(inputs.massageType as string);
    const duration = parseFloat(inputs.duration as string);
    const tip = inputs.tip as number;
    const visitsPerMonth = inputs.visitsPerMonth as number;
    const sessionCost = massageType * duration;
    const tipAmount = sessionCost * (tip / 100);
    const totalPerVisit = sessionCost + tipAmount;
    const monthlyCost = totalPerVisit * visitsPerMonth;
    return {
      primary: { label: "Monthly Massage Cost", value: "$" + formatNumber(monthlyCost) },
      details: [
        { label: "Per Session", value: "$" + formatNumber(sessionCost) },
        { label: "Tip Per Session", value: "$" + formatNumber(tipAmount) },
        { label: "Annual Cost", value: "$" + formatNumber(monthlyCost * 12) }
      ]
    };
  },
  }],
  relatedSlugs: ["spa-day-cost-calculator","waxing-cost-calculator"],
  faq: [
    { question: "How much does a massage cost?", answer: "A 60-minute massage typically costs $60 to $120 depending on type." },
    { question: "How often should you get a massage?", answer: "Once or twice per month is beneficial for stress relief and recovery." },
    { question: "Is deep tissue more expensive?", answer: "Deep tissue massages usually cost $10 to $30 more than Swedish massage." },
  ],
  formula: "Monthly = (Type Base x Duration Multiplier) x (1 + Tip%) x Visits",
};
