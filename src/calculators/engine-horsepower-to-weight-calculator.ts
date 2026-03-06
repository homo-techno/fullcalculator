import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const engineHorsepowerToWeightCalculator: CalculatorDefinition = {
  slug: "engine-horsepower-to-weight-calculator",
  title: "Engine Horsepower-to-Weight Ratio Calculator",
  description: "Calculate your vehicle power-to-weight ratio and compare performance potential based on horsepower, torque, and curb weight.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["horsepower to weight ratio","power to weight","car performance calculator","HP per ton"],
  variants: [{
    id: "standard",
    name: "Engine Horsepower-to-Weight Ratio",
    description: "Calculate your vehicle power-to-weight ratio and compare performance potential based on horsepower, torque, and curb weight.",
    fields: [
      { name: "horsepower", label: "Engine Horsepower (HP)", type: "number", min: 50, max: 2000, defaultValue: 300 },
      { name: "torque", label: "Engine Torque (lb-ft)", type: "number", min: 50, max: 2000, defaultValue: 280 },
      { name: "curbWeight", label: "Curb Weight (lbs)", type: "number", min: 1000, max: 10000, defaultValue: 3500 },
      { name: "driverWeight", label: "Driver + Passenger Weight (lbs)", type: "number", min: 100, max: 600, defaultValue: 180 },
    ],
    calculate: (inputs) => {
    const hp = inputs.horsepower as number;
    const torque = inputs.torque as number;
    const curb = inputs.curbWeight as number;
    const driver = inputs.driverWeight as number;
    const totalWeight = curb + driver;
    const hpPerTon = Math.round(hp / (totalWeight / 2000) * 10) / 10;
    const lbsPerHp = Math.round(totalWeight / hp * 10) / 10;
    const torquePerTon = Math.round(torque / (totalWeight / 2000) * 10) / 10;
    let classification = "";
    if (hpPerTon > 400) classification = "Supercar Territory";
    else if (hpPerTon > 250) classification = "Sports Car";
    else if (hpPerTon > 150) classification = "Quick";
    else if (hpPerTon > 100) classification = "Average";
    else classification = "Economy";
    return {
      primary: { label: "HP Per Ton", value: formatNumber(hpPerTon) },
      details: [
        { label: "Lbs Per HP", value: formatNumber(lbsPerHp) + " lbs/HP" },
        { label: "Torque Per Ton", value: formatNumber(torquePerTon) + " lb-ft/ton" },
        { label: "Total Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Performance Class", value: classification }
      ]
    };
  },
  }],
  relatedSlugs: ["zero-to-sixty-time-calculator","quarter-mile-time-calculator"],
  faq: [
    { question: "What is a good power-to-weight ratio?", answer: "A ratio above 200 HP per ton is considered quick, above 300 is sports car territory, and above 400 puts you in supercar range. The average family sedan is around 100 to 150 HP per ton." },
    { question: "Is horsepower or torque more important?", answer: "Horsepower determines top speed and high-RPM acceleration, while torque determines low-end pulling power and responsiveness. For everyday driving, torque often feels more impactful." },
    { question: "How does weight affect acceleration?", answer: "Every 100 pounds of additional weight reduces acceleration by roughly 1 to 2 percent. Removing unnecessary weight is one of the most cost-effective ways to improve performance." },
  ],
  formula: "HP Per Ton = Horsepower / (Total Weight / 2000); Lbs Per HP = Total Weight / Horsepower; Total Weight = Curb Weight + Occupant Weight",
};
