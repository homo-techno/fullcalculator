import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wheelAlignmentFrequencyCalculator: CalculatorDefinition = {
  slug: "wheel-alignment-frequency-calculator",
  title: "Wheel Alignment Frequency Calculator",
  description: "Calculate when your next wheel alignment is due and estimate how misalignment affects tire wear cost and fuel economy.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wheel alignment","tire alignment schedule","alignment frequency","front end alignment"],
  variants: [{
    id: "standard",
    name: "Wheel Alignment Frequency",
    description: "Calculate when your next wheel alignment is due and estimate how misalignment affects tire wear cost and fuel economy.",
    fields: [
      { name: "lastAlignmentMileage", label: "Last Alignment Mileage", type: "number", min: 0, max: 500000, defaultValue: 40000 },
      { name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 500000, defaultValue: 55000 },
      { name: "roadCondition", label: "Road Conditions", type: "select", options: [{ value: "1", label: "Good (highways, smooth roads)" }, { value: "2", label: "Average (mixed roads)" }, { value: "3", label: "Poor (potholes, rough roads)" }], defaultValue: "2" },
      { name: "alignmentCost", label: "Alignment Service Cost ($)", type: "number", min: 50, max: 250, defaultValue: 100 },
      { name: "tireSetCost", label: "Cost of Tire Set ($)", type: "number", min: 200, max: 2000, defaultValue: 600 },
    ],
    calculate: (inputs) => {
    const lastAlign = inputs.lastAlignmentMileage as number;
    const current = inputs.currentMileage as number;
    const roadCond = parseInt(inputs.roadCondition as string);
    const alignCost = inputs.alignmentCost as number;
    const tireCost = inputs.tireSetCost as number;
    const intervals = { 1: 15000, 2: 12000, 3: 8000 };
    const interval = intervals[roadCond] || 12000;
    const milesSinceLast = current - lastAlign;
    const milesUntilDue = interval - milesSinceLast;
    const tireLifeReduction = milesSinceLast > interval ? Math.round((milesSinceLast - interval) / interval * 20) : 0;
    const wastedTireCost = Math.round(tireCost * tireLifeReduction / 100);
    return {
      primary: { label: "Next Alignment At", value: formatNumber(lastAlign + interval) + " mi" },
      details: [
        { label: "Recommended Interval", value: formatNumber(interval) + " mi" },
        { label: "Miles Since Last Alignment", value: formatNumber(milesSinceLast) },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilDue, 0)) },
        { label: "Est. Tire Life Reduction", value: formatNumber(tireLifeReduction) + "%" },
        { label: "Est. Wasted Tire Cost", value: "$" + formatNumber(wastedTireCost) },
        { label: "Status", value: milesUntilDue <= 0 ? "Overdue" : "On Schedule" }
      ]
    };
  },
  }],
  relatedSlugs: ["tire-rotation-schedule-calculator","tire-tread-life-calculator"],
  faq: [
    { question: "How often do I need a wheel alignment?", answer: "Most vehicles should be aligned every 10,000 to 15,000 miles or annually. If you frequently hit potholes or drive on rough roads, check alignment every 8,000 miles." },
    { question: "What does misalignment cost me?", answer: "Misalignment can reduce tire life by 25 percent or more and decrease fuel economy by up to 10 percent. A $100 alignment can save hundreds in premature tire replacement." },
    { question: "What are signs of misalignment?", answer: "Uneven tire wear, the vehicle pulling to one side, a crooked steering wheel when driving straight, and vibration in the steering wheel are common signs." },
  ],
  formula: "Alignment Interval = Base Interval (by road condition)
Next Alignment = Last Alignment Mileage + Interval
Tire Life Reduction = Overdue Miles / Interval x 20%",
};
