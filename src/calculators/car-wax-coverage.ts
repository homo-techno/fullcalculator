import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carWaxCoverageCalculator: CalculatorDefinition = {
  slug: "car-wax-coverage-calculator",
  title: "Car Wax Coverage Calculator",
  description: "Free car wax coverage calculator. Estimate how much wax or sealant you need based on vehicle size and product coverage rates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car wax coverage", "car wax calculator", "car polish amount", "auto wax needed", "car detailing calculator"],
  variants: [
    {
      id: "amount",
      name: "Wax Amount Needed",
      description: "Calculate how much wax is needed for your vehicle",
      fields: [
        { name: "vehicleType", label: "Vehicle Type", type: "select", options: [
          { label: "Compact car (~140 sq ft)", value: "140" },
          { label: "Sedan (~170 sq ft)", value: "170" },
          { label: "SUV/Crossover (~200 sq ft)", value: "200" },
          { label: "Full-size SUV/Truck (~240 sq ft)", value: "240" },
          { label: "Van (~260 sq ft)", value: "260" },
        ], defaultValue: "170" },
        { name: "productCoverage", label: "Product Coverage", type: "number", placeholder: "e.g. 50", suffix: "sq ft/oz" },
        { name: "coats", label: "Number of Coats", type: "number", placeholder: "e.g. 1" },
        { name: "productCost", label: "Product Cost", type: "number", placeholder: "e.g. 25", prefix: "$" },
        { name: "productSize", label: "Product Size", type: "number", placeholder: "e.g. 16", suffix: "oz" },
      ],
      calculate: (inputs) => {
        const area = parseInt(inputs.vehicleType as string) || 170;
        const coverage = (inputs.productCoverage as number) || 50;
        const coats = (inputs.coats as number) || 1;
        const cost = (inputs.productCost as number) || 0;
        const size = (inputs.productSize as number) || 16;

        const ouncesNeeded = (area / coverage) * coats;
        const applicationsPerContainer = size / ouncesNeeded;
        const costPerApplication = cost > 0 ? cost / applicationsPerContainer : 0;

        return {
          primary: { label: "Wax Needed", value: `${formatNumber(ouncesNeeded, 1)} oz` },
          details: [
            { label: "Vehicle surface area", value: `~${area} sq ft` },
            { label: "Applications per container", value: formatNumber(applicationsPerContainer, 1) },
            { label: "Cost per application", value: cost > 0 ? `$${formatNumber(costPerApplication)}` : "N/A" },
            { label: "Number of coats", value: `${coats}` },
          ],
        };
      },
    },
    {
      id: "annual",
      name: "Annual Wax Budget",
      description: "Calculate yearly waxing costs",
      fields: [
        { name: "waxFrequency", label: "Wax Frequency", type: "select", options: [
          { label: "Monthly", value: "12" },
          { label: "Every 2 months", value: "6" },
          { label: "Every 3 months", value: "4" },
          { label: "Every 6 months", value: "2" },
        ], defaultValue: "4" },
        { name: "productCostPerUse", label: "Product Cost per Application", type: "number", placeholder: "e.g. 5", prefix: "$" },
        { name: "towelsCost", label: "Microfiber Towels (Annual)", type: "number", placeholder: "e.g. 20", prefix: "$" },
        { name: "otherSupplies", label: "Other Supplies (Annual)", type: "number", placeholder: "e.g. 30", prefix: "$" },
      ],
      calculate: (inputs) => {
        const freq = parseInt(inputs.waxFrequency as string) || 4;
        const costPerUse = (inputs.productCostPerUse as number) || 0;
        const towels = (inputs.towelsCost as number) || 0;
        const other = (inputs.otherSupplies as number) || 0;

        const productCostAnnual = costPerUse * freq;
        const totalAnnual = productCostAnnual + towels + other;
        const monthlyCost = totalAnnual / 12;

        return {
          primary: { label: "Annual Waxing Cost", value: `$${formatNumber(totalAnnual)}` },
          details: [
            { label: "Wax product cost", value: `$${formatNumber(productCostAnnual)}/yr` },
            { label: "Towels cost", value: `$${formatNumber(towels)}/yr` },
            { label: "Other supplies", value: `$${formatNumber(other)}/yr` },
            { label: "Monthly average", value: `$${formatNumber(monthlyCost)}` },
            { label: "Wax applications/year", value: `${freq}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-wash-savings-calculator", "car-maintenance-cost-calculator"],
  faq: [
    { question: "How often should I wax my car?", answer: "Every 3-4 months is ideal for traditional wax. Synthetic sealants last 4-6 months, and ceramic coatings can last 1-5 years. If water no longer beads on the surface, it's time to reapply." },
    { question: "How much wax do I need per application?", answer: "Typically 2-4 ounces per application for a sedan. A 16 oz container of liquid wax usually provides 4-8 full applications. Paste wax tends to last longer per container than liquid wax." },
  ],
  formula: "Wax Needed (oz) = (Vehicle Surface Area / Product Coverage Rate) × Number of Coats",
};
