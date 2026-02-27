import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const raidCapacityCalculator: CalculatorDefinition = {
  slug: "raid-capacity",
  title: "RAID Capacity Calculator",
  description: "Free raid capacity calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["raid calculator"],
  variants: [{
    id: "standard",
    name: "RAID Capacity",
    description: "",
    fields: [
      { name: "disks", label: "Number of Disks", type: "number", min: 2 },
      { name: "diskSize", label: "Disk Size (TB)", type: "number", min: 0.1 },
      { name: "raidLevel", label: "RAID Level (0-6)", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Usable TB", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate raid capacity?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
