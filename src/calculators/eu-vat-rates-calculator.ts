import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const euVatRatesCalculator: CalculatorDefinition = {
  slug: "eu-vat-rates-calculator",
  title: "EU VAT Rates Comparison Calculator",
  description: "Free EU VAT rate comparison tool. Calculate VAT amounts across all EU member states and compare effective costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["eu vat rates comparison", "european vat calculator", "vat rates europe 2025"],
  variants: [{
    id: "standard",
    name: "EU VAT Rates Comparison",
    description: "Free EU VAT rate comparison tool",
    fields: [
      { name: "amount", label: "Base Amount", type: "number", prefix: "€", min: 0 },
      { name: "country", label: "Country", type: "select", options: [{ label: "Hungary - 27%", value: "27" }, { label: "Denmark - 25%", value: "25" }, { label: "Sweden - 25%", value: "25" }, { label: "Finland - 25.5%", value: "25.5" }, { label: "Greece - 24%", value: "24" }, { label: "Ireland - 23%", value: "23" }, { label: "Poland - 23%", value: "23" }, { label: "Portugal - 23%", value: "23" }, { label: "Italy - 22%", value: "22" }, { label: "Belgium - 21%", value: "21" }, { label: "Netherlands - 21%", value: "21" }, { label: "Spain - 21%", value: "21" }, { label: "Czech Republic - 21%", value: "21" }, { label: "Austria - 20%", value: "20" }, { label: "France - 20%", value: "20" }, { label: "UK - 20%", value: "20" }, { label: "Germany - 19%", value: "19" }, { label: "Romania - 19%", value: "19" }, { label: "Switzerland - 8.1%", value: "8.1" }], defaultValue: "21" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const rate = parseFloat(inputs.country as string);
      if (!amount || amount <= 0) return null;
      const vat = amount * rate / 100;
      const allRates = [27,25.5,25,24,23,22,21,20,19,8.1];
      const comparison = allRates.map(r => ({ label: r + "% VAT", value: "€" + formatNumber(amount * r / 100) }));
      return {
        primary: { label: "VAT Amount", value: "€" + formatNumber(vat) },
        details: [
          { label: "Total incl. VAT", value: "€" + formatNumber(amount + vat) },
          { label: "Selected rate", value: rate + "%" },
          { label: "Lowest EU VAT (Luxembourg 17%)", value: "€" + formatNumber(amount * 0.17) },
          { label: "Highest EU VAT (Hungary 27%)", value: "€" + formatNumber(amount * 0.27) },
          { label: "Difference (high-low)", value: "€" + formatNumber(amount * 0.10) },
        ],
        note: "Standard VAT rates as of 2025. Reduced rates exist for specific goods/services in each country.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "Which EU country has the highest VAT?", answer: "Hungary at 27%, followed by Denmark, Sweden, and Croatia at 25%." },
    { question: "Which EU country has the lowest VAT?", answer: "Luxembourg at 17%, followed by Malta at 18%, and Germany and Romania at 19%." },
  ],
  formula: "VAT = Base Amount × Country VAT Rate",
};
