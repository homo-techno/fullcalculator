import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nftRoyaltyCalculator: CalculatorDefinition = {
  slug: "nft-royalty",
  title: "NFT Royalty Calculator",
  description: "Free nft royalty calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nft royalty calculator"],
  variants: [{
    id: "standard",
    name: "NFT Royalty",
    description: "",
    fields: [
      { name: "salePrice", label: "Sale Price ($)", type: "number", min: 0.01 },
      { name: "royaltyPct", label: "Royalty %", type: "number", defaultValue: 5 },
      { name: "volume", label: "Monthly Sales", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Royalty ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate nft royalty?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
