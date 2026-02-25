import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeInspectionCostCalculator: CalculatorDefinition = {
  slug: "home-inspection-cost-calculator",
  title: "Home Inspection Cost Calculator",
  description:
    "Free home inspection cost calculator. Estimate home inspection fees based on property size, age, and additional specialty inspections needed.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home inspection cost",
    "inspection fee calculator",
    "home inspection price",
    "property inspection cost",
    "house inspection estimate",
  ],
  variants: [
    {
      id: "inspection-cost",
      name: "Inspection Cost Estimate",
      description: "Estimate total home inspection costs",
      fields: [
        {
          name: "homeSize",
          label: "Home Size",
          type: "select",
          options: [
            { label: "Under 1,000 sq ft", value: "small" },
            { label: "1,000-2,000 sq ft", value: "medium" },
            { label: "2,000-3,000 sq ft", value: "large" },
            { label: "3,000-4,000 sq ft", value: "xlarge" },
            { label: "Over 4,000 sq ft", value: "xxlarge" },
          ],
          defaultValue: "medium",
        },
        {
          name: "homeAge",
          label: "Home Age",
          type: "select",
          options: [
            { label: "New construction (0-5 years)", value: "new" },
            { label: "Moderate (5-20 years)", value: "moderate" },
            { label: "Older (20-50 years)", value: "older" },
            { label: "Historic (50+ years)", value: "historic" },
          ],
          defaultValue: "moderate",
        },
        {
          name: "radonTest",
          label: "Radon Test",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes", value: "150" },
          ],
          defaultValue: "150",
        },
        {
          name: "termiteInspection",
          label: "Termite / Pest Inspection",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes", value: "100" },
          ],
          defaultValue: "100",
        },
        {
          name: "sewerscopeInspection",
          label: "Sewer Scope Inspection",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes", value: "250" },
          ],
          defaultValue: "0",
        },
        {
          name: "moldTest",
          label: "Mold Testing",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes", value: "300" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const size = inputs.homeSize as string;
        const age = inputs.homeAge as string;
        const radon = parseInt(inputs.radonTest as string) || 0;
        const termite = parseInt(inputs.termiteInspection as string) || 0;
        const sewer = parseInt(inputs.sewerscopeInspection as string) || 0;
        const mold = parseInt(inputs.moldTest as string) || 0;

        let baseInspection = 0;
        if (size === "small") baseInspection = 275;
        else if (size === "medium") baseInspection = 350;
        else if (size === "large") baseInspection = 425;
        else if (size === "xlarge") baseInspection = 500;
        else baseInspection = 600;

        let ageMultiplier = 1;
        if (age === "new") ageMultiplier = 0.9;
        else if (age === "moderate") ageMultiplier = 1;
        else if (age === "older") ageMultiplier = 1.15;
        else ageMultiplier = 1.3;

        const adjustedBase = baseInspection * ageMultiplier;
        const additionalTests = radon + termite + sewer + mold;
        const totalCost = adjustedBase + additionalTests;

        return {
          primary: {
            label: "Total Inspection Cost",
            value: `$${formatNumber(totalCost)}`,
          },
          details: [
            { label: "General inspection", value: `$${formatNumber(adjustedBase)}` },
            { label: "Radon test", value: radon > 0 ? `$${formatNumber(radon)}` : "Not included" },
            { label: "Termite inspection", value: termite > 0 ? `$${formatNumber(termite)}` : "Not included" },
            { label: "Sewer scope", value: sewer > 0 ? `$${formatNumber(sewer)}` : "Not included" },
            { label: "Mold testing", value: mold > 0 ? `$${formatNumber(mold)}` : "Not included" },
            { label: "Additional tests total", value: `$${formatNumber(additionalTests)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["appraisal-value-calculator", "home-warranty-cost-calculator", "mortgage-calculator"],
  faq: [
    {
      question: "How much does a home inspection cost?",
      answer:
        "A standard home inspection costs $300-$500 for an average-sized home. Costs increase for larger or older homes. Additional inspections (radon, termite, mold, sewer scope) add $100-$300 each. The total can range from $300 to $1,000+.",
    },
    {
      question: "What does a home inspection cover?",
      answer:
        "A standard inspection covers the roof, foundation, HVAC, plumbing, electrical systems, attic, insulation, walls, ceilings, floors, windows, doors, and overall structural integrity. It does not typically include sewer lines, radon, mold, or pest inspections.",
    },
    {
      question: "Is a home inspection worth the cost?",
      answer:
        "Yes. A home inspection can uncover issues worth tens of thousands of dollars in repairs. It gives you negotiating power to request repairs or a price reduction. It can also reveal safety hazards and help you plan for future maintenance.",
    },
  ],
  formula: "Total Cost = Base Inspection (adjusted for size & age) + Additional Specialty Tests",
};
