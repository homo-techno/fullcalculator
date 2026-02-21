import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const insulationCalculator: CalculatorDefinition = {
  slug: "insulation-calculator",
  title: "Insulation Calculator",
  description:
    "Free insulation calculator. Estimate batts or rolls needed based on area and desired R-value.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["insulation", "R-value", "batts", "rolls", "fiberglass", "attic"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "area",
          label: "Area to Insulate (sq ft)",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "rValue",
          label: "Desired R-Value",
          type: "select",
          options: [
            { label: "R-13 (walls)", value: "13" },
            { label: "R-19 (floors)", value: "19" },
            { label: "R-30 (attic)", value: "30" },
            { label: "R-38 (attic)", value: "38" },
            { label: "R-49 (attic, cold climate)", value: "49" },
          ],
        },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const rValue = inputs.rValue as string;
        if (!area || !rValue) return null;

        const rNum = Number(rValue);

        // Approximate thickness in inches per R-value (fiberglass batt)
        const thicknessMap: Record<string, number> = {
          "13": 3.5,
          "19": 6.25,
          "30": 9.5,
          "38": 12,
          "49": 15.5,
        };

        // Coverage per roll/batt bag (sq ft) – standard 15" wide rolls
        const coverageMap: Record<string, number> = {
          "13": 40,
          "19": 48.96,
          "30": 31.25,
          "38": 24,
          "49": 18.75,
        };

        const thickness = thicknessMap[rValue] || 3.5;
        const coveragePerBag = coverageMap[rValue] || 40;
        const bagsNeeded = Math.ceil(area / coveragePerBag);

        return {
          primary: {
            label: "Batts/Rolls Needed",
            value: String(bagsNeeded),
          },
          details: [
            { label: "Area to Insulate", value: formatNumber(area, 0) + " sq ft" },
            { label: "R-Value", value: "R-" + rNum },
            { label: "Approximate Thickness", value: formatNumber(thickness, 1) + " inches" },
            { label: "Coverage per Package", value: formatNumber(coveragePerBag, 1) + " sq ft" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hvac-calculator", "drywall-calculator"],
  faq: [
    {
      question: "What R-value do I need?",
      answer:
        "R-13 is common for exterior walls, R-19 for floors, and R-30 to R-49 for attics depending on your climate zone.",
    },
    {
      question: "What does the R-value mean?",
      answer:
        "R-value measures thermal resistance. A higher R-value means better insulating performance.",
    },
  ],
  formula:
    "Packages Needed = Area ÷ Coverage per Package (varies by R-value). Thickness depends on the R-value selected.",
};
