import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paintProtectionFilmCostCalculator: CalculatorDefinition = {
  slug: "paint-protection-film-cost-calculator",
  title: "Paint Protection Film Cost Calculator",
  description: "Estimate the cost of paint protection film (PPF) installation based on coverage area, film quality, and vehicle size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["paint protection film","PPF cost","clear bra cost","car paint protection","PPF calculator"],
  variants: [{
    id: "standard",
    name: "Paint Protection Film Cost",
    description: "Estimate the cost of paint protection film (PPF) installation based on coverage area, film quality, and vehicle size.",
    fields: [
      { name: "vehicleSize", label: "Vehicle Size", type: "select", options: [{ value: "1", label: "Compact Car" }, { value: "2", label: "Mid-Size Sedan" }, { value: "3", label: "Full-Size SUV/Truck" }, { value: "4", label: "Luxury/Exotic" }], defaultValue: "2" },
      { name: "coverage", label: "Coverage Level", type: "select", options: [{ value: "1", label: "Partial Front (hood, bumper, mirrors)" }, { value: "2", label: "Full Front (add fenders, A-pillars)" }, { value: "3", label: "Full Front + Rockers" }, { value: "4", label: "Full Vehicle Wrap" }], defaultValue: "2" },
      { name: "filmQuality", label: "Film Quality", type: "select", options: [{ value: "1", label: "Budget ($)" }, { value: "2", label: "Mid-Range ($$)" }, { value: "3", label: "Premium ($$$)" }], defaultValue: "2" },
      { name: "filmLifespan", label: "Expected Film Lifespan (years)", type: "number", min: 3, max: 12, defaultValue: 7 },
    ],
    calculate: (inputs) => {
    const vehicleSize = parseInt(inputs.vehicleSize as string);
    const coverage = parseInt(inputs.coverage as string);
    const filmQuality = parseInt(inputs.filmQuality as string);
    const lifespan = inputs.filmLifespan as number;
    const baseCosts = { 1: 800, 2: 1200, 3: 1800, 4: 5000 };
    const sizeMultiplier = { 1: 0.85, 2: 1.0, 3: 1.3, 4: 1.6 };
    const qualityMultiplier = { 1: 0.7, 2: 1.0, 3: 1.5 };
    const base = baseCosts[coverage] || 1200;
    const totalCost = Math.round(base * (sizeMultiplier[vehicleSize] || 1) * (qualityMultiplier[filmQuality] || 1));
    const costPerYear = Math.round(totalCost / lifespan);
    const costPerMonth = Math.round(totalCost / (lifespan * 12) * 100) / 100;
    const sqft = { 1: 15, 2: 25, 3: 35, 4: 120 };
    const area = Math.round((sqft[coverage] || 25) * (sizeMultiplier[vehicleSize] || 1));
    return {
      primary: { label: "Estimated Total Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Coverage Area", value: formatNumber(area) + " sq ft" },
        { label: "Cost Per Year", value: "$" + formatNumber(costPerYear) },
        { label: "Cost Per Month", value: "$" + formatNumber(costPerMonth) },
        { label: "Film Lifespan", value: formatNumber(lifespan) + " years" }
      ]
    };
  },
  }],
  relatedSlugs: ["car-wax-application-calculator","car-detailing-cost-calculator"],
  faq: [
    { question: "What is paint protection film?", answer: "PPF is a clear urethane film applied to painted surfaces to protect against rock chips, scratches, bug splatter, and UV damage. High-quality films are self-healing for minor scratches." },
    { question: "How long does PPF last?", answer: "Budget films last 3 to 5 years, mid-range films 5 to 7 years, and premium films like XPEL Ultimate or 3M Pro Series can last 7 to 10 years or more with proper care." },
    { question: "Is PPF worth the investment?", answer: "For new or high-value vehicles, PPF preserves paint condition and can significantly improve resale value. The cost is often recovered through avoided paint repair and detailing expenses." },
  ],
  formula: "Total Cost = Base Cost (by coverage) x Size Multiplier x Quality Multiplier; Cost Per Year = Total Cost / Film Lifespan; Coverage Area = Base Area x Size Multiplier",
};
