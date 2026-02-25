import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hardwoodFloorCostCalculator: CalculatorDefinition = {
  slug: "hardwood-floor-cost-calculator",
  title: "Hardwood Floor Cost Calculator",
  description: "Free hardwood floor cost calculator. Estimate the total cost of hardwood flooring including materials, installation, and finishing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hardwood floor cost", "hardwood flooring calculator", "wood floor cost", "flooring cost estimator", "hardwood installation cost"],
  variants: [
    {
      id: "install",
      name: "Hardwood Installation",
      fields: [
        { name: "sqft", label: "Area (sq ft)", type: "number", placeholder: "e.g. 500" },
        { name: "woodType", label: "Wood Type", type: "select", options: [
          { label: "Oak (solid) - $3-8/sq ft", value: "5.5" },
          { label: "Maple (solid) - $5-10/sq ft", value: "7.5" },
          { label: "Cherry (solid) - $6-12/sq ft", value: "9" },
          { label: "Walnut (solid) - $8-14/sq ft", value: "11" },
          { label: "Engineered hardwood - $3-10/sq ft", value: "6" },
          { label: "Bamboo - $2-8/sq ft", value: "5" },
        ], defaultValue: "5.5" },
        { name: "installType", label: "Installation Method", type: "select", options: [
          { label: "Nail down ($3-5/sq ft labor)", value: "4" },
          { label: "Glue down ($4-6/sq ft labor)", value: "5" },
          { label: "Floating ($2-4/sq ft labor)", value: "3" },
          { label: "DIY (no labor)", value: "0" },
        ], defaultValue: "4" },
        { name: "subfloor", label: "Subfloor Prep", type: "select", options: [
          { label: "None needed", value: "0" },
          { label: "Minor leveling ($1-2/sq ft)", value: "1.5" },
          { label: "Remove old flooring ($1-3/sq ft)", value: "2" },
          { label: "Major subfloor repair ($3-5/sq ft)", value: "4" },
        ], defaultValue: "0" },
        { name: "finish", label: "Finishing", type: "select", options: [
          { label: "Pre-finished (no extra cost)", value: "0" },
          { label: "Site-finished ($2-4/sq ft)", value: "3" },
        ], defaultValue: "0" },
        { name: "waste", label: "Waste Factor", type: "select", options: [
          { label: "10% (standard)", value: "10" },
          { label: "15% (diagonal/complex)", value: "15" },
          { label: "5% (simple rectangle)", value: "5" },
        ], defaultValue: "10" },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const materialCost = parseFloat(inputs.woodType as string) || 5.5;
        const laborCost = parseFloat(inputs.installType as string) || 0;
        const subfloorCost = parseFloat(inputs.subfloor as string) || 0;
        const finishCost = parseFloat(inputs.finish as string) || 0;
        const wastePct = parseInt(inputs.waste as string) || 10;
        if (!sqft) return null;
        const materialSqFt = sqft * (1 + wastePct / 100);
        const totalMaterial = materialSqFt * materialCost;
        const totalLabor = sqft * laborCost;
        const totalSubfloor = sqft * subfloorCost;
        const totalFinish = sqft * finishCost;
        const underlayment = sqft * 0.50;
        const totalCost = totalMaterial + totalLabor + totalSubfloor + totalFinish + underlayment;
        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Material cost", value: `$${formatNumber(totalMaterial)}` },
            { label: "Material needed (with waste)", value: `${formatNumber(materialSqFt, 0)} sq ft` },
            { label: "Labor cost", value: laborCost > 0 ? `$${formatNumber(totalLabor)}` : "DIY" },
            { label: "Subfloor prep", value: subfloorCost > 0 ? `$${formatNumber(totalSubfloor)}` : "None" },
            { label: "Finishing", value: finishCost > 0 ? `$${formatNumber(totalFinish)}` : "Pre-finished" },
            { label: "Underlayment", value: `$${formatNumber(underlayment)}` },
            { label: "Cost per sq ft", value: `$${formatNumber(totalCost / sqft)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tile-calculator", "square-footage-calculator", "kitchen-remodel-cost-calculator"],
  faq: [
    { question: "How much does hardwood flooring cost?", answer: "Materials: $3-$14 per sq ft depending on species. Installation: $2-$6 per sq ft. Total installed cost: $6-$18 per sq ft. A 500 sq ft room typically costs $3,000-$9,000 total. Engineered hardwood is generally 20-30% less than solid hardwood." },
  ],
  formula: "Total = (Sq Ft × (1 + Waste%) × Material/SqFt) + (Sq Ft × Labor/SqFt) + Subfloor + Finish + Underlayment",
};
