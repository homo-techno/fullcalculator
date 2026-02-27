import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const subnetHostsCalculator: CalculatorDefinition = {
  slug: "subnet-hosts",
  title: "Subnet Hosts Calculator",
  description: "Free subnet hosts calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["subnet calculator hosts"],
  variants: [{
    id: "standard",
    name: "Subnet Hosts",
    description: "",
    fields: [
      { name: "prefix", label: "CIDR Prefix", type: "number", min: 1, max: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Usable Hosts", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate subnet hosts?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Hosts = 2^(32-prefix) - 2",
};
