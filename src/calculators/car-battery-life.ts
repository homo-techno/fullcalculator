import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carBatteryLifeCalculator: CalculatorDefinition = {
  slug: "car-battery-life-calculator",
  title: "Car Battery Life Calculator",
  description: "Free car battery life calculator. Estimate remaining battery life and plan for replacement based on age, climate, and usage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car battery life", "battery replacement calculator", "car battery age", "battery life estimate", "auto battery calculator"],
  variants: [
    {
      id: "life",
      name: "Battery Life Estimate",
      description: "Estimate remaining car battery life",
      fields: [
        { name: "installDate", label: "Battery Install Year", type: "number", placeholder: "e.g. 2022" },
        { name: "climate", label: "Climate Type", type: "select", options: [
          { label: "Hot (avg > 80°F summers)", value: "hot" },
          { label: "Moderate", value: "moderate" },
          { label: "Cold (avg < 30°F winters)", value: "cold" },
        ], defaultValue: "moderate" },
        { name: "driving", label: "Driving Pattern", type: "select", options: [
          { label: "Short trips (< 20 min)", value: "short" },
          { label: "Mixed driving", value: "mixed" },
          { label: "Long commute (> 30 min)", value: "long" },
        ], defaultValue: "mixed" },
      ],
      calculate: (inputs) => {
        const installYear = inputs.installDate as number;
        const climate = inputs.climate as string;
        const driving = inputs.driving as string;
        if (!installYear) return null;

        const currentYear = new Date().getFullYear();
        const age = currentYear - installYear;

        let expectedLife = 4;
        if (climate === "hot") expectedLife -= 1;
        else if (climate === "cold") expectedLife -= 0.5;
        if (driving === "short") expectedLife -= 0.5;
        else if (driving === "long") expectedLife += 0.5;

        const remainingYears = Math.max(0, expectedLife - age);
        const healthPercent = Math.max(0, (remainingYears / expectedLife) * 100);

        return {
          primary: { label: "Estimated Remaining Life", value: `${formatNumber(remainingYears, 1)} years` },
          details: [
            { label: "Battery age", value: `${age} years` },
            { label: "Expected total life", value: `${formatNumber(expectedLife, 1)} years` },
            { label: "Battery health estimate", value: `${formatNumber(healthPercent, 0)}%` },
            { label: "Recommended replacement", value: remainingYears <= 0.5 ? "Replace soon" : `Around ${installYear + Math.round(expectedLife)}` },
          ],
        };
      },
    },
    {
      id: "cost",
      name: "Battery Replacement Cost",
      description: "Estimate battery replacement costs",
      fields: [
        { name: "batteryType", label: "Battery Type", type: "select", options: [
          { label: "Standard lead-acid", value: "standard" },
          { label: "AGM (Absorbent Glass Mat)", value: "agm" },
          { label: "Premium/Extended life", value: "premium" },
        ], defaultValue: "standard" },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "diy" },
          { label: "Professional install", value: "pro" },
        ], defaultValue: "pro" },
        { name: "expectedYears", label: "Expected Battery Life", type: "number", placeholder: "e.g. 4", suffix: "years" },
      ],
      calculate: (inputs) => {
        const batteryType = inputs.batteryType as string;
        const installation = inputs.installation as string;
        const years = (inputs.expectedYears as number) || 4;

        let batteryCost = 0;
        if (batteryType === "standard") batteryCost = 120;
        else if (batteryType === "agm") batteryCost = 220;
        else batteryCost = 180;

        const laborCost = installation === "pro" ? 40 : 0;
        const totalCost = batteryCost + laborCost;
        const costPerYear = totalCost / years;
        const costPerMonth = costPerYear / 12;

        return {
          primary: { label: "Replacement Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Battery cost", value: `$${formatNumber(batteryCost)}` },
            { label: "Installation", value: installation === "pro" ? `$${formatNumber(laborCost)}` : "DIY ($0)" },
            { label: "Cost per year", value: `$${formatNumber(costPerYear)}` },
            { label: "Cost per month", value: `$${formatNumber(costPerMonth)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-maintenance-cost-calculator", "car-total-cost-calculator"],
  faq: [
    { question: "How long does a car battery last?", answer: "Most car batteries last 3-5 years. Hot climates shorten battery life to 2-3 years, while moderate climates may allow 4-5 years. Short trips and frequent starting also reduce battery life." },
    { question: "How do I know if my car battery is dying?", answer: "Signs include slow engine cranking, dim headlights, electrical issues, the battery warning light, needing frequent jump-starts, and a swollen battery case. Most auto parts stores offer free battery testing." },
  ],
  formula: "Remaining Life = Expected Life - Battery Age (adjusted for climate and driving pattern)",
};
