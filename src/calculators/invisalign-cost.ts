import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const invisalignCostCalculator: CalculatorDefinition = {
  slug: "invisalign-cost-calculator",
  title: "Invisalign Cost Calculator",
  description:
    "Estimate the cost of Invisalign clear aligner treatment based on complexity, location, and insurance. Compare with traditional braces costs.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "invisalign cost",
    "invisalign price",
    "clear aligner cost",
    "invisalign vs braces cost",
    "invisalign calculator",
    "orthodontic cost",
  ],
  variants: [
    {
      id: "treatment",
      name: "Treatment Cost Estimate",
      description: "Estimate Invisalign cost based on case complexity",
      fields: [
        {
          name: "complexity",
          label: "Case Complexity",
          type: "select",
          options: [
            { label: "Lite (minor crowding/spacing)", value: "lite" },
            { label: "Moderate (typical case)", value: "moderate" },
            { label: "Comprehensive (complex)", value: "comprehensive" },
            { label: "Teen (Invisalign First/Teen)", value: "teen" },
          ],
          defaultValue: "moderate",
        },
        {
          name: "region",
          label: "Region",
          type: "select",
          options: [
            { label: "Major metro (NYC, LA, SF)", value: "metro" },
            { label: "Suburban area", value: "suburban" },
            { label: "Rural area", value: "rural" },
          ],
          defaultValue: "suburban",
        },
        {
          name: "insuranceCoverage",
          label: "Orthodontic Insurance Coverage",
          type: "number",
          placeholder: "e.g. 1500",
          prefix: "$",
          min: 0,
          max: 5000,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const complexity = inputs.complexity as string;
        const region = inputs.region as string;
        const insurance = parseFloat(inputs.insuranceCoverage as string) || 0;

        const baseCosts: Record<string, number> = {
          lite: 3500, moderate: 5000, comprehensive: 7000, teen: 4500,
        };
        const regionMultipliers: Record<string, number> = {
          metro: 1.30, suburban: 1.0, rural: 0.85,
        };
        const durations: Record<string, number> = {
          lite: 6, moderate: 12, comprehensive: 18, teen: 14,
        };

        const baseCost = baseCosts[complexity] || 5000;
        const multiplier = regionMultipliers[region] || 1.0;
        const totalCost = baseCost * multiplier;
        const outOfPocket = Math.max(0, totalCost - insurance);
        const duration = durations[complexity] || 12;
        const monthlyPayment = outOfPocket / duration;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Insurance Coverage", value: `$${formatNumber(insurance, 0)}` },
            { label: "Out-of-Pocket", value: `$${formatNumber(outOfPocket, 0)}` },
            { label: "Est. Monthly Payment", value: `$${formatNumber(monthlyPayment, 0)}/mo` },
            { label: "Treatment Duration", value: `~${formatNumber(duration, 0)} months` },
            { label: "Comparable Braces Cost", value: `$${formatNumber(totalCost * 0.85, 0)} - $${formatNumber(totalCost * 0.95, 0)}` },
          ],
          note: "Costs include initial consultation, aligners, refinements, and retainers at most practices. Payment plans (often interest-free) are widely available. Get quotes from multiple providers.",
        };
      },
    },
    {
      id: "comparison",
      name: "Invisalign vs Braces",
      description: "Compare costs between Invisalign and traditional braces",
      fields: [
        {
          name: "complexity",
          label: "Case Complexity",
          type: "select",
          options: [
            { label: "Mild", value: "mild" },
            { label: "Moderate", value: "moderate" },
            { label: "Severe", value: "severe" },
          ],
          defaultValue: "moderate",
        },
        {
          name: "bracesType",
          label: "Braces Type for Comparison",
          type: "select",
          options: [
            { label: "Metal braces", value: "metal" },
            { label: "Ceramic braces", value: "ceramic" },
            { label: "Lingual braces", value: "lingual" },
          ],
          defaultValue: "metal",
        },
      ],
      calculate: (inputs) => {
        const complexity = inputs.complexity as string;
        const bracesType = inputs.bracesType as string;

        const invisalignCosts: Record<string, number> = { mild: 3500, moderate: 5500, severe: 7500 };
        const bracesCosts: Record<string, Record<string, number>> = {
          metal: { mild: 3000, moderate: 4500, severe: 6500 },
          ceramic: { mild: 3500, moderate: 5000, severe: 7000 },
          lingual: { mild: 6000, moderate: 8000, severe: 10000 },
        };

        const invisalignCost = invisalignCosts[complexity] || 5500;
        const bracesCost = bracesCosts[bracesType]?.[complexity] || 4500;
        const difference = invisalignCost - bracesCost;

        return {
          primary: { label: "Invisalign Cost", value: `$${formatNumber(invisalignCost, 0)}` },
          details: [
            { label: "Braces Cost", value: `$${formatNumber(bracesCost, 0)}` },
            { label: "Price Difference", value: `$${formatNumber(Math.abs(difference), 0)} ${difference > 0 ? "(Invisalign more)" : "(Braces more)"}` },
            { label: "Invisalign Range", value: `$${formatNumber(invisalignCost * 0.85, 0)} - $${formatNumber(invisalignCost * 1.15, 0)}` },
            { label: "Braces Range", value: `$${formatNumber(bracesCost * 0.85, 0)} - $${formatNumber(bracesCost * 1.15, 0)}` },
          ],
          note: "Lingual braces are often more expensive than Invisalign. Metal braces are typically the most affordable option. Both Invisalign and braces are often covered by orthodontic insurance.",
        };
      },
    },
  ],
  relatedSlugs: ["dental-implant-cost-calculator", "cosmetic-surgery-cost-calculator", "botox-cost-calculator"],
  faq: [
    {
      question: "How much does Invisalign cost on average?",
      answer:
        "Invisalign typically costs $3,000-$8,000, with the average being around $5,000. Invisalign Lite for minor cases can be $3,000-$4,500, while comprehensive treatment for complex cases can reach $7,000-$8,000+. Costs vary by location and provider.",
    },
    {
      question: "Does insurance cover Invisalign?",
      answer:
        "Many dental insurance plans with orthodontic benefits cover Invisalign the same as braces, typically $1,000-$2,500 toward treatment. Some plans have age limits. HSA/FSA funds can also be used. Check with your insurance for specific coverage.",
    },
    {
      question: "Is Invisalign more expensive than braces?",
      answer:
        "Invisalign is often comparable to or slightly more expensive than ceramic braces. It is typically $500-$1,500 more than metal braces. However, lingual (behind-the-teeth) braces are usually the most expensive option, often exceeding Invisalign costs.",
    },
  ],
  formula:
    "Out-of-Pocket = (Base Cost x Region Multiplier) - Insurance Coverage | Monthly Payment = Out-of-Pocket / Treatment Months",
};
