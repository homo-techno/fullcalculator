import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wineSulfiteCalculator: CalculatorDefinition = {
  slug: "wine-sulfite-calculator",
  title: "Wine Sulfite Calculator",
  description: "Calculate sulfite additions for winemaking.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["wine sulfite","SO2 addition calculator"],
  variants: [{
    id: "standard",
    name: "Wine Sulfite",
    description: "Calculate sulfite additions for winemaking.",
    fields: [
      { name: "volumeGal", label: "Wine Volume (gallons)", type: "number", min: 1, max: 1000, defaultValue: 6 },
      { name: "currentSo2", label: "Current Free SO2 (ppm)", type: "number", min: 0, max: 100, defaultValue: 10 },
      { name: "targetSo2", label: "Target Free SO2 (ppm)", type: "number", min: 10, max: 100, defaultValue: 35 },
      { name: "ph", label: "Wine pH", type: "number", min: 2.8, max: 4.2, defaultValue: 3.4 },
    ],
    calculate: (inputs) => {
      const vol = inputs.volumeGal as number;
      const current = inputs.currentSo2 as number;
      const target = inputs.targetSo2 as number;
      const ph = inputs.ph as number;
      if (!vol || !target || !ph) return null;
      const needed = target - current;
      if (needed <= 0) return { primary: { label: "Status", value: "SO2 already at or above target" }, details: [] };
      const liters = vol * 3.785;
      const kmeta = Math.round(needed * liters / 570 * 100) / 100;
      const campden = Math.round(kmeta / 0.44 * 10) / 10;
      return {
        primary: { label: "Potassium Metabisulfite", value: formatNumber(kmeta) + " g" },
        details: [
          { label: "Campden Tablets", value: formatNumber(campden) + " tablets" },
          { label: "SO2 Increase", value: formatNumber(needed) + " ppm" },
          { label: "Wine pH", value: formatNumber(ph) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What SO2 level is safe for wine?", answer: "Most wines need 25 to 50 ppm free SO2 for preservation." },
    { question: "Does pH affect sulfite needs?", answer: "Yes. Higher pH wines need more free SO2 for protection." },
  ],
  formula: "KMeta (g) = (Target - Current) x Liters / 570",
};
