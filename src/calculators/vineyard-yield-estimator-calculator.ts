import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vineyardYieldEstimatorCalculator: CalculatorDefinition = {
  slug: "vineyard-yield-estimator-calculator",
  title: "Vineyard Yield Estimator Calculator",
  description: "Estimate grape yield per acre and total vineyard production based on vine spacing, clusters per vine, and average berry weight.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["vineyard yield","grape production calculator","wine grape yield estimator"],
  variants: [{
    id: "standard",
    name: "Vineyard Yield Estimator",
    description: "Estimate grape yield per acre and total vineyard production based on vine spacing, clusters per vine, and average berry weight.",
    fields: [
      { name: "vinesPerAcre", label: "Vines Per Acre", type: "number", min: 200, max: 4000, defaultValue: 1200 },
      { name: "clustersPerVine", label: "Clusters Per Vine", type: "number", min: 5, max: 80, defaultValue: 30 },
      { name: "clusterWeight", label: "Avg Cluster Weight (oz)", type: "number", min: 1, max: 16, defaultValue: 4 },
      { name: "totalAcres", label: "Vineyard Acres", type: "number", min: 0.1, max: 5000, defaultValue: 20 },
      { name: "grapePrice", label: "Grape Price ($/ton)", type: "number", min: 200, max: 10000, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
      const vpa = inputs.vinesPerAcre as number;
      const cpv = inputs.clustersPerVine as number;
      const cw = inputs.clusterWeight as number;
      const ac = inputs.totalAcres as number;
      const gp = inputs.grapePrice as number;
      if (!vpa || !cpv || !cw || !ac || !gp) return null;
      const lbsPerVine = Math.round(cpv * cw / 16 * 100) / 100;
      const lbsPerAcre = Math.round(lbsPerVine * vpa);
      const tonsPerAcre = Math.round(lbsPerAcre / 2000 * 100) / 100;
      const totalTons = Math.round(tonsPerAcre * ac * 100) / 100;
      const revenuePerAcre = Math.round(tonsPerAcre * gp);
      const totalRevenue = Math.round(totalTons * gp);
      return {
        primary: { label: "Tons Per Acre", value: formatNumber(tonsPerAcre) },
        details: [
          { label: "Lbs Per Vine", value: formatNumber(lbsPerVine) + " lb" },
          { label: "Lbs Per Acre", value: formatNumber(lbsPerAcre) + " lb" },
          { label: "Total Tons", value: formatNumber(totalTons) },
          { label: "Revenue Per Acre", value: "$" + formatNumber(revenuePerAcre) },
          { label: "Total Revenue", value: "$" + formatNumber(totalRevenue) },
        ],
      };
  },
  }],
  relatedSlugs: ["orchard-tree-spacing-calculator","crop-yield-calculator"],
  faq: [
    { question: "What is a typical grape yield per acre?", answer: "Wine grape yields typically range from 2 to 10 tons per acre. Premium wine regions often target 3 to 5 tons per acre for higher quality. Table grape vineyards can produce 8 to 15 tons per acre." },
    { question: "How many bottles of wine per ton of grapes?", answer: "One ton of grapes produces approximately 60 to 70 cases or 720 to 840 bottles of wine, depending on grape variety and winemaking process." },
  ],
  formula: "Lbs Per Vine = Clusters x Cluster Weight (oz) / 16
Tons Per Acre = (Lbs Per Vine x Vines Per Acre) / 2000
Revenue = Tons x Price Per Ton",
};
