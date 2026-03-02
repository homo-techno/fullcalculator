import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hairColorCostCalculator: CalculatorDefinition = {
  slug: "hair-color-cost-calculator",
  title: "Hair Color Cost Calculator",
  description: "Estimate total cost for hair coloring services at a salon.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hair color cost","hair dye price","salon color cost"],
  variants: [{
    id: "standard",
    name: "Hair Color Cost",
    description: "Estimate total cost for hair coloring services at a salon.",
    fields: [
      { name: "serviceType", label: "Color Service", type: "select", options: [{ value: "75", label: "Single Process" }, { value: "150", label: "Highlights" }, { value: "200", label: "Balayage" }, { value: "250", label: "Full Color Correction" }] },
      { name: "hairLength", label: "Hair Length", type: "select", options: [{ value: "1", label: "Short" }, { value: "1.2", label: "Medium" }, { value: "1.5", label: "Long" }] },
      { name: "toner", label: "Toner Add-On ($)", type: "number", min: 0, max: 100, defaultValue: 30 },
      { name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const serviceType = parseInt(inputs.serviceType as string);
    const hairLength = parseFloat(inputs.hairLength as string);
    const toner = inputs.toner as number;
    const tip = inputs.tip as number;
    const serviceTotal = serviceType * hairLength + toner;
    const tipAmount = serviceTotal * (tip / 100);
    const grandTotal = serviceTotal + tipAmount;
    return {
      primary: { label: "Total Hair Color Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Service Cost", value: "$" + formatNumber(serviceType * hairLength) },
        { label: "Toner Add-On", value: "$" + formatNumber(toner) },
        { label: "Tip Amount", value: "$" + formatNumber(tipAmount) }
      ]
    };
  },
  }],
  relatedSlugs: ["haircut-frequency-calculator","hair-extension-cost-calculator"],
  faq: [
    { question: "How much does hair coloring cost at a salon?", answer: "Prices range from $75 for single process to $300 or more for balayage." },
    { question: "Does hair length affect the price?", answer: "Yes, longer hair requires more product and time, increasing the cost." },
    { question: "How often should you color your hair?", answer: "Most color services need a touch-up every 4 to 8 weeks." },
  ],
  formula: "Total = (Service Base x Length Multiplier + Toner) x (1 + Tip%)",
};
