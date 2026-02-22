import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stemLeafPlotCalculator: CalculatorDefinition = {
  slug: "stem-leaf-plot-calculator",
  title: "Stem and Leaf Plot Generator",
  description: "Free stem and leaf plot generator. Create a stem-and-leaf display from numerical data for visualizing distribution shape.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["stem and leaf plot", "stem leaf display", "data visualization", "distribution shape"],
  variants: [{
    id: "data-entry", name: "From Data (10 values)",
    fields: [
      { name: "v1", label: "Value 1", type: "number", placeholder: "e.g. 23" },
      { name: "v2", label: "Value 2", type: "number", placeholder: "e.g. 25" },
      { name: "v3", label: "Value 3", type: "number", placeholder: "e.g. 31" },
      { name: "v4", label: "Value 4", type: "number", placeholder: "e.g. 35" },
      { name: "v5", label: "Value 5", type: "number", placeholder: "e.g. 38" },
      { name: "v6", label: "Value 6", type: "number", placeholder: "e.g. 42" },
      { name: "v7", label: "Value 7", type: "number", placeholder: "e.g. 44" },
      { name: "v8", label: "Value 8", type: "number", placeholder: "e.g. 47" },
      { name: "v9", label: "Value 9", type: "number", placeholder: "e.g. 51" },
      { name: "v10", label: "Value 10", type: "number", placeholder: "e.g. 56" },
    ],
    calculate: (inputs) => {
      const data = [inputs.v1, inputs.v2, inputs.v3, inputs.v4, inputs.v5, inputs.v6, inputs.v7, inputs.v8, inputs.v9, inputs.v10].filter((v) => v !== undefined && !isNaN(v as number)) as number[];
      if (data.length < 3) return null;
      data.sort((a, b) => a - b);
      const stems = new Map<number, number[]>();
      data.forEach((v) => {
        const s = Math.floor(v / 10);
        const l = Math.round(v % 10);
        if (!stems.has(s)) stems.set(s, []);
        stems.get(s)!.push(l);
      });
      const plotLines: string[] = [];
      Array.from(stems.keys()).sort((a, b) => a - b).forEach((s) => {
        plotLines.push(s + " | " + stems.get(s)!.join(" "));
      });
      const mean = data.reduce((s, v) => s + v, 0) / data.length;
      const median = data.length % 2 === 0 ? (data[data.length / 2 - 1] + data[data.length / 2]) / 2 : data[Math.floor(data.length / 2)];
      return {
        primary: { label: "Stem-and-Leaf Plot", value: plotLines.join(" // ") },
        details: [
          { label: "n", value: formatNumber(data.length) },
          { label: "Min", value: formatNumber(data[0]) },
          { label: "Max", value: formatNumber(data[data.length - 1]) },
          { label: "Mean", value: formatNumber(mean, 2) },
          { label: "Median", value: formatNumber(median, 2) },
        ],
      };
    },
  }],
  relatedSlugs: ["box-plot-calculator", "interquartile-range-calculator"],
  faq: [{ question: "What is a stem-and-leaf plot?", answer: "A stem-and-leaf plot splits each value into a stem (leading digits) and leaf (last digit), showing distribution shape while preserving all data values." }],
  formula: "Each value: stem = leading digit(s), leaf = last digit",
};
