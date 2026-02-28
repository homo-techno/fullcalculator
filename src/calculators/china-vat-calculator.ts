import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chinaVatCalculator: CalculatorDefinition = {
  slug: "china-vat-calculator",
  title: "China VAT Calculator",
  description: "Free China VAT (增值税) calculator. Calculate VAT at 13%, 9%, 6%, or 1% rates for goods and services.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["china vat calculator", "china zengzhishui calculator", "china tax on goods"],
  variants: [{
    id: "standard",
    name: "China VAT",
    description: "Free China VAT (增值税) calculator",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "¥", min: 0 },
      { name: "rate", label: "VAT Rate", type: "select", options: [{ label: "13% (Manufacturing, goods)", value: "13" }, { label: "9% (Transport, construction)", value: "9" }, { label: "6% (Services)", value: "6" }, { label: "1% (Small-scale)", value: "1" }], defaultValue: "13" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const rate = parseFloat(inputs.rate as string);
      if (!amount || amount <= 0) return null;
      const vat = amount * rate / 100;
      return {
        primary: { label: "Total (incl. VAT)", value: "¥" + formatNumber(amount + vat) },
        details: [
          { label: "VAT amount", value: "¥" + formatNumber(vat) },
          { label: "VAT rate", value: rate + "%" },
          { label: "Base amount", value: "¥" + formatNumber(amount) },
        ],
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are the VAT rates in China?", answer: "China has 4 VAT rates: 13% (manufacturing, goods), 9% (transport, construction, real estate), 6% (financial and modern services), 1% (small-scale taxpayers, reduced from 3%)." },
    { question: "Who needs to pay VAT in China?", answer: "All businesses selling goods or providing services in China must pay VAT. Small-scale taxpayers (annual sales under ¥5M) pay a reduced 1% rate." },
  ],
  formula: "VAT = Amount × Rate%. Total = Amount + VAT",
};
