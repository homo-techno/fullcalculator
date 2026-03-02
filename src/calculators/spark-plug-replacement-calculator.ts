import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sparkPlugReplacementCalculator: CalculatorDefinition = {
  slug: "spark-plug-replacement-calculator",
  title: "Spark Plug Replacement Calculator",
  description: "Calculate when spark plugs need replacing and estimate total replacement cost based on plug type, engine cylinder count, and mileage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["spark plug replacement","spark plug interval","spark plug cost","ignition maintenance"],
  variants: [{
    id: "standard",
    name: "Spark Plug Replacement",
    description: "Calculate when spark plugs need replacing and estimate total replacement cost based on plug type, engine cylinder count, and mileage.",
    fields: [
      { name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 500000, defaultValue: 80000 },
      { name: "lastReplacementMileage", label: "Last Replacement Mileage", type: "number", min: 0, max: 500000, defaultValue: 30000 },
      { name: "plugType", label: "Spark Plug Type", type: "select", options: [{ value: "1", label: "Copper (30,000 mi)" }, { value: "2", label: "Platinum (60,000 mi)" }, { value: "3", label: "Double Platinum (80,000 mi)" }, { value: "4", label: "Iridium (100,000 mi)" }], defaultValue: "4" },
      { name: "cylinders", label: "Number of Cylinders", type: "select", options: [{ value: "3", label: "3 Cylinder" }, { value: "4", label: "4 Cylinder" }, { value: "5", label: "5 Cylinder" }, { value: "6", label: "6 Cylinder" }, { value: "8", label: "8 Cylinder" }], defaultValue: "4" },
      { name: "laborCost", label: "Labor Cost ($)", type: "number", min: 0, max: 500, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const current = inputs.currentMileage as number;
    const lastReplacement = inputs.lastReplacementMileage as number;
    const plugType = parseInt(inputs.plugType as string);
    const cylinders = parseInt(inputs.cylinders as string);
    const labor = inputs.laborCost as number;
    const intervals = { 1: 30000, 2: 60000, 3: 80000, 4: 100000 };
    const plugCosts = { 1: 3, 2: 8, 3: 12, 4: 15 };
    const interval = intervals[plugType] || 100000;
    const costPerPlug = plugCosts[plugType] || 15;
    const totalPartsCost = cylinders * costPerPlug;
    const totalCost = totalPartsCost + labor;
    const milesSinceLast = current - lastReplacement;
    const milesUntilDue = interval - milesSinceLast;
    return {
      primary: { label: "Next Replacement At", value: formatNumber(lastReplacement + interval) + " mi" },
      details: [
        { label: "Replacement Interval", value: formatNumber(interval) + " mi" },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilDue, 0)) },
        { label: "Plugs Needed", value: formatNumber(cylinders) },
        { label: "Parts Cost", value: "$" + formatNumber(totalPartsCost) },
        { label: "Total Cost (Parts + Labor)", value: "$" + formatNumber(totalCost) },
        { label: "Status", value: milesUntilDue <= 0 ? "Overdue" : milesUntilDue < 5000 ? "Due Soon" : "On Schedule" }
      ]
    };
  },
  }],
  relatedSlugs: ["oil-change-interval-calculator","engine-oil-capacity-calculator"],
  faq: [
    { question: "How often should spark plugs be replaced?", answer: "Copper plugs last about 30,000 miles, platinum plugs 60,000 miles, and iridium plugs can last up to 100,000 miles. Check your owner manual for the specific recommendation." },
    { question: "What happens if spark plugs are worn out?", answer: "Worn spark plugs cause misfires, poor fuel economy, rough idling, difficulty starting, and reduced engine performance. Ignoring them can damage the catalytic converter." },
    { question: "Can I replace spark plugs myself?", answer: "On many four-cylinder engines, spark plugs are accessible and DIY-friendly. V6 and V8 engines may have plugs that are harder to reach, especially on transverse-mounted engines." },
  ],
  formula: "Next Replacement = Last Replacement Mileage + Interval (by plug type)
Parts Cost = Number of Cylinders x Cost Per Plug
Total Cost = Parts Cost + Labor Cost",
};
