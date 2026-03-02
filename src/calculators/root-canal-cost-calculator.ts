import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rootCanalCostCalculator: CalculatorDefinition = {
  slug: "root-canal-cost-calculator",
  title: "Root Canal Cost Calculator",
  description: "Estimate root canal treatment cost by tooth type and insurance coverage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["root canal cost","endodontic treatment price","root canal insurance"],
  variants: [{
    id: "standard",
    name: "Root Canal Cost",
    description: "Estimate root canal treatment cost by tooth type and insurance coverage.",
    fields: [
      { name: "toothType", label: "Tooth Type", type: "select", options: [{ value: "1", label: "Front Tooth" }, { value: "2", label: "Premolar" }, { value: "3", label: "Molar" }] },
      { name: "crownNeeded", label: "Crown Needed After", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] },
      { name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const toothType = inputs.toothType as string;
    const crownNeeded = inputs.crownNeeded as string;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 700, "2": 900, "3": 1200 };
    const names: Record<string, string> = { "1": "Front Tooth", "2": "Premolar", "3": "Molar" };
    const rcCost = prices[toothType] || 700;
    const crownCost = crownNeeded === "1" ? 1200 : 0;
    const total = rcCost + crownCost;
    const covered = total * (insurance / 100);
    const oop = total - covered;
    return {
      primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Tooth Type", value: names[toothType] || "Front Tooth" },
        { label: "Root Canal Cost", value: "$" + formatNumber(rcCost) },
        { label: "Crown Cost", value: "$" + formatNumber(crownCost) },
        { label: "Total Before Insurance", value: "$" + formatNumber(total) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  },
  }],
  relatedSlugs: ["dental-crown-cost-calculator","dental-bridge-cost-calculator","dental-cleaning-frequency-calculator"],
  faq: [
    { question: "How much does a root canal cost on a molar?", answer: "A molar root canal typically costs $1000 to $1500 before insurance." },
    { question: "Do you always need a crown after a root canal?", answer: "Molars and premolars usually need crowns, but front teeth may not require one." },
    { question: "Does insurance cover root canals?", answer: "Most dental plans cover 50% to 80% of root canal costs after the deductible." },
  ],
  formula: "Out-of-Pocket = (Root Canal Cost + Crown Cost) x (1 - Insurance% / 100)",
};
