import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const asbestosRemovalCostCalculator: CalculatorDefinition = {
  slug: "asbestos-removal-cost",
  title: "Asbestos Abatement Cost Estimator",
  description:
    "Estimate asbestos removal and abatement costs based on material type, area, and removal method. Includes testing, removal, and disposal costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "asbestos",
    "abatement",
    "removal",
    "cost",
    "testing",
    "hazardous",
    "renovation",
    "popcorn ceiling",
    "insulation",
    "tile",
  ],
  variants: [
    {
      slug: "removal-estimate",
      title: "Removal Cost Estimate",
      fields: [
        {
          name: "materialType",
          label: "Asbestos Material Type",
          type: "select",
          options: [
            { label: "Popcorn/Textured Ceiling", value: "ceiling" },
            { label: "Floor Tiles (9x9 or 12x12)", value: "tile" },
            { label: "Pipe Insulation", value: "pipe" },
            { label: "Siding/Shingles", value: "siding" },
            { label: "Duct Insulation/Wrap", value: "duct" },
            { label: "Vermiculite Attic Insulation", value: "vermiculite" },
          ],
        },
        {
          name: "area",
          label: "Area to Abate (sq ft or linear ft for pipes)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const material = inputs.materialType as string;
        const area = parseFloat(inputs.area as string);
        if (isNaN(area)) return { error: "Please enter a valid area." };

        const rates: Record<string, { low: number; high: number; unit: string }> = {
          ceiling: { low: 3, high: 7, unit: "per sq ft" },
          tile: { low: 5, high: 15, unit: "per sq ft" },
          pipe: { low: 15, high: 35, unit: "per linear ft" },
          siding: { low: 8, high: 12, unit: "per sq ft" },
          duct: { low: 12, high: 25, unit: "per linear ft" },
          vermiculite: { low: 8, high: 15, unit: "per sq ft" },
        };

        const rate = rates[material];
        const testingCost = 400;
        const setupCost = 1500;
        const disposalPerUnit = 1.5;
        const airMonitoring = 600;

        const removalLow = area * rate.low;
        const removalHigh = area * rate.high;
        const disposalCost = area * disposalPerUnit;
        const totalLow = removalLow + testingCost + setupCost + disposalCost + airMonitoring;
        const totalHigh = removalHigh + testingCost + setupCost + disposalCost + airMonitoring;

        return {
          results: [
            { label: "Removal Cost (low)", value: `$${formatNumber(removalLow)}` },
            { label: "Removal Cost (high)", value: `$${formatNumber(removalHigh)}` },
            { label: "Rate", value: `$${formatNumber(rate.low)}-$${formatNumber(rate.high)} ${rate.unit}` },
            { label: "Testing/Inspection", value: `$${formatNumber(testingCost)}` },
            { label: "Containment Setup", value: `$${formatNumber(setupCost)}` },
            { label: "Disposal", value: `$${formatNumber(disposalCost)}` },
            { label: "Air Monitoring", value: `$${formatNumber(airMonitoring)}` },
            { label: "Total Estimate (low)", value: `$${formatNumber(totalLow)}` },
            { label: "Total Estimate (high)", value: `$${formatNumber(totalHigh)}` },
          ],
        };
      },
    },
    {
      slug: "encapsulation-vs-removal",
      title: "Encapsulation vs. Removal Comparison",
      fields: [
        {
          name: "area",
          label: "Area (sq ft)",
          type: "number",
        },
        {
          name: "condition",
          label: "Material Condition",
          type: "select",
          options: [
            { label: "Good - undamaged, not friable", value: "good" },
            { label: "Fair - minor damage", value: "fair" },
            { label: "Poor - damaged, friable", value: "poor" },
          ],
        },
      ],
      calculate(inputs) {
        const area = parseFloat(inputs.area as string);
        const condition = inputs.condition as string;
        if (isNaN(area)) return { error: "Please enter a valid area." };

        const encapRate = 2.5;
        const removalRate = 8;
        const encapCost = area * encapRate + 500;
        const removalCost = area * removalRate + 2500;
        const savings = removalCost - encapCost;

        const recommendation =
          condition === "good"
            ? "Encapsulation recommended - material is intact"
            : condition === "fair"
            ? "Either option viable - consult professional"
            : "Removal recommended - damaged material poses ongoing risk";

        return {
          results: [
            { label: "Encapsulation Cost", value: `$${formatNumber(encapCost)}` },
            { label: "Full Removal Cost", value: `$${formatNumber(removalCost)}` },
            { label: "Savings with Encapsulation", value: `$${formatNumber(savings)}` },
            { label: "Recommendation", value: recommendation },
            { label: "Area (sq ft)", value: formatNumber(area) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["radon-mitigation-cost", "mold-remediation-cost", "home-appraisal-value"],
  faq: [
    {
      question: "How much does asbestos removal cost on average?",
      answer:
        "Asbestos removal typically costs $1,500-$30,000 depending on the material type and area. Popcorn ceiling removal averages $3-$7/sqft, floor tiles $5-$15/sqft, and pipe insulation $15-$35/linear foot. Additional costs include testing ($400-$800), containment setup, and disposal.",
    },
    {
      question: "Can I remove asbestos myself?",
      answer:
        "DIY asbestos removal is not recommended and is illegal in many jurisdictions for friable (crumbly) materials. Improper removal can release dangerous fibers into the air. Always hire licensed asbestos abatement professionals who follow EPA NESHAP regulations.",
    },
    {
      question: "When is encapsulation better than removal?",
      answer:
        "Encapsulation is suitable when the asbestos-containing material is in good condition, non-friable, and will not be disturbed. It costs 50-70% less than removal. However, removal is necessary when the material is damaged, during renovations that would disturb it, or when encapsulation cannot be maintained.",
    },
  ],
  formula:
    "Total Cost = (Area x Rate per unit) + Testing + Containment Setup + Disposal + Air Monitoring | Encapsulation ~$2-4/sqft | Removal ~$5-15/sqft depending on material",
};
