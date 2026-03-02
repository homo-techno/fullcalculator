import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petSpayNeuterCostCalculator: CalculatorDefinition = {
  slug: "pet-spay-neuter-cost-calculator",
  title: "Pet Spay Neuter Cost Calculator",
  description: "Estimate spay or neuter surgery cost based on pet type and weight.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["spay neuter cost","pet sterilization price","dog neuter cost"],
  variants: [{
    id: "standard",
    name: "Pet Spay Neuter Cost",
    description: "Estimate spay or neuter surgery cost based on pet type and weight.",
    fields: [
      { name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] },
      { name: "gender", label: "Gender", type: "select", options: [{ value: "1", label: "Female (Spay)" }, { value: "2", label: "Male (Neuter)" }] },
      { name: "weight", label: "Pet Weight (lbs)", type: "number", min: 2, max: 200, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const petType = inputs.petType as string;
    const gender = inputs.gender as string;
    const weight = inputs.weight as number;
    let baseCost = 200;
    if (petType === "2") baseCost = 150;
    if (gender === "1") baseCost += 100;
    let weightSurcharge = 0;
    if (weight > 50) weightSurcharge = 50;
    if (weight > 100) weightSurcharge = 100;
    const total = baseCost + weightSurcharge;
    const procedure = gender === "1" ? "Spay" : "Neuter";
    const petName = petType === "1" ? "Dog" : "Cat";
    return {
      primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
      details: [
        { label: "Pet Type", value: petName },
        { label: "Procedure", value: procedure },
        { label: "Base Cost", value: "$" + formatNumber(baseCost) },
        { label: "Weight Surcharge", value: "$" + formatNumber(weightSurcharge) }
      ]
    };
  },
  }],
  relatedSlugs: ["vet-visit-cost-calculator","pet-dental-cost-calculator","pet-weight-calculator"],
  faq: [
    { question: "How much does it cost to spay a dog?", answer: "Spaying a dog typically costs $200 to $500 depending on size and location." },
    { question: "Is neutering cheaper than spaying?", answer: "Yes, neutering is generally less expensive because it is a simpler procedure." },
    { question: "Are there low-cost spay neuter programs?", answer: "Many communities offer low-cost clinics that can reduce the cost to $50 to $150." },
  ],
  formula: "Total = Base Cost (by pet type and gender) + Weight Surcharge",
};
