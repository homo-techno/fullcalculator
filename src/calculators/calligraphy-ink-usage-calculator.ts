import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const calligraphyInkUsageCalculator: CalculatorDefinition = {
  slug: "calligraphy-ink-usage-calculator",
  title: "Calligraphy Ink Usage Calculator",
  description: "Estimate ink consumption for calligraphy projects based on writing area, nib size, and ink type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["calligraphy ink","ink usage calculator","fountain pen ink","calligraphy supplies"],
  variants: [{
    id: "standard",
    name: "Calligraphy Ink Usage",
    description: "Estimate ink consumption for calligraphy projects based on writing area, nib size, and ink type.",
    fields: [
      { name: "numPages", label: "Number of Pages", type: "number", min: 1, max: 500, defaultValue: 10 },
      { name: "linesPerPage", label: "Lines Per Page", type: "number", min: 1, max: 50, defaultValue: 20 },
      { name: "nibSize", label: "Nib Size", type: "select", options: [{ value: "1", label: "Fine (0.5-1mm)" }, { value: "2", label: "Medium (1.5-2mm)" }, { value: "3", label: "Broad (2.5-4mm)" }, { value: "4", label: "Extra Broad (5mm+)" }], defaultValue: "2" },
      { name: "inkType", label: "Ink Type", type: "select", options: [{ value: "1", label: "Iron Gall" }, { value: "2", label: "Carbon/Sumi" }, { value: "3", label: "Fountain Pen Ink" }, { value: "4", label: "Gouache/Watercolor" }], defaultValue: "1" },
      { name: "lineLength", label: "Average Line Length (inches)", type: "number", min: 2, max: 12, defaultValue: 7 },
    ],
    calculate: (inputs) => {
    const pages = inputs.numPages as number;
    const lines = inputs.linesPerPage as number;
    const nib = parseInt(inputs.nibSize as string);
    const inkType = parseInt(inputs.inkType as string);
    const lineLen = inputs.lineLength as number;
    const nibFactor = { 1: 0.003, 2: 0.006, 3: 0.012, 4: 0.02 };
    const inkFactor = { 1: 1.0, 2: 1.2, 3: 0.8, 4: 1.5 };
    const mlPerInch = (nibFactor[nib] || 0.006) * (inkFactor[inkType] || 1.0);
    const totalInches = pages * lines * lineLen;
    const totalMl = totalInches * mlPerInch;
    const bottles30ml = Math.ceil(totalMl / 30);
    const dipLoads = Math.round(totalMl / 0.05);
    return {
      primary: { label: "Total Ink Needed", value: formatNumber(Math.round(totalMl * 10) / 10) + " ml" },
      details: [
        { label: "30ml Bottles Needed", value: formatNumber(bottles30ml) },
        { label: "Total Writing Length", value: formatNumber(Math.round(totalInches / 12)) + " feet" },
        { label: "Estimated Dip Loads", value: formatNumber(dipLoads) },
        { label: "Ink Per Page", value: formatNumber(Math.round(totalMl / pages * 100) / 100) + " ml" }
      ]
    };
  },
  }],
  relatedSlugs: ["card-making-supplies-calculator","scrapbook-page-layout-calculator"],
  faq: [
    { question: "How long does a bottle of calligraphy ink last?", answer: "A 30ml bottle of calligraphy ink can last 50 to 200 pages depending on nib width and writing density. Fine nibs use much less ink than broad nibs." },
    { question: "What ink is best for calligraphy beginners?", answer: "Iron gall ink is traditional and flows well from a dip pen. Sumi ink is great for brush calligraphy. Fountain pen inks are convenient but may feather on some papers." },
    { question: "Does nib size affect ink consumption?", answer: "Yes, significantly. A broad nib can use 4 to 6 times more ink than a fine nib because it deposits a wider line of ink on the paper." },
  ],
  formula: "Ink Per Inch = Nib Factor x Ink Type Factor
Total Ink (ml) = Pages x Lines Per Page x Line Length x Ink Per Inch
Bottles = ceil(Total Ink / 30 ml)",
};
