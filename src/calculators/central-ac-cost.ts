import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const centralAcCostCalculator: CalculatorDefinition = {
  slug: "central-ac-cost-calculator",
  title: "Central AC Cost Calculator",
  description: "Free central AC cost calculator. Estimate the cost of installing or replacing a central air conditioning system for your home.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["central AC cost", "air conditioning cost", "HVAC cost calculator", "AC installation cost", "central air cost"],
  variants: [
    {
      id: "install",
      name: "AC Installation Cost",
      fields: [
        { name: "homeSqFt", label: "Home Size (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "systemType", label: "System Type", type: "select", options: [
          { label: "Central AC (split system)", value: "split" },
          { label: "Heat pump (heating & cooling)", value: "heatpump" },
          { label: "Ductless mini-split", value: "minisplit" },
          { label: "Package unit (all-in-one)", value: "package" },
        ], defaultValue: "split" },
        { name: "efficiency", label: "Efficiency Rating", type: "select", options: [
          { label: "Standard (14-16 SEER)", value: "standard" },
          { label: "High efficiency (17-20 SEER)", value: "high" },
          { label: "Premium (21+ SEER)", value: "premium" },
        ], defaultValue: "standard" },
        { name: "existingDucts", label: "Existing Ductwork?", type: "select", options: [
          { label: "Yes - in good condition", value: "good" },
          { label: "Yes - needs repair", value: "repair" },
          { label: "No ductwork (new install)", value: "none" },
        ], defaultValue: "good" },
      ],
      calculate: (inputs) => {
        const sqft = inputs.homeSqFt as number;
        const systemType = inputs.systemType as string;
        const efficiency = inputs.efficiency as string;
        const ducts = inputs.existingDucts as string;
        if (!sqft) return null;
        // Calculate tonnage (1 ton per 500-600 sq ft)
        const tons = Math.ceil(sqft / 550 * 2) / 2; // round to nearest 0.5
        let unitCost: number;
        if (systemType === "split") unitCost = tons * 1500;
        else if (systemType === "heatpump") unitCost = tons * 2000;
        else if (systemType === "minisplit") unitCost = tons * 2500;
        else unitCost = tons * 1800;
        let efficiencyMultiplier = 1.0;
        if (efficiency === "high") efficiencyMultiplier = 1.25;
        else if (efficiency === "premium") efficiencyMultiplier = 1.6;
        unitCost *= efficiencyMultiplier;
        let ductCost = 0;
        if (ducts === "repair") ductCost = sqft * 1.5;
        else if (ducts === "none") ductCost = sqft * 5;
        const laborCost = 2000 + tons * 500;
        const permits = 300;
        const totalCost = unitCost + ductCost + laborCost + permits;
        // Estimate annual savings for high efficiency
        const annualCoolingCost = sqft * 0.15; // average $0.15/sqft/year
        const savings = efficiency === "high" ? annualCoolingCost * 0.2 : efficiency === "premium" ? annualCoolingCost * 0.35 : 0;
        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "System size", value: `${tons} tons` },
            { label: "Equipment cost", value: `$${formatNumber(unitCost)}` },
            { label: "Installation labor", value: `$${formatNumber(laborCost)}` },
            { label: "Ductwork", value: ductCost > 0 ? `$${formatNumber(ductCost)}` : "Existing (good condition)" },
            { label: "Permits", value: `$${permits}` },
            { label: "Est. annual cooling cost", value: `$${formatNumber(annualCoolingCost)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electricity-cost-calculator", "square-footage-calculator", "window-replacement-cost-calculator"],
  faq: [
    { question: "How much does central AC cost to install?", answer: "Central AC installation costs $3,500-$7,500 for a standard system with existing ductwork. High-efficiency systems: $5,000-$10,000. New ductwork adds $3,000-$10,000. Heat pumps cost $4,000-$12,000. Prices vary by region and home size." },
  ],
  formula: "Total = Unit Cost × Efficiency Factor + Ductwork + Labor + Permits | Tonnage = Home Sq Ft / 550",
};
