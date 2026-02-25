import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kitchenCabinetCostCalculator: CalculatorDefinition = {
  slug: "kitchen-cabinet-cost-calculator",
  title: "Kitchen Cabinet Cost Calculator",
  description: "Free kitchen cabinet cost calculator. Estimate cabinet costs for new installation or refacing based on kitchen size and material choices.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["kitchen cabinet cost", "cabinet cost calculator", "how much do cabinets cost", "kitchen cabinet price", "cabinet replacement cost"],
  variants: [
    {
      id: "newCabinets",
      name: "New Cabinets",
      fields: [
        { name: "linearFeet", label: "Linear Feet of Cabinets", type: "number", placeholder: "e.g. 25" },
        { name: "cabinetGrade", label: "Cabinet Grade", type: "select", options: [
          { label: "Stock/Economy ($75-150/lin ft)", value: "112" },
          { label: "Semi-custom ($150-350/lin ft)", value: "250" },
          { label: "Custom ($350-650/lin ft)", value: "500" },
          { label: "Premium custom ($650-1200/lin ft)", value: "900" },
        ], defaultValue: "250" },
        { name: "upperCabinets", label: "Include Upper Cabinets?", type: "select", options: [
          { label: "Yes - standard (both upper & lower)", value: "1.6" },
          { label: "Lower cabinets only", value: "1.0" },
          { label: "Yes - floor to ceiling", value: "2.0" },
        ], defaultValue: "1.6" },
        { name: "countertop", label: "Include Countertops?", type: "select", options: [
          { label: "No countertops", value: "0" },
          { label: "Laminate ($20-50/sq ft)", value: "35" },
          { label: "Granite ($50-100/sq ft)", value: "75" },
          { label: "Quartz ($60-120/sq ft)", value: "90" },
          { label: "Marble ($75-200/sq ft)", value: "130" },
        ], defaultValue: "0" },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "0" },
          { label: "Professional ($50-100/lin ft)", value: "75" },
        ], defaultValue: "75" },
      ],
      calculate: (inputs) => {
        const linearFeet = inputs.linearFeet as number;
        const cabinetCost = parseInt(inputs.cabinetGrade as string) || 250;
        const upperFactor = parseFloat(inputs.upperCabinets as string) || 1.6;
        const countertopCost = parseInt(inputs.countertop as string) || 0;
        const installCost = parseInt(inputs.installation as string) || 0;
        if (!linearFeet) return null;
        const cabinetTotal = linearFeet * cabinetCost * upperFactor;
        const countertopSqFt = linearFeet * 2.1; // ~25 inch depth
        const countertopTotal = countertopCost * countertopSqFt;
        const hardware = linearFeet * 15; // handles, hinges
        const installTotal = installCost * linearFeet;
        const totalCost = cabinetTotal + countertopTotal + hardware + installTotal;
        const details = [
          { label: "Cabinet cost", value: `$${formatNumber(cabinetTotal)}` },
          { label: "Linear feet", value: `${linearFeet} ft` },
        ];
        if (countertopTotal > 0) {
          details.push({ label: "Countertop cost", value: `$${formatNumber(countertopTotal)}` });
          details.push({ label: "Countertop area", value: `${formatNumber(countertopSqFt, 1)} sq ft` });
        }
        details.push({ label: "Hardware", value: `$${formatNumber(hardware)}` });
        if (installTotal > 0) {
          details.push({ label: "Installation", value: `$${formatNumber(installTotal)}` });
        }
        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost)}` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["kitchen-remodel-cost-calculator", "bathroom-remodel-cost-calculator", "closet-organizer-cost-calculator"],
  faq: [
    { question: "How much do kitchen cabinets cost?", answer: "Stock cabinets: $75-$150 per linear foot. Semi-custom: $150-$350. Custom: $350-$650. Premium: $650-$1,200+. A typical kitchen with 25 linear feet costs $4,000-$15,000 for cabinets alone. Add 30-50% for installation, countertops, and hardware." },
  ],
  formula: "Total = (Linear Feet × Cost/Ft × Upper Factor) + Countertops + Hardware + Installation",
};
