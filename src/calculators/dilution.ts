import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dilutionCalculator: CalculatorDefinition = {
  slug: "dilution-calculator",
  title: "Dilution Calculator",
  description:
    "Free dilution calculator. Use C1V1 = C2V2 to find final volume or concentration when diluting a solution.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "dilution",
    "concentration",
    "C1V1",
    "molarity",
    "solution",
    "chemistry",
  ],
  variants: [
    {
      id: "find-v2",
      name: "Find Final Volume (V2)",
      fields: [
        {
          name: "c1",
          label: "Initial Concentration (C1) in M",
          type: "number",
          placeholder: "e.g. 1.0",
        },
        {
          name: "v1",
          label: "Initial Volume (V1) in mL",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "c2",
          label: "Final Concentration (C2) in M",
          type: "number",
          placeholder: "e.g. 0.1",
        },
      ],
      calculate: (inputs) => {
        const c1 = inputs.c1 as number;
        const v1 = inputs.v1 as number;
        const c2 = inputs.c2 as number;
        if (!c1 || !v1 || !c2) return null;
        if (c2 > c1) return null;
        const v2 = (c1 * v1) / c2;
        const solventToAdd = v2 - v1;
        return {
          primary: {
            label: "Final Volume (V2)",
            value: formatNumber(v2, 4) + " mL",
          },
          details: [
            { label: "C1", value: formatNumber(c1, 4) + " M" },
            { label: "V1", value: formatNumber(v1, 4) + " mL" },
            { label: "C2", value: formatNumber(c2, 4) + " M" },
            {
              label: "Solvent to Add",
              value: formatNumber(solventToAdd, 4) + " mL",
            },
            {
              label: "Dilution Factor",
              value: formatNumber(c1 / c2, 2) + "x",
            },
          ],
        };
      },
    },
    {
      id: "find-c2",
      name: "Find Final Concentration (C2)",
      fields: [
        {
          name: "c1",
          label: "Initial Concentration (C1) in M",
          type: "number",
          placeholder: "e.g. 1.0",
        },
        {
          name: "v1",
          label: "Initial Volume (V1) in mL",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "v2",
          label: "Final Volume (V2) in mL",
          type: "number",
          placeholder: "e.g. 500",
        },
      ],
      calculate: (inputs) => {
        const c1 = inputs.c1 as number;
        const v1 = inputs.v1 as number;
        const v2 = inputs.v2 as number;
        if (!c1 || !v1 || !v2) return null;
        if (v2 < v1) return null;
        const c2 = (c1 * v1) / v2;
        return {
          primary: {
            label: "Final Concentration (C2)",
            value: formatNumber(c2, 4) + " M",
          },
          details: [
            { label: "C1", value: formatNumber(c1, 4) + " M" },
            { label: "V1", value: formatNumber(v1, 4) + " mL" },
            { label: "V2", value: formatNumber(v2, 4) + " mL" },
            {
              label: "Dilution Factor",
              value: formatNumber(v2 / v1, 2) + "x",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["boyles-law-calculator", "beer-lambert-calculator"],
  faq: [
    {
      question: "What is the dilution equation?",
      answer:
        "The dilution equation is C1V1 = C2V2, where C1 and V1 are the initial concentration and volume, and C2 and V2 are the final concentration and volume after dilution.",
    },
    {
      question: "Can the final concentration be higher than the initial?",
      answer:
        "No. Dilution only decreases concentration. To increase concentration you would need evaporation or adding more solute.",
    },
  ],
  formula:
    "C1 × V1 = C2 × V2, where C is concentration and V is volume. Solve for the unknown variable.",
};
