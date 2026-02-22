import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const energyAuditCalculator: CalculatorDefinition = {
  slug: "energy-audit-calculator",
  title: "Home Energy Audit Calculator",
  description:
    "Free home energy audit calculator. Identify energy waste and estimate savings from improvements to insulation, HVAC, lighting, and appliances.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "energy audit",
    "home energy",
    "energy efficiency",
    "energy waste",
    "home energy savings",
    "energy assessment",
  ],
  variants: [
    {
      id: "audit",
      name: "Energy Audit Assessment",
      fields: [
        {
          name: "monthlyBill",
          label: "Monthly Energy Bill ($)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "homeAge",
          label: "Home Age",
          type: "select",
          options: [
            { label: "New (0-10 years)", value: "new" },
            { label: "Moderate (10-30 years)", value: "moderate" },
            { label: "Old (30-50 years)", value: "old" },
            { label: "Very Old (50+ years)", value: "veryold" },
          ],
        },
        {
          name: "insulationQuality",
          label: "Insulation Quality",
          type: "select",
          options: [
            { label: "Excellent", value: "excellent" },
            { label: "Good", value: "good" },
            { label: "Fair", value: "fair" },
            { label: "Poor", value: "poor" },
          ],
        },
        {
          name: "hvacAge",
          label: "HVAC System Age (years)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "lightingType",
          label: "Primary Lighting",
          type: "select",
          options: [
            { label: "LED", value: "led" },
            { label: "CFL", value: "cfl" },
            { label: "Incandescent", value: "incandescent" },
            { label: "Mixed", value: "mixed" },
          ],
        },
      ],
      calculate: (inputs) => {
        const monthlyBill = inputs.monthlyBill as number;
        const homeAge = (inputs.homeAge as string) || "moderate";
        const insulation = (inputs.insulationQuality as string) || "fair";
        const hvacAge = (inputs.hvacAge as number) || 10;
        const lighting = (inputs.lightingType as string) || "mixed";
        if (!monthlyBill) return null;

        const annualBill = monthlyBill * 12;

        // Estimated waste percentages
        const insulationWaste: Record<string, number> = { excellent: 0.02, good: 0.05, fair: 0.12, poor: 0.22 };
        const ageWaste: Record<string, number> = { new: 0.02, moderate: 0.08, old: 0.15, veryold: 0.22 };
        const lightingWaste: Record<string, number> = { led: 0.01, cfl: 0.03, mixed: 0.06, incandescent: 0.12 };
        const hvacWaste = hvacAge > 20 ? 0.15 : hvacAge > 15 ? 0.10 : hvacAge > 10 ? 0.06 : 0.02;

        const totalWasteRate = Math.min(
          (insulationWaste[insulation] || 0.12) +
          (ageWaste[homeAge] || 0.08) +
          (lightingWaste[lighting] || 0.06) +
          hvacWaste,
          0.50
        );

        const wastedDollars = annualBill * totalWasteRate;
        const potentialSavings = wastedDollars * 0.7; // 70% of waste is recoverable
        const co2Savings = (potentialSavings / (monthlyBill / 900)) * 0.417; // rough kWh to CO2

        return {
          primary: {
            label: "Estimated Annual Savings",
            value: "$" + formatNumber(potentialSavings, 0),
          },
          details: [
            { label: "Annual Energy Bill", value: "$" + formatNumber(annualBill, 0) },
            { label: "Estimated Waste Rate", value: formatNumber(totalWasteRate * 100, 1) + "%" },
            { label: "Annual Wasted Energy Cost", value: "$" + formatNumber(wastedDollars, 0) },
            { label: "Insulation Waste", value: formatNumber((insulationWaste[insulation] || 0) * 100, 0) + "%" },
            { label: "HVAC Waste", value: formatNumber(hvacWaste * 100, 0) + "%" },
            { label: "Lighting Waste", value: formatNumber((lightingWaste[lighting] || 0) * 100, 0) + "%" },
          ],
          note: "These are estimates. A professional energy audit with blower door testing and thermal imaging provides more precise results. Many utilities offer free or subsidized audits.",
        };
      },
    },
  ],
  relatedSlugs: ["insulation-savings-calculator", "led-savings-calculator"],
  faq: [
    {
      question: "What does a home energy audit check?",
      answer:
        "A comprehensive energy audit examines insulation levels, air leakage, HVAC efficiency, window quality, lighting, appliance efficiency, and ductwork. It identifies where energy is being wasted and recommends improvements.",
    },
    {
      question: "How much can an energy audit save?",
      answer:
        "Implementing energy audit recommendations typically saves 10-30% on energy bills. Common improvements include adding insulation, sealing air leaks, upgrading to LED lighting, and replacing old HVAC systems.",
    },
  ],
  formula:
    "Waste Rate = Insulation Waste + Age Waste + Lighting Waste + HVAC Waste (capped at 50%). Potential Savings = Annual Bill x Waste Rate x 70% recovery factor.",
};
