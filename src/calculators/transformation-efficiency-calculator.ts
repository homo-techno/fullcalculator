import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const transformationEfficiencyCalculator: CalculatorDefinition = {
  slug: "transformation-efficiency-calculator",
  title: "Transformation Efficiency Calculator",
  description: "Calculate bacterial transformation efficiency as colony forming units per microgram of plasmid DNA from transformation experiment plate counts.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["transformation efficiency","bacterial transformation","cfu per microgram","competent cell efficiency","plasmid transformation"],
  variants: [{
    id: "standard",
    name: "Transformation Efficiency",
    description: "Calculate bacterial transformation efficiency as colony forming units per microgram of plasmid DNA from transformation experiment plate counts.",
    fields: [
      { name: "colonies", label: "Colonies on Plate", type: "number", min: 1, max: 10000, defaultValue: 150 },
      { name: "dnaAmount", label: "DNA Used (ng)", type: "number", min: 0.01, max: 1000, defaultValue: 10 },
      { name: "totalVolume", label: "Total Recovery Volume (uL)", type: "number", min: 100, max: 5000, defaultValue: 1000 },
      { name: "volumePlated", label: "Volume Plated (uL)", type: "number", min: 10, max: 1000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const colonies = inputs.colonies as number;
    const dnaAmount = inputs.dnaAmount as number;
    const totalVolume = inputs.totalVolume as number;
    const volumePlated = inputs.volumePlated as number;
    const totalColonies = colonies * (totalVolume / volumePlated);
    const dnaUg = dnaAmount / 1000;
    const efficiency = totalColonies / dnaUg;
    var rating = "Low (chemical competent)";
    if (efficiency >= 1e6) { rating = "Good (chemical competent)"; }
    if (efficiency >= 1e8) { rating = "High (electrocompetent)"; }
    if (efficiency >= 1e9) { rating = "Excellent (ultra-competent)"; }
    return {
      primary: { label: "Transformation Efficiency", value: formatNumber(Math.round(efficiency)) + " CFU/ug" },
      details: [
        { label: "Total Colonies (adjusted)", value: formatNumber(Math.round(totalColonies)) },
        { label: "DNA Amount", value: formatNumber(dnaUg * 1000) + " ng (" + formatNumber(dnaUg) + " ug)" },
        { label: "Competency Rating", value: rating },
        { label: "Plating Fraction", value: formatNumber(Math.round(volumePlated / totalVolume * 100)) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["ligation-ratio-calculator","cfu-colony-counting-calculator","dna-concentration-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Colonies = Counted Colonies x (Total Volume / Volume Plated); Efficiency (CFU/ug) = Total Colonies / DNA (ug)",
};
