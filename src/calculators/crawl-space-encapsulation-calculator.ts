import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crawlSpaceEncapsulationCalculator: CalculatorDefinition = {
  slug: "crawl-space-encapsulation-calculator",
  title: "Crawl Space Encapsulation Calculator",
  description: "Estimate material costs for crawl space encapsulation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["crawl space encapsulation","vapor barrier cost","crawl space sealing"],
  variants: [{
    id: "standard",
    name: "Crawl Space Encapsulation",
    description: "Estimate material costs for crawl space encapsulation.",
    fields: [
      { name: "length", label: "Crawl Space Length (ft)", type: "number", min: 5, max: 200, defaultValue: 40 },
      { name: "width", label: "Crawl Space Width (ft)", type: "number", min: 5, max: 200, defaultValue: 30 },
      { name: "wallHeight", label: "Wall Height (ft)", type: "number", min: 1, max: 6, defaultValue: 3 },
      { name: "dehumidifier", label: "Include Dehumidifier", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const wh = inputs.wallHeight as number;
      const dehu = inputs.dehumidifier as string;
      if (!l || !w || !wh) return null;
      const floorArea = l * w;
      const wallArea = 2 * (l + w) * wh;
      const totalBarrier = floorArea + wallArea;
      const barrierCost = totalBarrier * 0.5;
      const tapeCost = (2 * (l + w) + l * 2) * 0.25;
      const dehuCost = dehu === "1" ? 800 : 0;
      const total = barrierCost + tapeCost + dehuCost;
      return {
        primary: { label: "Estimated Material Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Barrier Needed", value: formatNumber(Math.round(totalBarrier)) + " sq ft" },
          { label: "Barrier Cost", value: "$" + formatNumber(Math.round(barrierCost)) },
          { label: "Tape and Sealant", value: "$" + formatNumber(Math.round(tapeCost)) },
          { label: "Dehumidifier", value: "$" + formatNumber(dehuCost) },
        ],
      };
  },
  }],
  relatedSlugs: ["insulation-calculator","dehumidifier-calculator"],
  faq: [
    { question: "How much does crawl space encapsulation cost?", answer: "DIY materials cost $1,500 to $5,000; professional install is $5,000 to $15,000." },
    { question: "Is crawl space encapsulation worth it?", answer: "Yes, it prevents moisture damage, mold, and improves energy efficiency." },
  ],
  formula: "Cost = (Floor + Wall Area) x Barrier Rate + Tape + Dehumidifier",
};
