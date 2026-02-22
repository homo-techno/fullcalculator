import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tipSplitCalculator: CalculatorDefinition = {
  slug: "tip-split-calculator",
  title: "Tip Split Calculator",
  description:
    "Free tip and bill split calculator. Split the bill evenly among friends, calculate custom tip percentages, and see per-person totals for group dining.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "tip calculator",
    "bill split",
    "split the bill",
    "tip split",
    "group dining",
    "restaurant tip",
    "gratuity calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Split Bill with Tip",
      fields: [
        {
          name: "billAmount",
          label: "Bill Total ($)",
          type: "number",
          placeholder: "e.g. 85.50",
          prefix: "$",
        },
        {
          name: "tipPercent",
          label: "Tip Percentage",
          type: "select",
          options: [
            { label: "10%", value: "10" },
            { label: "15%", value: "15" },
            { label: "18%", value: "18" },
            { label: "20%", value: "20" },
            { label: "22%", value: "22" },
            { label: "25%", value: "25" },
            { label: "30%", value: "30" },
          ],
          defaultValue: "20",
        },
        {
          name: "numPeople",
          label: "Number of People",
          type: "number",
          placeholder: "e.g. 4",
          defaultValue: 2,
        },
      ],
      calculate: (inputs) => {
        const bill = inputs.billAmount as number;
        const tipPct = parseFloat(inputs.tipPercent as string);
        const people = inputs.numPeople as number;

        if (!bill || !tipPct || !people) return null;
        if (bill <= 0 || people < 1) return null;

        const tipAmount = bill * (tipPct / 100);
        const totalWithTip = bill + tipAmount;
        const perPerson = totalWithTip / people;
        const tipPerPerson = tipAmount / people;

        const roundedUp = Math.ceil(perPerson);
        const extraFromRounding = (roundedUp * people) - totalWithTip;

        return {
          primary: {
            label: "Per Person",
            value: `$${formatNumber(perPerson, 2)}`,
          },
          details: [
            { label: "Bill Subtotal", value: `$${formatNumber(bill, 2)}` },
            { label: `Tip (${tipPct}%)`, value: `$${formatNumber(tipAmount, 2)}` },
            { label: "Total with Tip", value: `$${formatNumber(totalWithTip, 2)}` },
            { label: "Per Person (exact)", value: `$${formatNumber(perPerson, 2)}` },
            { label: "Tip Per Person", value: `$${formatNumber(tipPerPerson, 2)}` },
            { label: "Rounded Up Per Person", value: `$${formatNumber(roundedUp, 2)}` },
            { label: "Extra from Rounding", value: `$${formatNumber(extraFromRounding, 2)}` },
            { label: "Number of People", value: formatNumber(people, 0) },
          ],
          note: "Tip on the pre-tax amount is standard. Rounding up makes Venmo requests cleaner!",
        };
      },
    },
  ],
  relatedSlugs: ["pizza-size-calculator", "percentage-calculator", "discount-calculator"],
  faq: [
    {
      question: "What is the standard tip percentage in the US?",
      answer:
        "In the US, 15-20% is standard for sit-down restaurants. 20% has become the new baseline for good service. For exceptional service, 25-30% is generous. For takeout, 10-15% is common. Remember that servers in most US states earn well below minimum wage and rely on tips.",
    },
    {
      question: "Should you tip on the pre-tax or post-tax amount?",
      answer:
        "Etiquette experts say tipping on the pre-tax amount is correct, but tipping on the post-tax total is increasingly common and more generous. The difference is usually small — on a $100 meal with 8% tax, it's only about $1.60 difference at 20%.",
    },
    {
      question: "How do you split a bill fairly when people ordered different amounts?",
      answer:
        "For significantly different orders, each person can calculate their share plus an equal portion of the tip. Alternatively, apps like Splitwise or Venmo make it easy. For small differences, most friend groups just split evenly — it averages out over time.",
    },
  ],
  formula:
    "Tip = Bill x (Tip% / 100). Total = Bill + Tip. Per Person = Total / Number of People.",
};
