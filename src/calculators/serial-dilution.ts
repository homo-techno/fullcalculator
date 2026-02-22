import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const serialDilutionCalculator: CalculatorDefinition = {
  slug: "serial-dilution-calculator",
  title: "Serial Dilution Calculator",
  description:
    "Free serial dilution calculator. Calculate the final concentration after multiple sequential dilution steps.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "serial dilution",
    "dilution series",
    "microbiology",
    "plate count",
    "dilution factor",
    "sequential dilution",
  ],
  variants: [
    {
      id: "serial",
      name: "Serial Dilution Series",
      description: "Calculate concentrations at each step of a serial dilution",
      fields: [
        {
          name: "initialConc",
          label: "Initial Concentration",
          type: "number",
          placeholder: "e.g. 1000000",
          min: 0,
        },
        {
          name: "dilutionFactor",
          label: "Dilution Factor per Step (e.g., 10 for 1:10)",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
        },
        {
          name: "steps",
          label: "Number of Dilution Steps",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 20,
        },
        {
          name: "concUnit",
          label: "Concentration Unit",
          type: "select",
          options: [
            { label: "cells/mL", value: "cells/mL" },
            { label: "CFU/mL", value: "CFU/mL" },
            { label: "mol/L", value: "mol/L" },
            { label: "mg/mL", value: "mg/mL" },
          ],
          defaultValue: "cells/mL",
        },
      ],
      calculate: (inputs) => {
        const C0 = inputs.initialConc as number;
        const df = inputs.dilutionFactor as number;
        const steps = inputs.steps as number;
        const unit = inputs.concUnit as string;
        if (!C0 || !df || !steps || C0 <= 0 || df < 1 || steps < 1) return null;

        const totalDilution = Math.pow(df, steps);
        const finalConc = C0 / totalDilution;

        const stepDetails: string[] = [];
        let conc = C0;
        for (let i = 1; i <= Math.min(steps, 10); i++) {
          conc = conc / df;
          stepDetails.push(
            `Step ${i}: ${conc >= 0.01 ? formatNumber(conc, 4) : conc.toExponential(2)} ${unit}`
          );
        }
        if (steps > 10) {
          stepDetails.push(`... (${steps - 10} more steps)`);
          stepDetails.push(
            `Step ${steps}: ${finalConc >= 0.01 ? formatNumber(finalConc, 4) : finalConc.toExponential(2)} ${unit}`
          );
        }

        return {
          primary: {
            label: "Final Concentration",
            value:
              (finalConc >= 0.01 ? formatNumber(finalConc, 4) : finalConc.toExponential(2)) +
              " " +
              unit,
          },
          details: [
            { label: "Total dilution factor", value: "1:" + formatNumber(totalDilution, 0) },
            { label: "Per-step dilution", value: "1:" + formatNumber(df, 0) },
            { label: "Number of steps", value: String(steps) },
            { label: "Initial concentration", value: formatNumber(C0, 2) + " " + unit },
            { label: "Dilution series", value: stepDetails.join(" | ") },
          ],
        };
      },
    },
    {
      id: "back-calculate",
      name: "Back-Calculate Original Concentration",
      description: "Find original concentration from a diluted sample count",
      fields: [
        {
          name: "countedConc",
          label: "Counted/Measured Concentration",
          type: "number",
          placeholder: "e.g. 150",
          min: 0,
        },
        {
          name: "dilutionFactor",
          label: "Dilution Factor per Step",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
        },
        {
          name: "steps",
          label: "Number of Dilution Steps",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 20,
        },
      ],
      calculate: (inputs) => {
        const counted = inputs.countedConc as number;
        const df = inputs.dilutionFactor as number;
        const steps = inputs.steps as number;
        if (!counted || !df || !steps || df < 1 || steps < 1) return null;

        const totalDilution = Math.pow(df, steps);
        const originalConc = counted * totalDilution;

        return {
          primary: {
            label: "Original Concentration",
            value: originalConc > 1e9
              ? originalConc.toExponential(2)
              : formatNumber(originalConc, 0),
          },
          details: [
            { label: "Total dilution factor", value: "1:" + formatNumber(totalDilution, 0) },
            { label: "Counted concentration", value: formatNumber(counted, 2) },
            { label: "Steps used", value: String(steps) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cell-dilution-calculator",
    "hemocytometer-calculator",
    "generation-time-calculator",
  ],
  faq: [
    {
      question: "What is a serial dilution?",
      answer:
        "A serial dilution is a stepwise dilution of a substance in solution, where the diluted material from one step is used to make the next dilution. For example, six 1:10 serial dilutions produce a total dilution of 1:1,000,000.",
    },
    {
      question: "How do you calculate the final concentration in a serial dilution?",
      answer:
        "Final concentration = Initial concentration / (dilution factor)^n, where n is the number of steps. For a 1:10 dilution repeated 4 times: final = initial / 10⁴ = initial / 10,000.",
    },
  ],
  formula:
    "Final concentration = C₀ / (DF)ⁿ, where C₀ is initial concentration, DF is dilution factor per step, and n is the number of steps. Total dilution = DFⁿ.",
};
