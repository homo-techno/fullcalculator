import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petDentalCostCalculator: CalculatorDefinition = {
  slug: "pet-dental-cost-calculator",
  title: "Pet Dental Cost Calculator",
  description: "Estimate pet dental cleaning and extraction costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pet dental cleaning cost","dog teeth cleaning price","cat dental cost"],
  variants: [{
    id: "standard",
    name: "Pet Dental Cost",
    description: "Estimate pet dental cleaning and extraction costs.",
    fields: [
      { name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] },
      { name: "extractions", label: "Teeth Extractions Needed", type: "number", min: 0, max: 20, defaultValue: 0 },
      { name: "xrays", label: "Dental X-Rays Needed", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] },
    ],
    calculate: (inputs) => {
    const petType = inputs.petType as string;
    const extractions = inputs.extractions as number;
    const xrays = inputs.xrays as string;
    const cleaningCost = petType === "1" ? 300 : 250;
    const extractionCost = extractions * 75;
    const xrayCost = xrays === "1" ? 150 : 0;
    const anesthesiaCost = 200;
    const total = cleaningCost + extractionCost + xrayCost + anesthesiaCost;
    const petName = petType === "1" ? "Dog" : "Cat";
    return {
      primary: { label: "Estimated Total", value: "$" + formatNumber(total) },
      details: [
        { label: "Pet Type", value: petName },
        { label: "Cleaning", value: "$" + formatNumber(cleaningCost) },
        { label: "Extractions (" + extractions + ")", value: "$" + formatNumber(extractionCost) },
        { label: "X-Rays", value: "$" + formatNumber(xrayCost) },
        { label: "Anesthesia", value: "$" + formatNumber(anesthesiaCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["vet-visit-cost-calculator","pet-vaccination-schedule-calculator","pet-spay-neuter-cost-calculator"],
  faq: [
    { question: "How much does a dog dental cleaning cost?", answer: "Dog dental cleanings typically cost $300 to $700 including anesthesia." },
    { question: "Do pets need anesthesia for dental cleaning?", answer: "Yes, pets require general anesthesia for a thorough and safe dental cleaning." },
    { question: "How often should pets get dental cleanings?", answer: "Most veterinarians recommend annual dental cleanings for dogs and cats." },
  ],
  formula: "Total = Cleaning + (Extractions x $75) + X-Rays + Anesthesia",
};
