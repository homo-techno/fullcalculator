import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const essentialOilDilutionCalculator: CalculatorDefinition = {
  slug: "essential-oil-dilution-calculator",
  title: "Essential Oil Dilution Calculator",
  description: "Calculate carrier oil and drops for safe essential oil dilution.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["essential oil dilution","oil dilution calculator"],
  variants: [{
    id: "standard",
    name: "Essential Oil Dilution",
    description: "Calculate carrier oil and drops for safe essential oil dilution.",
    fields: [
      { name: "carrierMl", label: "Carrier Oil (mL)", type: "number", min: 5, max: 500, defaultValue: 30 },
      { name: "dilutionPct", label: "Dilution (%)", type: "select", options: [{ value: "1", label: "1% (Sensitive Skin)" }, { value: "2", label: "2% (Adults General)" }, { value: "3", label: "3% (Acute)" }, { value: "5", label: "5% (Short Term)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
      const carrier = inputs.carrierMl as number;
      const pct = inputs.dilutionPct as number;
      if (!carrier || !pct) return null;
      const eoMl = Math.round(carrier * pct / 100 * 100) / 100;
      const drops = Math.round(eoMl * 20);
      const totalMl = carrier + eoMl;
      return {
        primary: { label: "Essential Oil Drops", value: formatNumber(drops) + " drops" },
        details: [
          { label: "Essential Oil Volume", value: formatNumber(eoMl) + " mL" },
          { label: "Carrier Oil", value: formatNumber(carrier) + " mL" },
          { label: "Total Blend", value: formatNumber(totalMl) + " mL" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What dilution is safe for adults?", answer: "A 2% dilution is generally safe for everyday adult use." },
    { question: "How many drops are in 1 mL of essential oil?", answer: "There are approximately 20 drops per mL of essential oil." },
  ],
  formula: "Drops = Carrier mL x Dilution% / 100 x 20",
};
