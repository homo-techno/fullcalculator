import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nftFloorPriceCalculator: CalculatorDefinition = {
  slug: "nft-floor-price-calculator",
  title: "NFT Floor Price Calculator",
  description: "Free nft floor price calculator. Calculate nft floor price quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nft floor price"],
  variants: [{
    id: "standard",
    name: "NFT Floor Price",
    description: "",
    fields: [
      { name: "supply", label: "Collection Supply", type: "number", min: 1 },
      { name: "marketCap", label: "Market Cap ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Floor Price ($)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate nft floor price?", answer: "Enter values and get instant results." },
    { question: "Why use this nft floor price calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
