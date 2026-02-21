import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dilutionRatioCalculator: CalculatorDefinition = {
  slug: "dilution-ratio-calculator",
  title: "Dilution Ratio Calculator",
  description: "Free dilution ratio calculator. Use C1V1 = C2V2 to calculate dilution volumes, final concentrations, and dilution factors for lab solutions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["dilution ratio", "C1V1=C2V2", "serial dilution", "dilution factor", "solution dilution"],
  variants: [
    {
      id: "findV2",
      name: "Find Final Volume (V2)",
      description: "Given C1, V1, and C2, find the final volume V2",
      fields: [
        { name: "c1", label: "Initial Concentration (C1)", type: "number", placeholder: "e.g. 10" },
        { name: "v1", label: "Initial Volume (V1)", type: "number", placeholder: "e.g. 50" },
        { name: "c2", label: "Final Concentration (C2)", type: "number", placeholder: "e.g. 2" },
        { name: "unit", label: "Concentration Unit", type: "select", options: [
          { label: "Molar (M)", value: "M" },
          { label: "Millimolar (mM)", value: "mM" },
          { label: "Percent (%)", value: "%" },
          { label: "mg/mL", value: "mg/mL" },
          { label: "ppm", value: "ppm" },
        ] },
      ],
      calculate: (inputs) => {
        const c1 = inputs.c1 as number, v1 = inputs.v1 as number, c2 = inputs.c2 as number, unit = inputs.unit as string;
        if (!c1 || !v1 || !c2 || c2 <= 0 || c1 < c2) return null;
        const v2 = (c1 * v1) / c2;
        const diluent = v2 - v1;
        const df = c1 / c2;
        return {
          primary: { label: "Final Volume (V2)", value: `${formatNumber(v2, 4)} mL` },
          details: [
            { label: "Diluent to Add", value: `${formatNumber(diluent, 4)} mL` },
            { label: "Dilution Factor", value: `1:${formatNumber(df, 2)}` },
            { label: "Concentration", value: `${formatNumber(c2, 4)} ${unit || "M"}` },
          ],
        };
      },
    },
    {
      id: "findC2",
      name: "Find Final Concentration (C2)",
      description: "Given C1, V1, and V2, find the final concentration",
      fields: [
        { name: "c1", label: "Initial Concentration (C1)", type: "number", placeholder: "e.g. 10" },
        { name: "v1", label: "Initial Volume (V1, mL)", type: "number", placeholder: "e.g. 50" },
        { name: "v2", label: "Final Volume (V2, mL)", type: "number", placeholder: "e.g. 250" },
        { name: "unit", label: "Concentration Unit", type: "select", options: [
          { label: "Molar (M)", value: "M" },
          { label: "Millimolar (mM)", value: "mM" },
          { label: "Percent (%)", value: "%" },
          { label: "mg/mL", value: "mg/mL" },
          { label: "ppm", value: "ppm" },
        ] },
      ],
      calculate: (inputs) => {
        const c1 = inputs.c1 as number, v1 = inputs.v1 as number, v2 = inputs.v2 as number, unit = inputs.unit as string;
        if (!c1 || !v1 || !v2 || v2 <= 0) return null;
        const c2 = (c1 * v1) / v2;
        const df = v2 / v1;
        return {
          primary: { label: "Final Concentration (C2)", value: `${formatNumber(c2, 6)} ${unit || "M"}` },
          details: [
            { label: "Dilution Factor", value: `1:${formatNumber(df, 2)}` },
            { label: "Volume of Diluent Added", value: `${formatNumber(v2 - v1, 4)} mL` },
          ],
        };
      },
    },
    {
      id: "serialDilution",
      name: "Serial Dilution",
      description: "Calculate concentration after multiple serial dilutions",
      fields: [
        { name: "c1", label: "Starting Concentration", type: "number", placeholder: "e.g. 1.0" },
        { name: "dilutionFactor", label: "Dilution Factor per Step", type: "number", placeholder: "e.g. 10" },
        { name: "steps", label: "Number of Dilution Steps", type: "number", placeholder: "e.g. 3", min: 1, max: 20, step: 1 },
        { name: "unit", label: "Concentration Unit", type: "select", options: [
          { label: "Molar (M)", value: "M" },
          { label: "Millimolar (mM)", value: "mM" },
          { label: "Percent (%)", value: "%" },
          { label: "mg/mL", value: "mg/mL" },
          { label: "ppm", value: "ppm" },
        ] },
      ],
      calculate: (inputs) => {
        const c1 = inputs.c1 as number, df = inputs.dilutionFactor as number, steps = inputs.steps as number, unit = inputs.unit as string;
        if (!c1 || !df || !steps || df <= 1 || steps < 1) return null;
        const finalConc = c1 / Math.pow(df, steps);
        const totalDF = Math.pow(df, steps);
        return {
          primary: { label: "Final Concentration", value: `${finalConc < 0.001 ? finalConc.toExponential(4) : formatNumber(finalConc, 6)} ${unit || "M"}` },
          details: [
            { label: "Starting Concentration", value: `${formatNumber(c1, 6)} ${unit || "M"}` },
            { label: "Dilution Factor per Step", value: `1:${formatNumber(df, 0)}` },
            { label: "Total Dilution Factor", value: `1:${totalDF.toExponential(2)}` },
            { label: "Number of Steps", value: `${steps}` },
          ],
          note: "Serial dilution is commonly used in microbiology for plating and in immunology for antibody titration.",
        };
      },
    },
  ],
  relatedSlugs: ["molarity-calculator", "molality-calculator", "titration-calculator"],
  faq: [
    { question: "What is the dilution equation?", answer: "The dilution equation is C1V1 = C2V2, where C1 and V1 are the initial concentration and volume, and C2 and V2 are the final concentration and volume. This works for any concentration unit as long as both sides use the same unit." },
    { question: "What is a serial dilution?", answer: "A serial dilution is a stepwise dilution of a solution. Each step dilutes by the same factor. For example, three 1:10 serial dilutions give a total dilution of 1:1000. Used in microbiology, ELISA assays, and antibiotic sensitivity testing." },
    { question: "How do I calculate dilution factor?", answer: "Dilution factor = final volume / initial volume, or equivalently, initial concentration / final concentration. A 1:10 dilution means 1 part sample + 9 parts diluent = 10 parts total." },
  ],
  formula: "C₁V₁ = C₂V₂ | Dilution Factor = V_final / V_initial | Serial: C_final = C_initial / DF^n",
};
