import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carWaxApplicationCalculator: CalculatorDefinition = {
  slug: "car-wax-application-calculator",
  title: "Car Wax Application Calculator",
  description: "Calculate your car wax schedule, annual cost, and product usage based on wax type, vehicle size, and application frequency.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car wax schedule","wax application","car paint protection","wax cost calculator"],
  variants: [{
    id: "standard",
    name: "Car Wax Application",
    description: "Calculate your car wax schedule, annual cost, and product usage based on wax type, vehicle size, and application frequency.",
    fields: [
      { name: "vehicleSize", label: "Vehicle Size", type: "select", options: [{ value: "1", label: "Compact Car" }, { value: "2", label: "Mid-Size Sedan" }, { value: "3", label: "Full-Size SUV" }, { value: "4", label: "Truck" }], defaultValue: "2" },
      { name: "waxType", label: "Wax Type", type: "select", options: [{ value: "1", label: "Paste Wax (2-3 month durability)" }, { value: "2", label: "Liquid Wax (2-4 month)" }, { value: "3", label: "Spray Wax (2-4 weeks)" }, { value: "4", label: "Ceramic Coating (6-12 month)" }], defaultValue: "2" },
      { name: "productCost", label: "Product Cost ($)", type: "number", min: 5, max: 200, defaultValue: 25 },
      { name: "applicationsPerBottle", label: "Applications Per Bottle", type: "number", min: 1, max: 20, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const vehicleSize = parseInt(inputs.vehicleSize as string);
    const waxType = parseInt(inputs.waxType as string);
    const productCost = inputs.productCost as number;
    const appsPerBottle = inputs.applicationsPerBottle as number;
    const durabilityMonths = { 1: 2.5, 2: 3, 3: 0.75, 4: 9 };
    const sizeMultiplier = { 1: 0.8, 2: 1.0, 3: 1.4, 4: 1.5 };
    const monthsDuration = durabilityMonths[waxType] || 3;
    const applicationsPerYear = Math.round(12 / monthsDuration * 10) / 10;
    const sizeMult = sizeMultiplier[vehicleSize] || 1;
    const adjustedAppsPerBottle = Math.round(appsPerBottle / sizeMult);
    const bottlesPerYear = Math.ceil(applicationsPerYear / adjustedAppsPerBottle);
    const annualCost = bottlesPerYear * productCost;
    const costPerApplication = Math.round(productCost / adjustedAppsPerBottle * 100) / 100;
    return {
      primary: { label: "Applications Per Year", value: formatNumber(Math.ceil(applicationsPerYear)) },
      details: [
        { label: "Wax Durability", value: formatNumber(monthsDuration) + " months" },
        { label: "Cost Per Application", value: "$" + formatNumber(costPerApplication) },
        { label: "Bottles Per Year", value: formatNumber(bottlesPerYear) },
        { label: "Annual Wax Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["car-wash-frequency-cost-calculator","paint-protection-film-cost-calculator"],
  faq: [
    { question: "How often should I wax my car?", answer: "Paste and liquid waxes typically last 2 to 4 months. Spray waxes last only a few weeks. Ceramic coatings can protect for 6 to 12 months or longer depending on the product." },
    { question: "Does waxing actually protect paint?", answer: "Yes, wax provides a sacrificial layer that shields paint from UV rays, bird droppings, tree sap, and minor scratches. Regular waxing preserves paint condition and resale value." },
    { question: "Is ceramic coating better than wax?", answer: "Ceramic coatings last longer and provide superior protection, but cost significantly more upfront. Traditional wax is easier to apply and more affordable for regular maintenance." },
  ],
  formula: "Applications Per Year = 12 / Durability (months)
Cost Per Application = Product Cost / Applications Per Bottle (adjusted for vehicle size)
Annual Cost = Bottles Per Year x Product Cost",
};
