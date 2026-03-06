import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyFoodStageCalculator: CalculatorDefinition = {
  slug: "baby-food-stage-calculator",
  title: "Baby Food Stage Calculator",
  description: "Determine the appropriate baby food stage and estimate monthly feeding costs based on your child age and feeding preferences.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["baby food stage","infant feeding","baby food cost","solid food introduction","baby puree"],
  variants: [{
    id: "standard",
    name: "Baby Food Stage",
    description: "Determine the appropriate baby food stage and estimate monthly feeding costs based on your child age and feeding preferences.",
    fields: [
      { name: "ageMonths", label: "Baby Age (Months)", type: "number", min: 4, max: 24, defaultValue: 8 },
      { name: "jarsPerDay", label: "Jars or Pouches Per Day", type: "number", min: 1, max: 8, defaultValue: 3 },
      { name: "costPerJar", label: "Cost Per Jar/Pouch ($)", type: "number", min: 0.50, max: 3.00, defaultValue: 1.25 },
      { name: "homemadePercent", label: "Homemade Food Percentage (%)", type: "number", min: 0, max: 100, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const ageMonths = inputs.ageMonths as number;
    const jarsPerDay = inputs.jarsPerDay as number;
    const costPerJar = inputs.costPerJar as number;
    const homemadePercent = inputs.homemadePercent as number;
    var stage = 1;
    var stageLabel = "Stage 1 - Single Ingredient Purees";
    if (ageMonths >= 8) { stage = 2; stageLabel = "Stage 2 - Combo Purees and Textures"; }
    if (ageMonths >= 10) { stage = 3; stageLabel = "Stage 3 - Chunky Blends and Soft Solids"; }
    if (ageMonths >= 12) { stage = 4; stageLabel = "Table Food Transition"; }
    const storeBoughtRatio = (100 - homemadePercent) / 100;
    const monthlyJars = jarsPerDay * 30.44 * storeBoughtRatio;
    const monthlyCost = monthlyJars * costPerJar;
    const homemadeSavings = jarsPerDay * 30.44 * (homemadePercent / 100) * costPerJar * 0.6;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Feeding Stage", value: stageLabel },
      details: [
        { label: "Monthly Store-Bought Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        { label: "Monthly Homemade Savings", value: "$" + formatNumber(Math.round(homemadeSavings)) },
        { label: "Store Jars/Pouches Per Month", value: formatNumber(Math.round(monthlyJars)) },
        { label: "Annual Estimated Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["baby-formula-cost-calculator","diaper-cost-calculator","nursery-setup-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Stage = Based on age (4-6: Stage 1, 6-8: Stage 2, 8-10: Stage 3, 12+: Table Food); Monthly Cost = Jars/Day x 30.44 x Store-Bought Ratio x Cost/Jar",
};
