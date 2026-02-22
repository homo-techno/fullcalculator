import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paperSavingsCalculator: CalculatorDefinition = {
  slug: "paper-savings-calculator",
  title: "Paper Savings Calculator",
  description:
    "Free paper savings calculator. Estimate the environmental and cost savings from going paperless at home or in the office.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "paper savings",
    "go paperless",
    "paper waste",
    "paper consumption",
    "paperless office",
    "paper reduction",
  ],
  variants: [
    {
      id: "office",
      name: "Paper Reduction Savings",
      fields: [
        {
          name: "sheetsPerWeek",
          label: "Sheets of Paper Used per Week",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "reductionTarget",
          label: "Paperless Reduction Target",
          type: "select",
          options: [
            { label: "25% reduction", value: "0.25" },
            { label: "50% reduction", value: "0.50" },
            { label: "75% reduction", value: "0.75" },
            { label: "90% reduction", value: "0.90" },
            { label: "100% paperless", value: "1.00" },
          ],
        },
        {
          name: "paperCost",
          label: "Cost per Ream (500 sheets, $)",
          type: "number",
          placeholder: "e.g. 8",
          defaultValue: 8,
        },
        {
          name: "includeInk",
          label: "Include Printing Costs?",
          type: "select",
          options: [
            { label: "Yes (add $0.05/page)", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
      ],
      calculate: (inputs) => {
        const sheetsPerWeek = inputs.sheetsPerWeek as number;
        const reduction = parseFloat((inputs.reductionTarget as string) || "0.50");
        const paperCost = (inputs.paperCost as number) || 8;
        const includeInk = (inputs.includeInk as string) || "yes";
        if (!sheetsPerWeek) return null;

        const annualSheets = sheetsPerWeek * 52;
        const savedSheets = annualSheets * reduction;
        const costPerSheet = paperCost / 500;
        const inkCost = includeInk === "yes" ? 0.05 : 0;
        const totalCostPerSheet = costPerSheet + inkCost;

        const annualCostSavings = savedSheets * totalCostPerSheet;

        // Environmental impact
        const treesPerYear = savedSheets / 8333; // ~8333 sheets per tree
        const waterGallons = savedSheets * 1.5; // 1.5 gallons per sheet to produce
        const co2Lbs = savedSheets * 0.006; // lbs CO2 per sheet
        const energyKwh = savedSheets * 0.05; // kWh per sheet

        return {
          primary: {
            label: "Annual Cost Savings",
            value: "$" + formatNumber(annualCostSavings, 2),
          },
          details: [
            { label: "Sheets Saved/Year", value: formatNumber(savedSheets, 0) },
            { label: "Current Annual Usage", value: formatNumber(annualSheets, 0) + " sheets" },
            { label: "Trees Saved", value: formatNumber(treesPerYear, 2) },
            { label: "Water Saved", value: formatNumber(waterGallons, 0) + " gallons" },
            { label: "CO2 Saved", value: formatNumber(co2Lbs, 1) + " lbs" },
            { label: "Energy Saved", value: formatNumber(energyKwh, 0) + " kWh" },
          ],
          note: "Going paperless also reduces clutter, improves document searchability, and eliminates physical storage costs. Digital backups are more secure than paper files.",
        };
      },
    },
  ],
  relatedSlugs: ["recycling-savings-calculator", "carbon-footprint-calculator"],
  faq: [
    {
      question: "How much paper does the average office worker use?",
      answer:
        "The average office worker uses about 10,000 sheets of paper per year (~200 per week). About 45% of office paper ends up in the trash by the end of the day. Going paperless can save significant resources.",
    },
    {
      question: "How many trees does it take to make paper?",
      answer:
        "One tree produces approximately 8,333 sheets of paper (about 16.7 reams). The US uses roughly 68 million trees per year for paper and paper products. Reducing paper use directly protects forests.",
    },
  ],
  formula:
    "Saved Sheets = Weekly Sheets x 52 x Reduction %. Cost Savings = Saved Sheets x (Paper Cost/500 + Ink Cost). Trees Saved = Saved Sheets / 8,333.",
};
