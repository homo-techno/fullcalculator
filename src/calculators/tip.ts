import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tipCalculator: CalculatorDefinition = {
  slug: "tip-calculator",
  title: "Tip Calculator",
  description:
    "Free tip calculator. Calculate how much to tip at restaurants, split the bill between friends, and figure out the total cost including tip.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "$",
  keywords: ["tip calculator", "restaurant tip", "bill splitter", "gratuity calculator"],
  variants: [
    {
      id: "simple",
      name: "Simple Tip",
      description: "Calculate tip amount and total",
      fields: [
        {
          name: "bill",
          label: "Bill Amount",
          type: "number",
          placeholder: "e.g. 85.50",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "tipPercent",
          label: "Tip Percentage",
          type: "number",
          placeholder: "e.g. 18",
          suffix: "%",
          defaultValue: 18,
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const bill = inputs.bill as number;
        const tipPct = inputs.tipPercent as number;
        if (!bill) return null;
        if (!tipPct && tipPct !== 0) return null;
        const tip = bill * (tipPct / 100);
        const total = bill + tip;
        return {
          primary: { label: "Tip Amount", value: `$${formatNumber(tip)}` },
          details: [
            { label: "Total with tip", value: `$${formatNumber(total)}` },
            { label: "Bill", value: `$${formatNumber(bill)}` },
          ],
        };
      },
    },
    {
      id: "split",
      name: "Split Bill",
      description: "Split the bill and tip among multiple people",
      fields: [
        {
          name: "bill",
          label: "Bill Amount",
          type: "number",
          placeholder: "e.g. 120",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "tipPercent",
          label: "Tip Percentage",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "%",
          defaultValue: 18,
          min: 0,
          max: 100,
        },
        {
          name: "people",
          label: "Number of People",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 100,
          defaultValue: 2,
        },
      ],
      calculate: (inputs) => {
        const bill = inputs.bill as number;
        const tipPct = inputs.tipPercent as number;
        const people = inputs.people as number;
        if (!bill || !people) return null;
        if (!tipPct && tipPct !== 0) return null;
        const tip = bill * (tipPct / 100);
        const total = bill + tip;
        const perPerson = total / people;
        const tipPerPerson = tip / people;
        return {
          primary: {
            label: "Each person pays",
            value: `$${formatNumber(perPerson)}`,
          },
          details: [
            { label: "Total bill with tip", value: `$${formatNumber(total)}` },
            { label: "Total tip", value: `$${formatNumber(tip)}` },
            { label: "Tip per person", value: `$${formatNumber(tipPerPerson)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "compound-interest-calculator"],
  faq: [
    {
      question: "How much should I tip at a restaurant?",
      answer:
        "In the US, the standard tip is 15-20% of the pre-tax bill. For excellent service, 20-25% is customary. For poor service, 10-15% is acceptable.",
    },
    {
      question: "How do I calculate a tip?",
      answer:
        "Multiply the bill amount by the tip percentage divided by 100. For example, a 20% tip on a $50 bill: $50 x 0.20 = $10 tip.",
    },
  ],
  formula: "Tip = Bill Amount x (Tip % / 100)",
};
