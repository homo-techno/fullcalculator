import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cellDilutionCalculator: CalculatorDefinition = {
  slug: "cell-dilution-calculator",
  title: "Cell Dilution Calculator",
  description:
    "Free cell dilution calculator. Calculate the volume of cell stock and diluent needed to achieve a target cell concentration using C1V1 = C2V2.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "cell dilution",
    "C1V1 C2V2",
    "cell culture",
    "dilution factor",
    "concentration",
    "cell biology",
  ],
  variants: [
    {
      id: "find-volume",
      name: "Find Volume of Stock Needed",
      description: "How much stock solution to add to reach a target concentration",
      fields: [
        {
          name: "stockConc",
          label: "Stock Concentration (C₁, cells/mL)",
          type: "number",
          placeholder: "e.g. 1000000",
          min: 0,
        },
        {
          name: "targetConc",
          label: "Target Concentration (C₂, cells/mL)",
          type: "number",
          placeholder: "e.g. 200000",
          min: 0,
        },
        {
          name: "finalVolume",
          label: "Final Volume (V₂, mL)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const C1 = inputs.stockConc as number;
        const C2 = inputs.targetConc as number;
        const V2 = inputs.finalVolume as number;
        if (!C1 || !C2 || !V2 || C1 <= 0 || C2 <= 0 || V2 <= 0) return null;
        if (C2 > C1) return null;

        const V1 = (C2 * V2) / C1;
        const diluent = V2 - V1;
        const dilutionFactor = C1 / C2;

        return {
          primary: {
            label: "Volume of Stock Needed (V₁)",
            value: formatNumber(V1, 3) + " mL",
          },
          details: [
            { label: "Volume of diluent to add", value: formatNumber(diluent, 3) + " mL" },
            { label: "Dilution factor", value: "1:" + formatNumber(dilutionFactor, 1) },
            { label: "Final volume", value: formatNumber(V2, 2) + " mL" },
            { label: "Stock concentration", value: formatNumber(C1, 0) + " cells/mL" },
            { label: "Target concentration", value: formatNumber(C2, 0) + " cells/mL" },
            { label: "Total cells in final volume", value: formatNumber(C2 * V2, 0) },
          ],
        };
      },
    },
    {
      id: "find-concentration",
      name: "Find Final Concentration",
      description: "Calculate resulting concentration after dilution",
      fields: [
        {
          name: "stockConc",
          label: "Stock Concentration (C₁, cells/mL)",
          type: "number",
          placeholder: "e.g. 1000000",
          min: 0,
        },
        {
          name: "stockVolume",
          label: "Volume of Stock (V₁, mL)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
        },
        {
          name: "finalVolume",
          label: "Final Volume (V₂, mL)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const C1 = inputs.stockConc as number;
        const V1 = inputs.stockVolume as number;
        const V2 = inputs.finalVolume as number;
        if (!C1 || !V1 || !V2 || C1 <= 0 || V1 <= 0 || V2 <= 0) return null;
        if (V1 > V2) return null;

        const C2 = (C1 * V1) / V2;
        const dilutionFactor = V2 / V1;

        return {
          primary: {
            label: "Final Concentration (C₂)",
            value: formatNumber(C2, 0) + " cells/mL",
          },
          details: [
            { label: "Dilution factor", value: "1:" + formatNumber(dilutionFactor, 1) },
            { label: "Volume of diluent added", value: formatNumber(V2 - V1, 3) + " mL" },
            { label: "Total cells", value: formatNumber(C2 * V2, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "serial-dilution-calculator",
    "hemocytometer-calculator",
    "generation-time-calculator",
  ],
  faq: [
    {
      question: "What is the dilution equation?",
      answer:
        "The dilution equation is C₁V₁ = C₂V₂, where C₁ is the initial concentration, V₁ is the volume of stock, C₂ is the final concentration, and V₂ is the final total volume.",
    },
    {
      question: "How do you calculate dilution factor?",
      answer:
        "Dilution factor = initial concentration / final concentration, or equivalently, final volume / volume of stock. A 1:10 dilution means the final concentration is 1/10 of the stock.",
    },
  ],
  formula: "C₁ × V₁ = C₂ × V₂. V₁ = (C₂ × V₂) / C₁. Dilution factor = C₁ / C₂.",
};
