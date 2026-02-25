import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tireWearCalculator: CalculatorDefinition = {
  slug: "tire-wear-calculator",
  title: "Tire Wear Calculator",
  description: "Free tire wear calculator. Estimate remaining tire life based on tread depth, driving habits, and mileage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tire wear calculator", "tire life calculator", "tread depth calculator", "tire replacement calculator", "tire mileage calculator"],
  variants: [
    {
      id: "remaining",
      name: "Remaining Tire Life",
      description: "Calculate remaining tire life from tread depth",
      fields: [
        { name: "currentTread", label: "Current Tread Depth", type: "number", placeholder: "e.g. 6", suffix: "/32 in" },
        { name: "newTread", label: "New Tire Tread Depth", type: "number", placeholder: "e.g. 10", suffix: "/32 in" },
        { name: "minTread", label: "Minimum Safe Tread", type: "number", placeholder: "e.g. 2", suffix: "/32 in" },
        { name: "tireLifeMiles", label: "Rated Tire Life", type: "number", placeholder: "e.g. 60000", suffix: "miles" },
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
      ],
      calculate: (inputs) => {
        const current = inputs.currentTread as number;
        const newTread = (inputs.newTread as number) || 10;
        const minTread = (inputs.minTread as number) || 2;
        const ratedLife = (inputs.tireLifeMiles as number) || 60000;
        const annualMiles = (inputs.annualMiles as number) || 12000;
        if (!current) return null;

        const usableTread = newTread - minTread;
        const remainingTread = current - minTread;
        const percentRemaining = Math.max(0, (remainingTread / usableTread) * 100);
        const remainingMiles = (remainingTread / usableTread) * ratedLife;
        const monthsRemaining = annualMiles > 0 ? (remainingMiles / annualMiles) * 12 : 0;

        return {
          primary: { label: "Tire Life Remaining", value: `${formatNumber(percentRemaining, 0)}%` },
          details: [
            { label: "Estimated miles remaining", value: `${formatNumber(remainingMiles, 0)} miles` },
            { label: "Estimated months remaining", value: `${formatNumber(monthsRemaining, 0)} months` },
            { label: "Usable tread remaining", value: `${formatNumber(remainingTread, 1)}/32 in` },
            { label: "Current tread depth", value: `${current}/32 in` },
            { label: "Replace at", value: `${minTread}/32 in` },
          ],
        };
      },
    },
    {
      id: "cost",
      name: "Tire Cost per Mile",
      description: "Calculate the per-mile cost of your tires",
      fields: [
        { name: "tireSetCost", label: "Cost for Set of 4 Tires", type: "number", placeholder: "e.g. 600", prefix: "$" },
        { name: "installCost", label: "Installation Cost", type: "number", placeholder: "e.g. 80", prefix: "$" },
        { name: "expectedMiles", label: "Expected Tire Life", type: "number", placeholder: "e.g. 60000", suffix: "miles" },
      ],
      calculate: (inputs) => {
        const tireCost = inputs.tireSetCost as number;
        const install = (inputs.installCost as number) || 0;
        const miles = inputs.expectedMiles as number;
        if (!tireCost || !miles) return null;

        const totalCost = tireCost + install;
        const costPerMile = totalCost / miles;
        const costPer1000 = costPerMile * 1000;

        return {
          primary: { label: "Cost per Mile", value: `$${formatNumber(costPerMile, 4)}` },
          details: [
            { label: "Total tire investment", value: `$${formatNumber(totalCost)}` },
            { label: "Cost per 1,000 miles", value: `$${formatNumber(costPer1000)}` },
            { label: "Cost per tire", value: `$${formatNumber(tireCost / 4)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-maintenance-cost-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "When should I replace my tires?", answer: "Replace tires when tread depth reaches 2/32 inch (the legal minimum). Many experts recommend replacing at 4/32 inch for wet weather safety. Use the penny test: if you can see all of Lincoln's head, it's time to replace." },
    { question: "How long do tires last?", answer: "Most tires last 40,000-80,000 miles depending on the tire type, driving habits, and road conditions. Even unused tires should be replaced after 6-10 years due to rubber degradation." },
  ],
  formula: "Remaining Life % = (Current Tread - Min Tread) / (New Tread - Min Tread) × 100",
};
