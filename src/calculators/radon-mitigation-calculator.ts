import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const radonMitigationCalculator: CalculatorDefinition = {
  slug: "radon-mitigation-calculator",
  title: "Radon Mitigation Cost Calculator",
  description: "Estimate the cost of radon mitigation based on your home type and radon level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["radon mitigation cost", "radon remediation", "radon reduction calculator"],
  variants: [{
    id: "standard",
    name: "Radon Mitigation Cost",
    description: "Estimate the cost of radon mitigation based on your home type and radon level",
    fields: [
      { name: "radonLevel", label: "Current Radon Level", type: "number", suffix: "pCi/L", min: 0.5, max: 50, step: 0.1, defaultValue: 6 },
      { name: "homeType", label: "Home Type", type: "select", options: [{value:"slab",label:"Slab on Grade"},{value:"basement",label:"Basement"},{value:"crawl",label:"Crawl Space"},{value:"multi",label:"Multiple Foundation Types"}], defaultValue: "basement" },
      { name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 500, max: 10000, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
      const radon = inputs.radonLevel as number;
      const homeType = inputs.homeType as string;
      const size = inputs.homeSize as number;
      if (!radon || !size) return null;
      const baseCost: Record<string, number> = { slab: 1000, basement: 1200, crawl: 1100, multi: 1800 };
      const sizeMod = size > 3000 ? 1.3 : size > 2000 ? 1.15 : 1.0;
      const levelMod = radon > 20 ? 1.5 : radon > 10 ? 1.25 : 1.0;
      const installCost = (baseCost[homeType] || 1200) * sizeMod * levelMod;
      const annualRunning = 50;
      const needsMitigation = radon >= 4;
      const expectedReduction = radon * 0.85;
      const afterLevel = radon - expectedReduction;
      return {
        primary: { label: "Estimated Mitigation Cost", value: "$" + formatNumber(Math.round(installCost)) },
        details: [
          { label: "Action Required", value: needsMitigation ? "Mitigation recommended (above 4 pCi/L)" : "Below EPA action level" },
          { label: "Expected Post-Mitigation Level", value: formatNumber(Math.round(afterLevel * 10) / 10) + " pCi/L" },
          { label: "Annual Operating Cost", value: "$" + formatNumber(annualRunning) },
        ],
      };
    },
  }],
  relatedSlugs: ["mold-remediation-calculator", "home-energy-score-calculator"],
  faq: [
    { question: "What radon level requires mitigation?", answer: "The EPA recommends mitigation for radon levels at or above 4 pCi/L. Levels between 2 and 4 pCi/L should also be considered for mitigation." },
    { question: "How much does radon mitigation cost?", answer: "Most radon mitigation systems cost $800 to $2,500 for installation, with an average of about $1,200. The annual operating cost is typically $40 to $60 for the fan." },
  ],
  formula: "Cost = Base Cost x Size Modifier x Level Modifier",
};
