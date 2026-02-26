import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rValueCalculator: CalculatorDefinition = {
  slug: "r-value-calculator",
  title: "Insulation R-Value Calculator",
  description:
    "Calculate the total R-value of your wall or ceiling assembly. Determine the thickness of insulation needed and compare different insulation types.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "R-value calculator",
    "insulation calculator",
    "insulation thickness",
    "wall R-value",
    "attic insulation",
  ],
  variants: [
    {
      id: "by-thickness",
      name: "R-Value by Insulation Type & Thickness",
      description: "Calculate R-value from insulation type and installed thickness",
      fields: [
        {
          name: "insulationType",
          label: "Insulation Type",
          type: "select",
          options: [
            { label: "Fiberglass Batt (R-3.2/in)", value: "3.2" },
            { label: "Blown Fiberglass (R-2.5/in)", value: "2.5" },
            { label: "Cellulose Blown (R-3.5/in)", value: "3.5" },
            { label: "Mineral Wool Batt (R-3.3/in)", value: "3.3" },
            { label: "Spray Foam - Open Cell (R-3.7/in)", value: "3.7" },
            { label: "Spray Foam - Closed Cell (R-6.5/in)", value: "6.5" },
            { label: "Rigid Foam - EPS (R-4.0/in)", value: "4.0" },
            { label: "Rigid Foam - XPS (R-5.0/in)", value: "5.0" },
            { label: "Rigid Foam - Polyiso (R-6.0/in)", value: "6.0" },
          ],
          defaultValue: "3.2",
        },
        {
          name: "thickness",
          label: "Thickness (inches)",
          type: "number",
          placeholder: "e.g. 3.5",
          defaultValue: 3.5,
        },
        {
          name: "area",
          label: "Area to Insulate (sq ft)",
          type: "number",
          placeholder: "e.g. 1000",
        },
      ],
      calculate: (inputs) => {
        const rPerInch = parseFloat(inputs.insulationType as string);
        const thickness = parseFloat(inputs.thickness as string);
        const area = parseFloat(inputs.area as string) || 0;
        if (!rPerInch || !thickness) return null;

        const totalR = rPerInch * thickness;

        // Estimate heat loss (BTU/hr) per degree F temperature difference
        const heatLossPerDegree = area > 0 ? area / totalR : 0;

        // Cost per sq ft estimates
        const costEstimates: Record<string, number> = {
          "3.2": 0.5,  // fiberglass batt
          "2.5": 0.6,  // blown fiberglass
          "3.5": 0.7,  // cellulose
          "3.3": 0.8,  // mineral wool
          "3.7": 1.0,  // open cell spray
          "6.5": 1.8,  // closed cell spray
          "4.0": 0.7,  // EPS
          "5.0": 0.9,  // XPS
          "6.0": 1.1,  // polyiso
        };
        const costPerSqFtPerInch = costEstimates[String(rPerInch)] || 0.7;
        const totalCost = area > 0 ? area * costPerSqFtPerInch * thickness : 0;

        const details = [
          { label: "R-value per inch", value: `R-${formatNumber(rPerInch, 1)}` },
          { label: "Thickness", value: `${formatNumber(thickness, 1)} inches` },
          { label: "Total R-value", value: `R-${formatNumber(totalR, 1)}` },
        ];

        if (area > 0) {
          details.push(
            { label: "Area", value: `${formatNumber(area)} sq ft` },
            { label: "Heat loss per degree F diff", value: `${formatNumber(heatLossPerDegree, 1)} BTU/hr` },
            { label: "Estimated material cost", value: `$${formatNumber(totalCost)}` },
          );
        }

        return {
          primary: {
            label: "Total R-Value",
            value: `R-${formatNumber(totalR, 1)}`,
          },
          details,
          note: "R-value is additive across layers. The total assembly R-value includes all layers plus air films. Higher R-value means better thermal resistance.",
        };
      },
    },
    {
      id: "target-r",
      name: "Thickness for Target R-Value",
      description: "Calculate how many inches of insulation needed for a target R-value",
      fields: [
        {
          name: "targetR",
          label: "Target R-Value",
          type: "select",
          options: [
            { label: "R-13 (2x4 wall)", value: "13" },
            { label: "R-19 (2x6 wall)", value: "19" },
            { label: "R-21 (2x6 wall premium)", value: "21" },
            { label: "R-30 (floor/ceiling)", value: "30" },
            { label: "R-38 (attic)", value: "38" },
            { label: "R-49 (attic cold climate)", value: "49" },
            { label: "R-60 (attic very cold)", value: "60" },
          ],
          defaultValue: "38",
        },
        {
          name: "insulationType",
          label: "Insulation Type",
          type: "select",
          options: [
            { label: "Fiberglass Batt (R-3.2/in)", value: "3.2" },
            { label: "Blown Fiberglass (R-2.5/in)", value: "2.5" },
            { label: "Cellulose Blown (R-3.5/in)", value: "3.5" },
            { label: "Spray Foam - Open Cell (R-3.7/in)", value: "3.7" },
            { label: "Spray Foam - Closed Cell (R-6.5/in)", value: "6.5" },
            { label: "Rigid Foam - XPS (R-5.0/in)", value: "5.0" },
            { label: "Rigid Foam - Polyiso (R-6.0/in)", value: "6.0" },
          ],
          defaultValue: "3.5",
        },
      ],
      calculate: (inputs) => {
        const targetR = parseFloat(inputs.targetR as string);
        const rPerInch = parseFloat(inputs.insulationType as string);
        if (!targetR || !rPerInch) return null;

        const thicknessNeeded = targetR / rPerInch;

        return {
          primary: {
            label: "Thickness Needed",
            value: `${formatNumber(thicknessNeeded, 1)} inches`,
          },
          details: [
            { label: "Target R-value", value: `R-${formatNumber(targetR)}` },
            { label: "R-value per inch", value: `R-${formatNumber(rPerInch, 1)}` },
            { label: "Required thickness", value: `${formatNumber(thicknessNeeded, 1)} inches` },
          ],
          note: "Ensure the cavity depth can accommodate the required thickness. Compressing insulation reduces its R-value per inch.",
        };
      },
    },
  ],
  relatedSlugs: ["furnace-size-calculator", "ac-tonnage-calculator", "wall-square-footage-calculator"],
  faq: [
    {
      question: "What R-value do I need for my attic?",
      answer:
        "The recommended attic R-value depends on your climate zone. Zone 1 (hot): R-30 to R-49. Zone 2-3: R-38 to R-49. Zone 4-5 (cold): R-49 to R-60. Most existing homes benefit from adding insulation to reach R-49 in the attic.",
    },
    {
      question: "Is a higher R-value always better?",
      answer:
        "Higher R-values provide more thermal resistance, but there is a point of diminishing returns. Going from R-11 to R-19 saves significantly more energy than going from R-38 to R-49. The most cost-effective approach is to insulate to the code-recommended level for your climate zone.",
    },
  ],
  formula:
    "R-Value = R per Inch x Thickness | Thickness = Target R / R per Inch | Heat Loss = Area / R-value (BTU/hr per degree F)",
};
