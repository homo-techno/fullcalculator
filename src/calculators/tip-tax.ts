import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tipTaxCalculator: CalculatorDefinition = {
  slug: "tip-tax-calculator",
  title: "Tip on Tax Calculator",
  description: "Free tip and tax calculator. Calculate total bill with tax and tip. Decide whether to tip on pre-tax or post-tax amount.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tip tax calculator", "bill with tax and tip", "restaurant tip calculator", "post tax tip", "pre tax tip"],
  variants: [
    {
      id: "full",
      name: "Bill with Tax & Tip",
      fields: [
        { name: "subtotal", label: "Bill Subtotal", type: "number", placeholder: "e.g. 45.00", prefix: "$" },
        { name: "taxRate", label: "Tax Rate", type: "number", placeholder: "e.g. 8.25", suffix: "%" },
        { name: "tipPercent", label: "Tip Percentage", type: "number", placeholder: "e.g. 20", suffix: "%", defaultValue: 20 },
        { name: "tipOn", label: "Tip Based On", type: "select", options: [
          { label: "Pre-tax subtotal", value: "pre" },
          { label: "Post-tax total", value: "post" },
        ], defaultValue: "pre" },
        { name: "split", label: "Split Between", type: "number", placeholder: "e.g. 1", min: 1, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const subtotal = inputs.subtotal as number;
        const taxRate = (inputs.taxRate as number) || 0;
        const tipPct = (inputs.tipPercent as number) || 0;
        const tipOn = inputs.tipOn as string;
        const split = Math.max((inputs.split as number) || 1, 1);
        if (!subtotal) return null;
        const tax = subtotal * (taxRate / 100);
        const tipBase = tipOn === "post" ? subtotal + tax : subtotal;
        const tip = tipBase * (tipPct / 100);
        const total = subtotal + tax + tip;
        const perPerson = total / split;
        return {
          primary: { label: "Total", value: `$${formatNumber(total)}` },
          details: [
            { label: "Subtotal", value: `$${formatNumber(subtotal)}` },
            { label: "Tax", value: `$${formatNumber(tax)} (${taxRate}%)` },
            { label: "Tip", value: `$${formatNumber(tip)} (${tipPct}% on ${tipOn === "post" ? "post-tax" : "pre-tax"})` },
            ...(split > 1 ? [{ label: `Per person (${split} people)`, value: `$${formatNumber(perPerson)}` }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tip-calculator", "tax-calculator", "discount-calculator"],
  faq: [
    { question: "Should I tip on pre-tax or post-tax?", answer: "Etiquette experts say tipping on pre-tax is correct (the server didn't provide the tax). However, tipping on post-tax is also common. The difference is usually small — on a $50 bill with 8% tax, it's only $0.80 more tip at 20%." },
  ],
  formula: "Total = Subtotal + Tax + Tip | Tip = TipBase × Tip%",
};
