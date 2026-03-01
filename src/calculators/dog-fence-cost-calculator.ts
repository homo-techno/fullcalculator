import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogFenceCostCalculator: CalculatorDefinition = {
  slug: "dog-fence-cost-calculator",
  title: "Dog Fence Cost Calculator",
  description: "Estimate the cost of installing an invisible or wireless dog fence system for your yard.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dog fence cost", "invisible fence cost", "wireless dog fence cost"],
  variants: [{
    id: "standard",
    name: "Dog Fence Cost",
    description: "Estimate the cost of installing an invisible or wireless dog fence system for your yard",
    fields: [
      { name: "type", label: "Fence Type", type: "select", options: [{value:"wireless",label:"Wireless"},{value:"inground",label:"In-Ground Wire"},{value:"gps",label:"GPS Collar System"}], defaultValue: "inground" },
      { name: "area", label: "Yard Area", type: "number", suffix: "sq ft", min: 500, max: 50000, defaultValue: 5000 },
      { name: "dogs", label: "Number of Dogs", type: "number", suffix: "dogs", min: 1, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const type = inputs.type as string;
      const area = inputs.area as number;
      const dogs = inputs.dogs as number;
      if (!area || area <= 0 || !dogs || dogs <= 0) return null;
      const perimeter = Math.sqrt(area) * 4;
      const baseCost: Record<string, number> = { wireless: 300, inground: 200, gps: 0 };
      const perFootCost: Record<string, number> = { wireless: 0, inground: 1.5, gps: 0 };
      const collarCost: Record<string, number> = { wireless: 100, inground: 75, gps: 400 };
      const installCost: Record<string, number> = { wireless: 100, inground: 500, gps: 0 };
      const base = baseCost[type] || 200;
      const wireCost = perimeter * (perFootCost[type] || 0);
      const collars = dogs * (collarCost[type] || 100);
      const install = installCost[type] || 200;
      const training = 200;
      const total = base + wireCost + collars + install + training;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Base System", value: "$" + formatNumber(base) },
          { label: "Wire/Perimeter", value: "$" + formatNumber(wireCost) },
          { label: "Collars (" + dogs + ")", value: "$" + formatNumber(collars) },
          { label: "Installation", value: "$" + formatNumber(install) },
          { label: "Training", value: "$" + formatNumber(training) },
          { label: "Est. Perimeter", value: formatNumber(Math.round(perimeter)) + " ft" },
        ],
      };
    },
  }],
  relatedSlugs: ["artificial-turf-cost-calculator", "french-drain-calculator"],
  faq: [
    { question: "How much does an invisible dog fence cost?", answer: "A DIY in-ground fence system costs $200 to $500. Professional installation runs $1,000 to $2,500 depending on yard size. Wireless systems cost $300 to $600." },
    { question: "Do invisible fences work for all dogs?", answer: "Invisible fences work well for most dogs when combined with proper training. They may not be suitable for very stubborn breeds or dogs with high prey drive." },
  ],
  formula: "Total = Base System + Wire Cost + (Dogs x Collar Cost) + Installation + Training",
};
