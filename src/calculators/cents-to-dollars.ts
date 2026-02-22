import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const centsToDollarsConverter: CalculatorDefinition = {
  slug: "cents-to-dollars-converter",
  title: "Cents to Dollars Converter",
  description: "Free cents to dollars converter. Convert cents to dollars and dollars to cents instantly. Includes coin counting and denomination breakdown.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cents to dollars", "dollars to cents", "penny converter", "coin converter", "money converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Cents to Dollars",
      fields: [
        { name: "value", label: "Cents", type: "number", placeholder: "e.g. 350" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Cents to Dollars", value: "cents_to_dollars" },
          { label: "Dollars to Cents", value: "dollars_to_cents" },
        ], defaultValue: "cents_to_dollars" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        if (direction === "dollars_to_cents") {
          const cents = value * 100;
          const quarters = Math.floor(cents / 25);
          const dimes = Math.floor((cents % 25) / 10);
          const nickels = Math.floor(((cents % 25) % 10) / 5);
          const pennies = Math.round(((cents % 25) % 10) % 5);
          return {
            primary: { label: `$${formatNumber(value, 2)}`, value: `${formatNumber(cents, 0)} cents` },
            details: [
              { label: "Total Cents", value: formatNumber(cents, 0) },
              { label: "Quarters (25¢)", value: String(quarters) },
              { label: "Dimes (10¢)", value: String(dimes) },
              { label: "Nickels (5¢)", value: String(nickels) },
              { label: "Pennies (1¢)", value: String(pennies) },
            ],
          };
        }
        const dollars = value / 100;
        const totalCents = Math.round(value);
        const quarters = Math.floor(totalCents / 25);
        const dimes = Math.floor((totalCents % 25) / 10);
        const nickels = Math.floor(((totalCents % 25) % 10) / 5);
        const pennies = ((totalCents % 25) % 10) % 5;
        return {
          primary: { label: `${formatNumber(value, 0)} cents`, value: `$${formatNumber(dollars, 2)}` },
          details: [
            { label: "Dollars", value: `$${formatNumber(dollars, 2)}` },
            { label: "Quarters (25¢)", value: String(quarters) },
            { label: "Dimes (10¢)", value: String(dimes) },
            { label: "Nickels (5¢)", value: String(nickels) },
            { label: "Pennies (1¢)", value: String(pennies) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "tip-calculator", "discount-calculator"],
  faq: [
    { question: "How do I convert cents to dollars?", answer: "Divide the number of cents by 100. For example, 350 cents = $3.50. The formula is: Dollars = Cents ÷ 100." },
    { question: "How many cents are in a dollar?", answer: "There are 100 cents in 1 dollar. US coins: penny = 1¢, nickel = 5¢, dime = 10¢, quarter = 25¢, half dollar = 50¢, dollar coin = 100¢." },
  ],
  formula: "1 dollar = 100 cents | Dollars = Cents ÷ 100 | Cents = Dollars × 100",
};
