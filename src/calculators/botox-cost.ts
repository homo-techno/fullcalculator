import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const botoxCostCalculator: CalculatorDefinition = {
  slug: "botox-cost-calculator",
  title: "Botox Cost Calculator",
  description:
    "Calculate Botox treatment costs by treatment area and number of units. Estimate annual costs for maintenance treatments and compare provider pricing.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "botox cost",
    "botox price per unit",
    "botox cost calculator",
    "botox forehead cost",
    "dysport cost",
    "botox treatment cost",
  ],
  variants: [
    {
      id: "byArea",
      name: "Cost by Treatment Area",
      description: "Estimate Botox cost based on areas treated",
      fields: [
        {
          name: "area",
          label: "Treatment Area",
          type: "select",
          options: [
            { label: "Forehead lines", value: "forehead" },
            { label: "Frown lines (glabella/11s)", value: "frown" },
            { label: "Crow's feet (both sides)", value: "crows_feet" },
            { label: "Forehead + frown + crow's feet", value: "full_upper" },
            { label: "Brow lift", value: "brow" },
            { label: "Lip lines (lip flip)", value: "lip" },
            { label: "Neck bands (platysma)", value: "neck" },
            { label: "Jawline slimming (masseter)", value: "jaw" },
          ],
          defaultValue: "full_upper",
        },
        {
          name: "pricePerUnit",
          label: "Price Per Unit",
          type: "number",
          placeholder: "e.g. 14",
          prefix: "$",
          min: 8,
          max: 25,
          defaultValue: 14,
        },
        {
          name: "treatmentsPerYear",
          label: "Treatments Per Year",
          type: "select",
          options: [
            { label: "2 (every 6 months)", value: "2" },
            { label: "3 (every 4 months)", value: "3" },
            { label: "4 (every 3 months)", value: "4" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const area = inputs.area as string;
        const pricePerUnit = parseFloat(inputs.pricePerUnit as string);
        const treatmentsPerYear = parseFloat(inputs.treatmentsPerYear as string);
        if (!pricePerUnit || !treatmentsPerYear) return null;

        const unitsNeeded: Record<string, number> = {
          forehead: 20, frown: 25, crows_feet: 24, full_upper: 64,
          brow: 8, lip: 6, neck: 40, jaw: 50,
        };

        const units = unitsNeeded[area] || 20;
        const perTreatment = units * pricePerUnit;
        const annualCost = perTreatment * treatmentsPerYear;
        const monthlyEquivalent = annualCost / 12;

        return {
          primary: { label: "Cost Per Treatment", value: `$${formatNumber(perTreatment, 0)}` },
          details: [
            { label: "Units Needed", value: `${formatNumber(units, 0)} units` },
            { label: "Price Per Unit", value: `$${formatNumber(pricePerUnit, 2)}` },
            { label: "Annual Cost", value: `$${formatNumber(annualCost, 0)}` },
            { label: "Monthly Equivalent", value: `$${formatNumber(monthlyEquivalent, 0)}/mo` },
            { label: "Treatments/Year", value: formatNumber(treatmentsPerYear, 0) },
          ],
          note: "Unit estimates are averages; actual units vary by muscle strength, gender, and desired effect. Men typically require 1.5-2x more units. Prices vary by provider type and location ($10-$25/unit).",
        };
      },
    },
    {
      id: "comparison",
      name: "Botox vs Alternatives",
      description: "Compare Botox, Dysport, and Xeomin costs",
      fields: [
        {
          name: "area",
          label: "Treatment Area",
          type: "select",
          options: [
            { label: "Forehead lines", value: "forehead" },
            { label: "Frown lines (glabella)", value: "frown" },
            { label: "Crow's feet", value: "crows_feet" },
            { label: "Full upper face", value: "full_upper" },
          ],
          defaultValue: "full_upper",
        },
        {
          name: "botoxPrice",
          label: "Botox Price/Unit",
          type: "number",
          placeholder: "e.g. 14",
          prefix: "$",
          min: 8,
          max: 25,
          defaultValue: 14,
        },
      ],
      calculate: (inputs) => {
        const area = inputs.area as string;
        const botoxPrice = parseFloat(inputs.botoxPrice as string);
        if (!botoxPrice) return null;

        const botoxUnits: Record<string, number> = { forehead: 20, frown: 25, crows_feet: 24, full_upper: 64 };
        const units = botoxUnits[area] || 20;

        // Dysport uses ~2.5-3x more units but costs less per unit
        const dysportUnits = Math.round(units * 2.75);
        const dysportPricePerUnit = botoxPrice * 0.35;
        const xeominPricePerUnit = botoxPrice * 0.85;

        const botoxTotal = units * botoxPrice;
        const dysportTotal = dysportUnits * dysportPricePerUnit;
        const xeominTotal = units * xeominPricePerUnit;

        return {
          primary: { label: "Botox Cost", value: `$${formatNumber(botoxTotal, 0)}` },
          details: [
            { label: "Botox", value: `${formatNumber(units, 0)} units = $${formatNumber(botoxTotal, 0)}` },
            { label: "Dysport (equivalent)", value: `${formatNumber(dysportUnits, 0)} units = $${formatNumber(dysportTotal, 0)}` },
            { label: "Xeomin (equivalent)", value: `${formatNumber(units, 0)} units = $${formatNumber(xeominTotal, 0)}` },
            { label: "Cheapest Option", value: botoxTotal <= dysportTotal && botoxTotal <= xeominTotal ? "Botox" : dysportTotal <= xeominTotal ? "Dysport" : "Xeomin" },
          ],
          note: "Dysport and Xeomin are FDA-approved alternatives to Botox. Dysport uses different units (roughly 2.5-3:1 ratio). Results and duration are comparable. Individual response may vary between products.",
        };
      },
    },
  ],
  relatedSlugs: ["cosmetic-surgery-cost-calculator", "skin-age-calculator", "therapy-cost-calculator"],
  faq: [
    {
      question: "How much does Botox cost per unit?",
      answer:
        "Botox typically costs $10-$20 per unit, with the national average around $13-$15. Med spas tend to charge less ($10-$14) while dermatologists and plastic surgeons charge more ($14-$20). Always verify your provider is licensed and experienced.",
    },
    {
      question: "How many units of Botox do I need?",
      answer:
        "Common unit ranges: forehead lines (10-30 units), frown lines (15-30 units), crow's feet (8-16 units per side), lip flip (4-8 units). A full upper face treatment typically uses 40-64 units total. Men often need more units than women.",
    },
    {
      question: "How long does Botox last?",
      answer:
        "Botox typically lasts 3-4 months. First-time patients may notice it wearing off sooner (2-3 months). With consistent treatments, some patients find results last longer over time. Most people get 3-4 treatments per year for maintenance.",
    },
  ],
  formula:
    "Treatment Cost = Units Needed x Price Per Unit | Annual Cost = Treatment Cost x Treatments Per Year",
};
