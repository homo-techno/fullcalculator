import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const currencyTipCalculator: CalculatorDefinition = {
  slug: "currency-tip-calculator",
  title: "Currency Tip Calculator",
  description:
    "Free currency tip calculator. Calculate the tip amount in local currency and convert to a foreign currency using an exchange rate.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "tip calculator",
    "currency converter",
    "tip in foreign currency",
    "exchange rate tip",
    "travel tip",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Tip with Currency Conversion",
      fields: [
        {
          name: "billAmount",
          label: "Bill Amount (local currency)",
          type: "number",
          placeholder: "e.g. 50.00",
        },
        {
          name: "tipPercent",
          label: "Tip Percentage (%)",
          type: "number",
          placeholder: "e.g. 18",
        },
        {
          name: "exchangeRate",
          label: "Exchange Rate (1 local = X foreign)",
          type: "number",
          placeholder: "e.g. 0.85",
        },
      ],
      calculate: (inputs) => {
        const bill = inputs.billAmount as number;
        const tipPct = inputs.tipPercent as number;
        const rate = inputs.exchangeRate as number;

        if (!bill || !tipPct) return null;
        if (bill <= 0 || tipPct < 0) return null;

        const tipAmount = bill * (tipPct / 100);
        const totalWithTip = bill + tipAmount;

        const details: { label: string; value: string }[] = [
          {
            label: "Bill Amount",
            value: formatNumber(bill, 2),
          },
          {
            label: "Tip Percentage",
            value: `${formatNumber(tipPct, 1)}%`,
          },
          {
            label: "Tip Amount (local)",
            value: formatNumber(tipAmount, 2),
          },
          {
            label: "Total with Tip (local)",
            value: formatNumber(totalWithTip, 2),
          },
        ];

        if (rate && rate > 0) {
          const tipConverted = tipAmount * rate;
          const totalConverted = totalWithTip * rate;
          const billConverted = bill * rate;

          details.push({
            label: "Exchange Rate",
            value: formatNumber(rate, 4),
          });
          details.push({
            label: "Bill (converted)",
            value: formatNumber(billConverted, 2),
          });
          details.push({
            label: "Tip (converted)",
            value: formatNumber(tipConverted, 2),
          });
          details.push({
            label: "Total with Tip (converted)",
            value: formatNumber(totalConverted, 2),
          });
        }

        return {
          primary: {
            label: "Tip Amount",
            value: formatNumber(tipAmount, 2),
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["travel-budget-calculator", "recipe-scaler-calculator"],
  faq: [
    {
      question: "How is the tip calculated?",
      answer:
        "Tip = Bill Amount x (Tip Percentage / 100). The converted amount is then Tip x Exchange Rate.",
    },
    {
      question: "What is a standard tip percentage?",
      answer:
        "In the US, 15-20% is standard for restaurants. In many European countries, 5-10% is common. Some countries include service charges in the bill, making tipping optional.",
    },
  ],
  formula:
    "Tip = Bill x Tip% / 100. Converted Tip = Tip x Exchange Rate. Total = Bill + Tip.",
};
